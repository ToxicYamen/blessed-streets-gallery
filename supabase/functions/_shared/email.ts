// Shared e-mail helper for all Edge Functions (Resend).
//
// Key lookup order (same pattern as the Stripe webhook secret):
//   1. env RESEND_API_KEY (Supabase Function Secret)
//   2. app_config table, key 'RESEND_API_KEY' (service_role only)
// If neither exists every send is SKIPPED with a clear log line — never an
// exception. E-mail must never break checkout, refunds or support flows.
//
// Exposed API:
//   sendEmail({ to, subject, html, replyTo? })  → { sent, skipped, error? }
//   notifyAdmin(subject, html)                  → same, recipient from
//                                                 app_config ADMIN_NOTIFY_EMAIL
//                                                 (fallback admin@blessedstreets.de)
//   renderTemplate(title, bodyHtml)             → dark base layout
//   sendOrderConfirmationEmails(order, session) → customer confirmation +
//                                                 admin notification (§312f)
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import type Stripe from "https://esm.sh/stripe@17.4.0?target=deno";

const FROM = "Blessed Streets <shop@blessedstreets.de>";
const SHOP_URL = "https://blessedstreets.de";
// blessedstreets.de kann nur SENDEN (Resend), nicht empfangen — Antworten und
// Admin-Alerts müssen deshalb an das echte Postfach gehen.
const FALLBACK_ADMIN_EMAIL = "blessedstreets@icloud.com";
const DEFAULT_REPLY_TO = "blessedstreets@icloud.com";

export type SendEmailResult = {
  sent: boolean;
  skipped: boolean;
  id?: string;
  error?: string;
};

// Lazy module-level service-role client, only for app_config lookups.
let _admin: SupabaseClient | null = null;
function adminClient(): SupabaseClient | null {
  if (_admin) return _admin;
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return null;
  _admin = createClient(url, key, { auth: { persistSession: false } });
  return _admin;
}

async function getAppConfig(key: string): Promise<string | null> {
  const admin = adminClient();
  if (!admin) return null;
  const { data, error } = await admin
    .from("app_config")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  if (error) {
    console.error(`[email] app_config lookup for ${key} failed:`, error);
    return null;
  }
  return data?.value ?? null;
}

// Hits are cached per function instance; misses are NOT cached, so inserting
// the key into app_config takes effect without a redeploy.
let cachedResendKey: string | null = null;

export async function getResendKey(): Promise<string | null> {
  if (cachedResendKey) return cachedResendKey;
  const fromEnv = Deno.env.get("RESEND_API_KEY");
  if (fromEnv) {
    cachedResendKey = fromEnv;
    return cachedResendKey;
  }
  const fromDb = await getAppConfig("RESEND_API_KEY");
  if (fromDb) {
    cachedResendKey = fromDb;
    return cachedResendKey;
  }
  return null;
}

/**
 * Send one e-mail via the Resend REST API. NEVER throws:
 *   - no key configured  → { sent:false, skipped:true }  (logged)
 *   - API/network error  → { sent:false, skipped:false, error } (logged)
 *   - success            → { sent:true,  skipped:false, id }
 */
