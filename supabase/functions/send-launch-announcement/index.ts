// Supabase Edge Function: "Wir sind live"-Rundmail an alle Coming-Soon-Anmeldungen.
//
// Nur für Admins (JWT + profiles.role='admin', gleiches Muster wie refund-order).
// Verschickt an alle launch_signups mit notified_at IS NULL und stempelt jede
// erfolgreich versendete Adresse — der Versand ist dadurch beliebig oft
// wiederholbar, ohne dass jemand doppelt Post bekommt.
//
// Body (optional): { "dryRun": true } → zählt nur, verschickt nichts.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { corsHeaders } from "../_shared/cors.ts";
import { getResendKey, renderTemplate, sendEmail } from "../_shared/email.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const SHOP_URL = "https://blessedstreets.de";

// Resend erlaubt 2 Requests/Sekunde — mit 600 ms Abstand bleiben wir sicher drunter.
const DELAY_MS = 600;

// Bewusst zurückhaltend formuliert (kein Emoji im Betreff, wenig
// Marketing-Vokabular, Link zusätzlich als Klartext, Erklärungszeile am
// Ende) — die erste Fassung wurde von Gmail als Werbung wegsortiert,
// obwohl Resend "delivered" meldete.
function launchEmailHtml(): string {
  return renderTemplate(
    "Blessed Streets ist jetzt online",
    `<p style="margin:0 0 16px;">Es ist so weit: <strong style="color:#fafafa;">blessedstreets.de ist freigeschaltet.</strong></p>
     <p style="margin:0 0 16px;">Du hattest dich auf unserer Startseite eingetragen, um zum Start Bescheid zu bekommen — das ist diese Nachricht.</p>
     <p style="margin:28px 0;text-align:center;">
       <a href="${SHOP_URL}" style="display:inline-block;background-color:#fafafa;color:#0a0a0a;padding:12px 28px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;letter-spacing:1px;text-decoration:none;">Zum Shop</a>
     </p>
     <p style="margin:0 0 16px;">Oder direkt im Browser öffnen: <a href="${SHOP_URL}" style="color:#d4d4d4;">${SHOP_URL.replace("https://", "")}</a></p>
     <p style="margin:0;color:#a3a3a3;font-size:12px;line-height:1.6;">
       Danke, dass du von Anfang an dabei bist. — Esma, Blessed Streets<br><br>
       Du bekommst diese einmalige E-Mail, weil du dich auf blessedstreets.de
       für die Launch-Benachrichtigung eingetragen hast.
     </p>`,
  );
}

Deno.serve(async (req) => {
  const cors = corsHeaders(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: cors });
  }

  try {
    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    // --- Admin-Gate: JWT des Aufrufers prüfen ------------------------------
    const authHeader = req.headers.get("authorization") ?? "";
    const jwt = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!jwt) {
      return new Response(JSON.stringify({ error: "Nicht angemeldet" }), {
        status: 401,
        headers: { ...cors, "content-type": "application/json" },
      });
    }
    const { data: userData } = await admin.auth.getUser(jwt);
    const userId = userData.user?.id;
    if (!userId) {
      return new Response(JSON.stringify({ error: "Ungültige Sitzung" }), {
        status: 401,
        headers: { ...cors, "content-type": "application/json" },
      });
    }
    const { data: profile } = await admin
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle();
    if (profile?.role !== "admin") {
      return new Response(JSON.stringify({ error: "Nur für Admins" }), {
        status: 403,
        headers: { ...cors, "content-type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const dryRun = body?.dryRun === true;

    // --- Empfänger: alle, die noch keine Launch-Mail bekommen haben --------
    const { data: pending, error: selErr } = await admin
      .from("launch_signups")
      .select("id, email")
      .is("notified_at", null)
      .order("created_at", { ascending: true });
    if (selErr) throw selErr;

    const recipients = pending ?? [];
    if (dryRun || recipients.length === 0) {
      return new Response(
        JSON.stringify({ total: recipients.length, sent: 0, failed: 0, dryRun }),
        { status: 200, headers: { ...cors, "content-type": "application/json" } },
      );
    }

    // Ohne Resend-Key gar nicht erst anfangen (statt N Skips zu produzieren).
    if (!(await getResendKey())) {
      return new Response(
        JSON.stringify({ error: "Kein RESEND_API_KEY konfiguriert", total: recipients.length, sent: 0 }),
        { status: 503, headers: { ...cors, "content-type": "application/json" } },
      );
    }

    const html = launchEmailHtml();
    let sent = 0;
    let failed = 0;

    for (const r of recipients) {
      const result = await sendEmail({
        to: r.email,
        subject: "Blessed Streets ist jetzt online",
        html,
      });
      if (result.sent) {
        sent++;
        await admin
          .from("launch_signups")
          .update({ notified_at: new Date().toISOString() })
          .eq("id", r.id);
      } else {
        failed++;
        console.error(`[launch] Versand an ${r.email} fehlgeschlagen:`, result.error);
      }
      await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
    }

    return new Response(
      JSON.stringify({ total: recipients.length, sent, failed }),
      { status: 200, headers: { ...cors, "content-type": "application/json" } },
    );
  } catch (err) {
    console.error("send-launch-announcement error", err);
    const message = err instanceof Error ? err.message : "unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...cors, "content-type": "application/json" },
    });
  }
});
