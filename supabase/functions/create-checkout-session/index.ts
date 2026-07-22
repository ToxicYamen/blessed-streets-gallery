// Supabase Edge Function: create a Stripe Checkout Session.
//
// POST body:
//   {
//     items: [{ product_id: string, size: string, quantity: number }],
//     shipping_address?: string,
//     country?: 'DE' | 'AT' | 'CH',   // Lieferland, Fallback 'DE'
//     success_url: string,   // e.g. https://blessedstreets.de/checkout/success?session_id={CHECKOUT_SESSION_ID}
//     cancel_url: string     // e.g. https://blessedstreets.de/cart
//   }
//
// We re-fetch the product price from Supabase on the server so the client can't
// tamper with the amount it gets charged.
//
// Env vars required (set via Supabase Dashboard → Edge Functions → Secrets):
//   STRIPE_SECRET_KEY  (sk_test_… or sk_live_…)
//   SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY  (auto-provided to functions)
import Stripe from "https://esm.sh/stripe@17.4.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { corsHeaders } from "../_shared/cors.ts";

type ItemIn = { product_id: string; size: string; quantity: number };
type Country = "DE" | "AT" | "CH";

// Publicly communicated shipping rates (must match the shop frontend):
// DE 4,99 € (free from 50 € subtotal, DE only) · AT 7,99 € · CH 12,99 €.
const SHIPPING: Record<
  Country,
  { amount: number; label: string; minDays: number; maxDays: number }
> = {
  DE: { amount: 499, label: "Standard Versand (DE)", minDays: 2, maxDays: 4 },
  AT: { amount: 799, label: "Standard Versand (AT)", minDays: 3, maxDays: 5 },
  CH: { amount: 1299, label: "Standard Versand (CH)", minDays: 4, maxDays: 7 },
};

const FREE_SHIPPING_THRESHOLD_CENTS = 5000; // 50,00 € — DE only

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
  apiVersion: "2024-11-20.acacia",
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req) => {
  const cors = corsHeaders(req);
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: cors });
  }
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: cors });
  }

  try {
    const body = await req.json();
    const items: ItemIn[] = Array.isArray(body.items) ? body.items : [];
    const successUrl: string = body.success_url;
    const cancelUrl: string = body.cancel_url;
    const shippingAddress: string | null = body.shipping_address ?? null;

    // Validate the delivery country server-side; anything unexpected falls back to DE.
    const country: Country =
      body.country === "AT" || body.country === "CH" ? body.country : "DE";

    if (!items.length) {
      return new Response(
        JSON.stringify({ error: "No items in cart" }),
        { status: 400, headers: { ...cors, "content-type": "application/json" } },
      );
    }
    if (!successUrl || !cancelUrl) {
      return new Response(
        JSON.stringify({ error: "Missing success_url or cancel_url" }),
        { status: 400, headers: { ...cors, "content-type": "application/json" } },
      );
    }

    // Identify the user from the Authorization header (anon clients pass the
    // user's JWT). Optional — guests may also check out.
    const authHeader = req.headers.get("authorization") ?? "";
    const userJwt = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    let userId: string | null = null;
    let userEmail: string | null = null;
    if (userJwt) {
      const { data: userData } = await supabaseAdmin.auth.getUser(userJwt);
      userId = userData.user?.id ?? null;
      userEmail = userData.user?.email ?? null;
    }

    // Pull product rows so we can build server-validated line items.
    // The shop client passes the product **slug** as product_id (see
    // src/hooks/use-products.ts mapRow — Product.id === DB slug). We resolve
    // by slug here and keep the slug as the line-item metadata so the verify
    // function can map back to the inventory row.
    const slugs = [...new Set(items.map((i) => i.product_id))];
    const { data: products, error: productsErr } = await supabaseAdmin
      .from("products")
      .select("id, name, slug, price, images, size_quantities")
      .in("slug", slugs);
    if (productsErr) throw productsErr;
    if (!products?.length) {
      return new Response(
        JSON.stringify({ error: "Products not found" }),
        { status: 404, headers: { ...cors, "content-type": "application/json" } },
      );
    }

    const productMap = new Map(products.map((p) => [p.slug, p]));

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    // Server-validated subtotal in cents, computed from DB prices — NEVER from
    // client-supplied amounts. Drives the DE free-shipping threshold.
    let subtotalCents = 0;
    for (const item of items) {
      const p = productMap.get(item.product_id);
      if (!p) {
        return new Response(
          JSON.stringify({ error: `Unknown product ${item.product_id}` }),
          { status: 400, headers: { ...cors, "content-type": "application/json" } },
        );
      }
      const quantities = (p.size_quantities ?? {}) as Record<string, number>;
      const available = quantities[item.size] ?? 0;
      if (item.quantity > available) {
        return new Response(
          JSON.stringify({
            error: `Only ${available} of ${p.name} (size ${item.size}) available`,
          }),
          { status: 409, headers: { ...cors, "content-type": "application/json" } },
        );
      }
      const firstImage = Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : undefined;
      const unitAmount = Math.round(Number(p.price) * 100);
      subtotalCents += unitAmount * item.quantity;
      lineItems.push({
        quantity: item.quantity,
        price_data: {
          currency: "eur",
          unit_amount: unitAmount,
          product_data: {
            name: `${p.name} (${item.size})`,
            images: firstImage ? [firstImage] : undefined,
            metadata: { product_slug: p.slug, size: item.size },
          },
        },
      });
    }

    // Exactly ONE shipping option, matching the selected delivery country.
    // DE gets free shipping when the server-computed subtotal is >= 50,00 €.
    const rate = SHIPPING[country];
    const freeShipping = country === "DE" && subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS;
    const shippingOption: Stripe.Checkout.SessionCreateParams.ShippingOption = {
      shipping_rate_data: {
        type: "fixed_amount",
        fixed_amount: {
          amount: freeShipping ? 0 : rate.amount,
          currency: "eur",
        },
        display_name: freeShipping ? "Versandkostenfrei (ab 50 €)" : rate.label,
        delivery_estimate: {
          minimum: { unit: "business_day", value: rate.minDays },
          maximum: { unit: "business_day", value: rate.maxDays },
        },
      },
    };

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"], // Klarna / Sofort etc. auto-show once enabled in Dashboard
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: userEmail ?? undefined,
      // Stripe collects the shipping address itself — restricted to the country
      // the customer chose in our checkout so rate and destination always match.
      shipping_address_collection: {
        allowed_countries: [country],
      },
      shipping_options: [shippingOption],
      metadata: {
        user_id: userId ?? "guest",
        // Delivery country — needed for CH customs handling (Zollkennzeichnung).
        country,
        shipping_address_hint: shippingAddress ?? "",
        cart: JSON.stringify(
          items.map((i) => ({ id: i.product_id, size: i.size, qty: i.quantity })),
        ),
      },
    });

    return new Response(
      JSON.stringify({ id: session.id, url: session.url }),
      { status: 200, headers: { ...cors, "content-type": "application/json" } },
    );
  } catch (err) {
    console.error("create-checkout-session error", err);
    const message = err instanceof Error ? err.message : "unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...cors, "content-type": "application/json" } },
    );
  }
});
