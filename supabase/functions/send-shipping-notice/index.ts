// Supabase Edge Function: send the "Deine Bestellung ist unterwegs" e-mail
// (admin-only).
//
// POST { order_id }  — Authorization: Bearer <admin user JWT>
//
// Flow: verify caller is an admin (profiles.role === 'admin', same check as
// refund-order) → load order → build carrier tracking URL → send the shipping
// notification to the customer via _shared/email.ts.
//
// Without a RESEND_API_KEY the mail is skipped (never an error) and the
// response carries { skipped: true } so the admin UI can say so.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { corsHeaders } from "../_shared/cors.ts";
import { escapeHtml, renderTemplate, sendEmail } from "../_shared/email.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Tracking-URL patterns per carrier — kept in sync with the shop UI
// (shop/src/components/account/OrderItem.tsx CARRIER_META).
const CARRIERS: Record<string, { label: string; trackUrl: (n: string) => string }> = {
  dhl: {
    label: "DHL",
    trackUrl: (n) =>
      `https://www.dhl.de/de/privatkunden/pakete-empfangen/verfolgen.html?piececode=${encodeURIComponent(n)}`,
  },
  ups: {
    label: "UPS",
    trackUrl: (n) =>
      `https://www.ups.com/track?tracknum=${encodeURIComponent(n)}&loc=de_DE`,
  },
  dpd: {
    label: "DPD",
    trackUrl: (n) =>
      `https://tracking.dpd.de/parcelstatus?query=${encodeURIComponent(n)}`,
  },
  gls: {
    label: "GLS",
    trackUrl: (n) =>
      `https://gls-group.com/DE/de/paketverfolgung?match=${encodeURIComponent(n)}`,
  },
  hermes: {
    label: "Hermes",
    trackUrl: (n) =>
      `https://www.myhermes.de/empfangen/sendungsverfolgung/sendungsinformation/#${encodeURIComponent(n)}`,
  },
};

Deno.serve(async (req) => {
  const cors = corsHeaders(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: cors });
  }

  const json = (body: unknown, status: number) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...cors, "content-type": "application/json" },
    });

  try {
    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    // --- AuthZ: Bearer JWT must belong to an admin ---------------------------
    const authHeader = req.headers.get("authorization") ?? "";
    const jwt = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!jwt) return json({ error: "Missing bearer token" }, 401);

    const { data: userData, error: userErr } = await admin.auth.getUser(jwt);
    if (userErr || !userData.user) {
      return json({ error: "Invalid token" }, 401);
    }

    const { data: profile, error: profileErr } = await admin
      .from("profiles")
      .select("role")
      .eq("id", userData.user.id)
      .maybeSingle();
    if (profileErr) throw profileErr;
    if (profile?.role !== "admin") {
      return json({ error: "Admins only" }, 403);
    }

    // --- Input ---------------------------------------------------------------
    const body = await req.json().catch(() => ({}));
    const orderId: unknown = body?.order_id;
    if (!orderId || typeof orderId !== "string") {
      return json({ error: "Missing order_id" }, 400);
    }

    // --- Load order ----------------------------------------------------------
    const { data: order, error: orderErr } = await admin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .maybeSingle();
    if (orderErr) throw orderErr;
    if (!order) return json({ error: "Order not found" }, 404);

    if (!order.tracking_number) {
      return json(
        { error: "Order has no tracking number — set it first" },
        400,
      );
    }
    if (!order.customer_email) {
      return json(
        { error: "Order has no customer e-mail — cannot notify" },
        400,
      );
    }

    // --- Build mail ----------------------------------------------------------
    const shortId = `#${String(order.id).slice(0, 8).toUpperCase()}`;
    const carrierKey = String(order.shipping_carrier ?? "").toLowerCase();
    const carrier = CARRIERS[carrierKey] ?? null;
    const trackingNumber = String(order.tracking_number);
    const trackingUrl = carrier ? carrier.trackUrl(trackingNumber) : null;

    const bodyHtml = `
      <p style="margin:0 0 16px;">
        Gute Nachrichten — deine Bestellung
        <strong style="color:#fafafa;">${shortId}</strong> wurde soeben
        ${carrier ? `mit ${escapeHtml(carrier.label)}` : ""} versendet.
      </p>
      <p style="margin:0 0 6px;color:#a3a3a3;font-size:12px;text-transform:uppercase;letter-spacing:2px;">Tracking-Nummer</p>
      <p style="margin:0 0 20px;font-family:monospace;font-size:16px;color:#fafafa;">${escapeHtml(trackingNumber)}</p>
      ${
      trackingUrl
        ? `<p style="margin:0 0 24px;">
            <a href="${trackingUrl}"
               style="display:inline-block;background-color:#fafafa;color:#0a0a0a;text-decoration:none;padding:12px 24px;font-weight:bold;font-size:14px;">
              Sendung bei ${escapeHtml(carrier!.label)} verfolgen
            </a>
          </p>`
        : ""
    }
      <p style="margin:0;color:#a3a3a3;font-size:13px;">
        Bei Fragen antworte einfach auf diese E-Mail — wir helfen gerne.
      </p>`;

    const result = await sendEmail({
      to: order.customer_email,
      subject: `Deine Bestellung ${shortId} ist unterwegs — Blessed Streets`,
      html: renderTemplate("Deine Bestellung ist unterwegs", bodyHtml),
      replyTo: "blessedstreets@icloud.com",
    });

    return json(
      {
        sent: result.sent,
        skipped: result.skipped,
        ...(result.error ? { error: result.error } : {}),
      },
      result.sent || result.skipped ? 200 : 502,
    );
  } catch (err) {
    console.error("send-shipping-notice error", err);
    const message = err instanceof Error ? err.message : "unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...cors, "content-type": "application/json" } },
    );
  }
});
