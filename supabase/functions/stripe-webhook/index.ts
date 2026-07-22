// Supabase Edge Function: Stripe webhook receiver.
//
// Handles `checkout.session.completed` as the guaranteed delivery path for
// orders (the success page's verify-checkout-session call is the fast path,
// but the customer may close the tab before the redirect). Both paths share
// _shared/order-from-session.ts, whose idempotency (unique stripe_session_id
// + 23505 race resolution + creator-only stock deduction) makes it safe for
// both to fire for the same session.
//
// Webhook secret lookup (in order):
//   1. env STRIPE_WEBHOOK_SECRET
//   2. app_config table, key 'STRIPE_WEBHOOK_SECRET' (service_role only)
// If neither exists we answer 503 with a clear log — Stripe will retry, and
// the success-page path still creates orders in the meantime.
//
// Signature verification uses constructEventAsync — the sync variant is not
// available in Deno (SubtleCrypto is async-only).
import Stripe from "https://esm.sh/stripe@17.4.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { corsHeaders } from "../_shared/cors.ts";
import { upsertOrderFromSession } from "../_shared/order-from-session.ts";
import { sendOrderConfirmationEmails } from "../_shared/email.ts";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
  apiVersion: "2024-11-20.acacia",
  httpClient: Stripe.createFetchHttpClient(),
});

const cryptoProvider = Stripe.createSubtleCryptoProvider();

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

// Resolved secret is cached per function instance; misses are NOT cached so
// adding the key to app_config takes effect without a redeploy.
let cachedSecret: string | null = null;

async function getWebhookSecret(): Promise<string | null> {
  if (cachedSecret) return cachedSecret;
  const fromEnv = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (fromEnv) {
    cachedSecret = fromEnv;
    return cachedSecret;
  }
  const { data, error } = await admin
    .from("app_config")
    .select("value")
    .eq("key", "STRIPE_WEBHOOK_SECRET")
    .maybeSingle();
  if (error) {
    console.error("stripe-webhook: app_config lookup failed:", error);
    return null;
  }
  if (data?.value) {
    cachedSecret = data.value;
    return cachedSecret;
  }
  return null;
}

Deno.serve(async (req) => {
  const cors = corsHeaders(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: cors });
  }

  const secret = await getWebhookSecret();
  if (!secret) {
    console.error(
      "stripe-webhook: STRIPE_WEBHOOK_SECRET missing — set it as a function " +
        "secret (env) or insert it into app_config (key='STRIPE_WEBHOOK_SECRET'). " +
        "Answering 503 so Stripe retries.",
    );
    return new Response(
      JSON.stringify({ error: "webhook secret not configured" }),
      { status: 503, headers: { ...cors, "content-type": "application/json" } },
    );
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response(
      JSON.stringify({ error: "Missing stripe-signature header" }),
      { status: 400, headers: { ...cors, "content-type": "application/json" } },
    );
  }

  // Raw body is required for signature verification — never parse first.
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      secret,
      undefined,
      cryptoProvider,
    );
  } catch (err) {
    console.error("stripe-webhook: signature verification failed:", err);
    return new Response(
      JSON.stringify({ error: "Invalid signature" }),
      { status: 400, headers: { ...cors, "content-type": "application/json" } },
    );
  }

  try {
    if (event.type === "checkout.session.completed") {
      const sessionId = (event.data.object as Stripe.Checkout.Session).id;

      // The event payload does not include line_items/customer_details —
      // re-retrieve the session fully expanded, same as the success page does.
      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["line_items", "customer_details", "payment_intent"],
      });

      if (session.payment_status === "paid") {
        const { order, created } = await upsertOrderFromSession(admin, session);
        console.log(
          `stripe-webhook: session ${sessionId} → order ${order.id} ` +
            `(${created ? "created" : "already existed"})`,
        );

        // Order confirmation (§312f) — ONLY on first creation, so the race
        // with verify-checkout-session can never produce a duplicate mail.
        // sendOrderConfirmationEmails never throws (and skips cleanly without
        // a RESEND_API_KEY), so a mail hiccup can never trigger a Stripe
        // retry loop.
        if (created) {
          await sendOrderConfirmationEmails(order, session);
        }
      } else {
        // e.g. async payment methods: completed but not yet paid — the shared
        // module only accepts paid sessions, so we skip and let a later
        // event / the success page handle it once payment lands.
        console.log(
          `stripe-webhook: session ${sessionId} completed but payment_status=` +
            `${session.payment_status} — skipping order creation`,
        );
      }
    }
    // All other event types: acknowledged and ignored on purpose.

    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: { ...cors, "content-type": "application/json" } },
    );
  } catch (err) {
    // Processing failed AFTER a valid signature (e.g. transient DB error).
    // Answer 500 so Stripe retries — upsertOrderFromSession is idempotent,
    // so retries can never duplicate orders or stock deductions.
    console.error(`stripe-webhook: processing ${event.type} failed:`, err);
    return new Response(
      JSON.stringify({ error: "processing failed" }),
      { status: 500, headers: { ...cors, "content-type": "application/json" } },
    );
  }
});
