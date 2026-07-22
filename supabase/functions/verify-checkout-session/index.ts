// Supabase Edge Function: verify a Stripe Checkout Session post-redirect and
// write the corresponding order into Supabase.
//
// The success page calls this once with { session_id } from the URL. We:
//   1. Fetch the session from Stripe to confirm it is paid.
//   2. Idempotently upsert the `orders` row + decrement stock via the shared
//      _shared/order-from-session.ts module (also used by stripe-webhook, so
//      both delivery paths stay in lockstep and can never double-insert or
//      double-decrement).
//   3. Return the order so the client can show a receipt.
import Stripe from "https://esm.sh/stripe@17.4.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { corsHeaders } from "../_shared/cors.ts";
import { upsertOrderFromSession } from "../_shared/order-from-session.ts";
import { sendOrderConfirmationEmails } from "../_shared/email.ts";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
  apiVersion: "2024-11-20.acacia",
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req) => {
  const cors = corsHeaders(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: cors });
  }

  try {
    const { session_id } = await req.json();
    if (!session_id || typeof session_id !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing session_id" }),
        { status: 400, headers: { ...cors, "content-type": "application/json" } },
      );
    }

    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "customer_details", "payment_intent"],
    });

    if (session.payment_status !== "paid") {
      return new Response(
        JSON.stringify({ status: session.payment_status, paid: false }),
        { status: 200, headers: { ...cors, "content-type": "application/json" } },
      );
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    const { order, created } = await upsertOrderFromSession(admin, session);

    // Order confirmation (§312f) — ONLY on first creation, never on the
    // idempotent re-run (page reload / webhook already handled it).
    // sendOrderConfirmationEmails never throws and skips cleanly when no
    // RESEND_API_KEY is configured.
    if (created) {
      await sendOrderConfirmationEmails(order, session);
    }

    return new Response(
      JSON.stringify({ paid: true, order }),
      { status: 200, headers: { ...cors, "content-type": "application/json" } },
    );
  } catch (err) {
    console.error("verify-checkout-session error", err);
    const message = err instanceof Error ? err.message : "unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...cors, "content-type": "application/json" } },
    );
  }
});