export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<SendEmailResult> {
  try {
    const key = await getResendKey();
    if (!key) {
      console.log("[email] skipped (no RESEND_API_KEY)");
      return { sent: false, skipped: true };
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [opts.to],
        subject: opts.subject,
        html: opts.html,
        reply_to: opts.replyTo ?? DEFAULT_REPLY_TO,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(
        `[email] Resend API error ${res.status} for "${opts.subject}":`,
        detail,
      );
      return { sent: false, skipped: false, error: `Resend ${res.status}` };
    }

    const json = (await res.json().catch(() => ({}))) as { id?: string };
    console.log(`[email] sent "${opts.subject}" → ${opts.to} (id ${json.id ?? "?"})`);
    return { sent: true, skipped: false, id: json.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[email] send failed for "${opts.subject}":`, err);
    return { sent: false, skipped: false, error: message };
  }
}

/** Notify the shop operator. Recipient: app_config ADMIN_NOTIFY_EMAIL → fallback. */
export async function notifyAdmin(
  subject: string,
  html: string,
): Promise<SendEmailResult> {
  const to = (await getAppConfig("ADMIN_NOTIFY_EMAIL")) ?? FALLBACK_ADMIN_EMAIL;
  return sendEmail({ to, subject, html });
}

// ─── Template ───────────────────────────────────────────────────────────────

export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function formatEur(n: number): string {
  return `${n.toFixed(2).replace(".", ",")} €`;
}

/** Simple dark base layout — inline styles only (e-mail client compatibility). */
export function renderTemplate(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#0a0a0a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background-color:#141414;border:1px solid #262626;">
        <tr>
          <td style="padding:28px 32px;border-bottom:1px solid #262626;">
            <span style="font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:bold;letter-spacing:6px;color:#fafafa;">BLESSED&nbsp;STREETS</span>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <h1 style="margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:20px;line-height:1.35;color:#fafafa;">${escapeHtml(title)}</h1>
            <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#d4d4d4;">
              ${bodyHtml}
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px;border-top:1px solid #262626;">
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.6;color:#737373;">
              Blessed Streets · <a href="${SHOP_URL}" style="color:#a3a3a3;">blessedstreets.de</a><br>
              <a href="${SHOP_URL}/impressum" style="color:#a3a3a3;">Impressum</a> ·
              <a href="${SHOP_URL}/widerruf" style="color:#a3a3a3;">Widerrufsbelehrung</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── Order confirmation (used by stripe-webhook AND verify-checkout-session) ─

type OrderRow = Record<string, unknown>;

type OrderItemLine = {
  id?: string;
  name?: string;
  price?: number;
  size?: string;
  quantity?: number;
};

function orderShortId(order: OrderRow): string {
  return `#${String(order.id ?? "").slice(0, 8).toUpperCase()}`;
}

function buildOrderSummaryHtml(order: OrderRow, shippingEur: number): string {
  const items: OrderItemLine[] = Array.isArray(order.items)
    ? (order.items as OrderItemLine[])
    : [];

  const rows = items
    .map((item) => {
      const qty = Number(item.quantity ?? 0);
      const price = Number(item.price ?? 0);
      return `<tr>
        <td style="padding:8px 0;border-bottom:1px solid #262626;color:#d4d4d4;">
          ${escapeHtml(item.name ?? item.id ?? "Artikel")}
          <span style="color:#737373;">· Größe ${escapeHtml(item.size ?? "–")} · ${qty}×</span>
        </td>
        <td align="right" style="padding:8px 0;border-bottom:1px solid #262626;color:#d4d4d4;white-space:nowrap;">
          ${formatEur(price * qty)}
        </td>
      </tr>`;
    })
    .join("");

  const address = escapeHtml(String(order.shipping_address ?? "")).replaceAll(
    "\n",
    "<br>",
  );

  return `
    <p style="margin:0 0 16px;">Bestellnummer: <strong style="color:#fafafa;">${orderShortId(order)}</strong></p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;">
      ${rows}
      <tr>
        <td style="padding:8px 0;color:#a3a3a3;">Versand</td>
        <td align="right" style="padding:8px 0;color:#a3a3a3;white-space:nowrap;">${
    shippingEur > 0 ? formatEur(shippingEur) : "Kostenlos"
  }</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-top:1px solid #404040;color:#fafafa;font-weight:bold;">Gesamt</td>
        <td align="right" style="padding:10px 0;border-top:1px solid #404040;color:#fafafa;font-weight:bold;white-space:nowrap;">${
    formatEur(Number(order.total ?? 0))
  }</td>
      </tr>
    </table>
    <p style="margin:20px 0 6px;color:#a3a3a3;font-size:12px;text-transform:uppercase;letter-spacing:2px;">Lieferadresse</p>
    <p style="margin:0 0 4px;">${address || "–"}</p>`;
}

/**
 * Customer order confirmation (§312f contract confirmation) + admin
 * notification. Call ONLY when the order was just created (created === true)
 * so the customer can never receive the confirmation twice. Never throws.
 */
export async function sendOrderConfirmationEmails(
  order: OrderRow,
  session: Stripe.Checkout.Session,
): Promise<void> {
  try {
    const items: OrderItemLine[] = Array.isArray(order.items)
      ? (order.items as OrderItemLine[])
      : [];
    const itemsSum = items.reduce(
      (sum, i) => sum + Number(i.price ?? 0) * Number(i.quantity ?? 0),
      0,
    );
    // Shipping: prefer Stripe's own number, fall back to total − items.
    const shippingEur =
      typeof session.total_details?.amount_shipping === "number"
        ? session.total_details.amount_shipping / 100
        : Math.max(0, Number(order.total ?? 0) - itemsSum);

    const summaryHtml = buildOrderSummaryHtml(order, shippingEur);
    const shortId = orderShortId(order);

    // --- Customer confirmation ---------------------------------------------
    const customerEmail =
      (order.customer_email as string | null) ??
      session.customer_details?.email ??
      null;

    if (customerEmail) {
      const customerHtml = renderTemplate(
        "Danke für deine Bestellung!",
        `${summaryHtml}
        <p style="margin:24px 0 0;border-top:1px solid #262626;padding-top:16px;color:#a3a3a3;font-size:12px;line-height:1.6;">
          Diese E-Mail bestätigt deinen Vertragsschluss mit Blessed Streets.
          Als Verbraucher hast du ein 14-tägiges Widerrufsrecht — alle
          Informationen dazu findest du in unserer
          <a href="${SHOP_URL}/widerruf" style="color:#d4d4d4;">Widerrufsbelehrung</a>.
        </p>`,
      );
      await sendEmail({
        to: customerEmail,
        subject: `Bestellbestätigung ${shortId} — Blessed Streets`,
        html: customerHtml,
        replyTo: DEFAULT_REPLY_TO,
      });
    } else {
      console.log(
        `[email] order ${order.id}: no customer e-mail — confirmation skipped`,
      );
    }

    // --- Admin notification --------------------------------------------------
    const adminHtml = renderTemplate(
      `Neue Bestellung ${shortId}`,
      `<p style="margin:0 0 16px;">Kunde: <strong style="color:#fafafa;">${
        escapeHtml(customerEmail ?? "unbekannt")
      }</strong></p>
      ${summaryHtml}`,
    );
    await notifyAdmin(
      `Neue Bestellung ${shortId} — ${formatEur(Number(order.total ?? 0))}`,
      adminHtml,
    );
  } catch (err) {
    // E-mail must never break the payment flow.
    console.error(
      `[email] order confirmation for ${order?.id ?? "?"} failed:`,
      err,
    );
  }
}
