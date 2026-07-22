// Shared "Session → Order" logic, used by BOTH delivery paths:
//   1. verify-checkout-session — called by the success page after redirect.
//   2. stripe-webhook          — called by Stripe on checkout.session.completed.
//
// Both paths can (and will) fire for the same session, in any order, possibly
// concurrently. Idempotency is therefore layered:
//   * Fast path: SELECT by stripe_session_id — if the order exists, return it.
//   * Race safety: the partial UNIQUE index on orders.stripe_session_id makes
//     a concurrent double-insert impossible; the loser gets a 23505 which we
//     resolve by re-reading the winner's row.
//   * Stock is only decremented by the caller that actually CREATED the row
//     (created === true), so inventory is never deducted twice.
//
// Stock deduction uses the atomic SQL function decrement_stock() (single
// UPDATE with a >= guard) instead of the old read-modify-write. A failed
// deduction (e.g. oversell race) is logged but never blocks the order —
// the customer has already paid.
import type Stripe from "https://esm.sh/stripe@17.4.0?target=deno";
import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

type CartLine = { id: string; size: string; qty: number };

export type UpsertResult = {
  order: Record<string, unknown>;
  created: boolean;
};

/**
 * Idempotently persist a PAID Stripe Checkout Session as an `orders` row and
 * (on first creation only) decrement inventory.
 *
 * Callers must ensure `session.payment_status === "paid"` and that the
 * session was retrieved with `line_items`/`customer_details` expanded (we
 * only rely on metadata + customer_details + shipping_details + amount_total).
 */
export async function upsertOrderFromSession(
  admin: SupabaseClient,
  session: Stripe.Checkout.Session,
): Promise<UpsertResult> {
  // --- Fast idempotency path -------------------------------------------------
  const { data: existing, error: existingErr } = await admin
    .from("orders")
    .select("*")
    .eq("stripe_session_id", session.id)
    .maybeSingle();
  if (existingErr) throw existingErr;
  if (existing) return { order: existing, created: false };

  // --- Build the order snapshot ---------------------------------------------
  const cart: CartLine[] = session.metadata?.cart
    ? (JSON.parse(session.metadata.cart) as CartLine[])
    : [];
  const userId =
    session.metadata?.user_id && session.metadata.user_id !== "guest"
      ? session.metadata.user_id
      : null;
  const customerEmail = session.customer_details?.email ?? null;

  // Re-fetch products to snapshot name/price/image. cart.id is the product
  // **slug** (see create-checkout-session metadata).
  const slugs = [...new Set(cart.map((c) => c.id))];
  const { data: products, error: productsErr } = await admin
    .from("products")
    .select("id, name, slug, price, images")
    .in("slug", slugs);
  if (productsErr) throw productsErr;
  const productMap = new Map(products?.map((p) => [p.slug, p]) ?? []);

  const orderItems = cart.map((c) => {
    const p = productMap.get(c.id);
    const firstImage =
      Array.isArray(p?.images) && p!.images.length > 0 ? p!.images[0] : "";
    return {
      id: c.id,
      name: p?.name ?? "Unknown",
      price: Number(p?.price ?? 0),
      size: c.size,
      quantity: c.qty,
      image: firstImage,
    };
  });

  const totalEur = session.amount_total ? session.amount_total / 100 : 0;
  const shippingAddress = session.shipping_details?.address
    ? [
        session.shipping_details.name ?? "",
        session.shipping_details.address.line1 ?? "",
        session.shipping_details.address.line2 ?? "",
        `${session.shipping_details.address.postal_code ?? ""} ${
          session.shipping_details.address.city ?? ""
        }`,
        session.shipping_details.address.country ?? "",
      ].filter(Boolean).join("\n")
    : (session.metadata?.shipping_address_hint ?? "");

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

  // --- Insert (race-safe via unique stripe_session_id) -----------------------
  const { data: order, error: insertErr } = await admin
    .from("orders")
    .insert({
      user_id: userId,
      customer_email: customerEmail,
      items: orderItems,
      total: totalEur,
      shipping_address: shippingAddress,
      payment_method: "stripe",
      estimated_delivery: estimatedDelivery.toISOString(),
      status: "confirmed",
      stripe_session_id: session.id,
      stripe_payment_intent_id:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id ?? null,
      color: null,
    })
    .select()
    .single();

  if (insertErr) {
    // 23505 = unique_violation: the other delivery path (webhook vs. success
    // page) inserted this session's order between our SELECT and INSERT.
    // That path also owns the stock deduction — we just return its row.
    if ((insertErr as { code?: string }).code === "23505") {
      const { data: winner, error: winnerErr } = await admin
        .from("orders")
        .select("*")
        .eq("stripe_session_id", session.id)
        .single();
      if (winnerErr) throw winnerErr;
      return { order: winner, created: false };
    }
    throw insertErr;
  }

  // --- Inventory: atomic per-line decrement, ONLY for the creating caller ----
  for (const line of cart) {
    const { data: ok, error: rpcErr } = await admin.rpc("decrement_stock", {
      p_slug: line.id,
      p_size: line.size,
      p_qty: line.qty,
    });
    if (rpcErr) {
      console.error(
        `decrement_stock failed for ${line.id}/${line.size} x${line.qty} ` +
          `(order ${order.id}):`,
        rpcErr,
      );
    } else if (ok === false) {
      // Insufficient stock (oversell race) — order stands, flag for Esma.
      console.error(
        `decrement_stock: insufficient stock for ${line.id}/${line.size} ` +
          `x${line.qty} (order ${order.id}) — manual review needed`,
      );
    }
  }

  return { order, created: true };
}
