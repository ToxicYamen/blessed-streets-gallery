// Supabase Edge Function: full refund of an order (admin-only).
//
// POST { order_id }  — Authorization: Bearer <admin user JWT>
//
// Flow: verify caller is an admin (profiles.role === 'admin') → load order →
// stripe.refunds.create({ payment_intent }) → status='refunded' → restock
// every items[] line via restock_stock() (symmetric counterpart of
// decrement_stock, no >= guard).
//
// Full refunds only — no partial refunds (KISS, per operator decision).
// Idempotency: an order already in status 'refunded' short-circuits with 200,
// so a double-click on the admin button can never refund or restock twice.
// If Stripe reports the charge as already refunded (e.g. refunded manually in
// the Stripe Dashboard), we still mark the order + restock locally.
import Stripe from "https://esm.sh/stripe@17.4.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { corsHeaders } from "../_shared/cors.ts";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
  apiVersion: "2024-11-20.acacia",
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

type OrderItem = {
  id: string; // product slug
  size: string;
  quantity: number;
  name?: string;
  price?: number;
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

    // Idempotency guard: never refund or restock twice.
    if (order.status === "refunded") {
      return json({ refunded: true, already_refunded: true, order }, 200);
    }

    if (!order.stripe_payment_intent_id) {
      return json(
        { error: "Order has no Stripe payment intent — cannot refund" },
        400,
      );
    }

    // --- Stripe refund (full) ------------------------------------------------
    try {
      await stripe.refunds.create({
        payment_intent: order.stripe_payment_intent_id,
      });
    } catch (err) {
      // Already refunded in Stripe (e.g. via Dashboard): proceed so our DB
      // state catches up. Any other Stripe error aborts BEFORE touching the DB.
      const code = (err as { code?: string })?.code;
      if (code === "charge_already_refunded") {
        console.log(
          `refund-order: payment_intent ${order.stripe_payment_intent_id} ` +
            "already refunded in Stripe — syncing local state",
        );
      } else {
        throw err;
      }
    }

    // --- Mark refunded -------------------------------------------------------
    const { data: updated, error: updateErr } = await admin
      .from("orders")
      .update({ status: "refunded" })
      .eq("id", orderId)
      .select()
      .single();
    if (updateErr) throw updateErr;

    // --- Restock every line (symmetric to the checkout deduction) ------------
    const items: OrderItem[] = Array.isArray(order.items) ? order.items : [];
    for (const item of items) {
      if (!item?.id || !item?.size || !item?.quantity) continue;
      const { error: rpcErr } = await admin.rpc("restock_stock", {
        p_slug: item.id,
        p_size: item.size,
        p_qty: item.quantity,
      });
      if (rpcErr) {
        // Money is already back with the customer — log for manual fix-up,
        // never fail the refund because of a restock hiccup.
        console.error(
          `restock_stock failed for ${item.id}/${item.size} x${item.quantity} ` +
            `(order ${orderId}):`,
          rpcErr,
        );
      }
    }

    return new Response(
      JSON.stringify({ refunded: true, order: updated }),
      { status: 200, headers: { ...cors, "content-type": "application/json" } },
    );
  } catch (err) {
    console.error("refund-order error", err);
    const message = err instanceof Error ? err.message : "unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...cors, "content-type": "application/json" } },
    );
  }
});
