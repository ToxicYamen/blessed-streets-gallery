// Supabase Edge Function: e-mail a saved support reply to the customer
// (admin-only).
//
// POST { message_id, reply_body }  — Authorization: Bearer <admin user JWT>
//
// The admin Mail UI first saves the reply on the support_messages row
// (reply_body / replied_at / status='answered' via RLS) and then calls this
// function to actually deliver it. The mail quotes the customer's original
// message (shortened) and sets replyTo blessedstreets@icloud.com so the
// customer can answer directly.
//
// Without a RESEND_API_KEY the mail is skipped (never an error) and the
// response carries { skipped: true } so the UI can show the right toast.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { corsHeaders } from "../_shared/cors.ts";
import { escapeHtml, renderTemplate, sendEmail } from "../_shared/email.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const QUOTE_MAX_CHARS = 400;

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
    const messageId: unknown = body?.message_id;
    const replyBody: unknown = body?.reply_body;
    if (!messageId || typeof messageId !== "string") {
      return json({ error: "Missing message_id" }, 400);
    }
    if (!replyBody || typeof replyBody !== "string" || !replyBody.trim()) {
      return json({ error: "Missing reply_body" }, 400);
    }

    // --- Load support message ------------------------------------------------
    const { data: msg, error: msgErr } = await admin
      .from("support_messages")
      .select("id, name, email, subject, message")
      .eq("id", messageId)
      .maybeSingle();
    if (msgErr) throw msgErr;
    if (!msg) return json({ error: "Support message not found" }, 404);
    if (!msg.email) return json({ error: "Message has no sender e-mail" }, 400);

    // --- Build mail ----------------------------------------------------------
    const original = String(msg.message ?? "");
    const quoted =
      original.length > QUOTE_MAX_CHARS
        ? `${original.slice(0, QUOTE_MAX_CHARS)}…`
        : original;

    const replyHtml = escapeHtml(replyBody.trim()).replaceAll("\n", "<br>");
    const quotedHtml = escapeHtml(quoted).replaceAll("\n", "<br>");
    const firstName = String(msg.name ?? "").trim().split(/\s+/)[0] || null;

    const bodyHtml = `
      <p style="margin:0 0 16px;">Hallo${firstName ? ` ${escapeHtml(firstName)}` : ""},</p>
      <p style="margin:0 0 16px;">danke für deine Nachricht — hier ist unsere Antwort:</p>
      <p style="margin:0 0 24px;color:#fafafa;">${replyHtml}</p>
      <p style="margin:0 0 6px;color:#a3a3a3;font-size:12px;text-transform:uppercase;letter-spacing:2px;">Deine Nachricht</p>
      <blockquote style="margin:0 0 24px;padding:12px 16px;border-left:3px solid #404040;color:#a3a3a3;font-size:13px;">
        ${quotedHtml || "–"}
      </blockquote>
      <p style="margin:0;color:#a3a3a3;font-size:13px;">
        Noch Fragen? Antworte einfach auf diese E-Mail.
      </p>`;

    const subject = msg.subject?.trim()
      ? `Re: ${msg.subject.trim()}`
      : "Re: Deine Anfrage an Blessed Streets";

    const result = await sendEmail({
      to: msg.email,
      subject,
      html: renderTemplate("Antwort auf deine Anfrage", bodyHtml),
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
    console.error("send-support-reply error", err);
    const message = err instanceof Error ? err.message : "unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...cors, "content-type": "application/json" } },
    );
  }
});
