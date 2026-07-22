// Supabase Edge Function: admin-only — invite a new user.
//
// POST body: { email: string, role?: 'user'|'staff'|'admin', first_name?, last_name? }
//
// Validates the caller is an admin (by checking profiles.role for their JWT),
// then uses the service-role client to call auth.admin.inviteUserByEmail and
// stamps the requested role on the auto-created profile row.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { corsHeaders } from "../_shared/cors.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req) => {
  const cors = corsHeaders(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: cors });
  }

  try {
    const authHeader = req.headers.get("authorization") ?? "";
    const userJwt = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!userJwt) {
      return json({ error: "Missing auth" }, 401, cors);
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    // Resolve the caller and check role.
    const { data: callerData } = await admin.auth.getUser(userJwt);
    const callerId = callerData.user?.id;
    if (!callerId) return json({ error: "Invalid token" }, 401, cors);

    const { data: callerProfile } = await admin
      .from("profiles")
      .select("role")
      .eq("id", callerId)
      .maybeSingle();
    if (callerProfile?.role !== "admin") {
      return json({ error: "Admin only" }, 403, cors);
    }

    const body = await req.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const role: "user" | "staff" | "admin" =
      body.role === "admin" || body.role === "staff" || body.role === "user"
        ? body.role
        : "user";
    const first_name = body.first_name ? String(body.first_name).trim() : null;
    const last_name = body.last_name ? String(body.last_name).trim() : null;

    if (!email || !email.includes("@")) {
      return json({ error: "Invalid email" }, 400, cors);
    }

    // Invite the user. Supabase auto-creates a `profiles` row via the
    // handle_new_user trigger; we'll patch role/name right after.
    const { data: invite, error: inviteErr } = await admin.auth.admin.inviteUserByEmail(email, {
      data: { first_name, last_name },
    });
    if (inviteErr) {
      return json({ error: inviteErr.message }, 400, cors);
    }
    const newUserId = invite.user?.id;
    if (newUserId) {
      await admin
        .from("profiles")
        .update({ role, first_name, last_name })
        .eq("id", newUserId);

      await admin.from("profiles_admin_audit").insert({
        target_id: newUserId,
        actor_id: callerId,
        action: "invited",
        after_val: { email, role },
      });
    }

    return json({ ok: true, user_id: newUserId, email }, 200, cors);
  } catch (err) {
    console.error("invite-user error", err);
    const message = err instanceof Error ? err.message : "unknown error";
    return json({ error: message }, 500, cors);
  }
});

function json(body: unknown, status: number, cors: HeadersInit) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "content-type": "application/json" },
  });
}
