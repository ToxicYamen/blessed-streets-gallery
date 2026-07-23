import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { useCartStore } from "@/lib/store/cart";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice, useCountry, type Country } from "@/lib/country";
import { SHOP_CONFIG } from "@/lib/shop-config";
import { SEOHead } from "@/components/seo/SEOHead";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FUNCTIONS_URL = "https://xsyjrijezdajiojxgzzr.supabase.co/functions/v1";

// Öffentlich kommunizierte Versandkosten — MUSS mit der Edge Function
// create-checkout-session übereinstimmen (dort serverseitig verbindlich).
const SHIPPING_RATES: Record<Country, { label: string; cost: number }> = {
  DE: { label: "Deutschland", cost: 4.99 },
  AT: { label: "Österreich", cost: 7.99 },
  CH: { label: "Schweiz", cost: 12.99 },
};

const FREE_SHIPPING_THRESHOLD = 50; // 50,00 € Zwischensumme — nur DE

/**
 * "checking"      — validation in flight; the pay button stays disabled.
 * "ok"            — every line item is in stock.
 * "insufficient"  — at least one line item is short; send the user back to the cart.
 * "unknown"       — the check itself failed. We do NOT block payment on this: the
 *                   Edge Function + Stripe re-validate stock authoritatively server-side,
 *                   so a flaky read here must never make the shop unable to take money.
 */
type StockStatus = "checking" | "ok" | "insufficient" | "unknown";

/** Resolve to `fallback` if `p` has not settled within `ms`. Never rejects on timeout. */
function withFallback<T>(p: Promise<T>, ms: number, fallback: T): Promise<T> {
  return new Promise<T>((resolve) => {
    const timer = setTimeout(() => resolve(fallback), ms);
    p.then(
      (v) => { clearTimeout(timer); resolve(v); },
      () => { clearTimeout(timer); resolve(fallback); },
    );
  });
}

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getTotal } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [stockStatus, setStockStatus] = useState<StockStatus>("checking");
  const [stockLimits, setStockLimits] = useState<Record<string, Record<string, number>>>({});
  // Land kommt aus dem globalen Länder-Umschalter (Header) und wird von hier
  // aus auch zurückgeschrieben — eine Quelle der Wahrheit (localStorage 'bs-country').
  const [country, setCountry] = useCountry();
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Server-side cart validation (Stripe re-validates anyway, but failing fast is nicer UX).
  // Cart items use the product **slug** as `id` (see use-products.ts mapRow),
  // so we query by slug — querying by DB id silently returned [] before and
  // disabled the pay button on every checkout attempt.
  useEffect(() => {
    if (items.length === 0) return;
    let cancelled = false;

    void (async () => {
      setStockStatus("checking");
      try {
        const slugs = [...new Set(items.map((i) => i.id))];
        const { data, error } = await supabase
          .from("products")
          .select("slug, size_quantities")
          .in("slug", slugs);
        if (cancelled) return;
        if (error) throw error;

        const limits: Record<string, Record<string, number>> = {};
        data?.forEach((p) => {
          if (p.size_quantities && p.slug) {
            limits[p.slug] = p.size_quantities as Record<string, number>;
          }
        });
        setStockLimits(limits);

        const valid = items.every(
          (i) => (limits[i.id]?.[i.size] ?? 0) >= i.quantity,
        );
        setStockStatus(valid ? "ok" : "insufficient");
        if (!valid) toast.error("Einige Artikel sind nicht mehr verfügbar.");
      } catch (err) {
        if (cancelled) return;
        // Could not verify — let the user pay anyway; Stripe/the Edge Function are the
        // real gate. Blocking checkout on a failed read would cost real orders.
        console.warn("[checkout] stock validation failed, continuing", err);
        setStockStatus("unknown");
      }
    })();

    return () => { cancelled = true; };
  }, [items]);

  const subtotal = getTotal();
  const freeShipping = country === "DE" && subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingCost = freeShipping ? 0 : SHIPPING_RATES[country].cost;
  const total = subtotal + shippingCost;
  const payDisabled =
    loading ||
    stockStatus === "checking" ||
    stockStatus === "insufficient" ||
    !termsAccepted;

  const handleStripeCheckout = async () => {
    if (items.length === 0) {
      toast.error("Dein Warenkorb ist leer.");
      return;
    }
    if (stockStatus === "insufficient") {
      toast.error("Bitte prüfe deinen Warenkorb.");
      navigate("/cart");
      return;
    }
    if (!termsAccepted) {
      toast.error("Bitte akzeptiere die AGB und die Widerrufsbelehrung.");
      return;
    }

    setLoading(true);
    try {
      // The access token is OPTIONAL — the Edge Function accepts guest checkout without
      // an Authorization header. So a slow or wedged auth client must never be able to
      // hold the redirect hostage: if getSession() does not answer promptly we simply
      // check out as a guest. (This used to hang forever and the button just spun.)
      const session = await withFallback(
        supabase.auth.getSession().then(({ data }) => data.session),
        3000,
        null,
      );
      const accessToken = session?.access_token;

      const origin = window.location.origin;
      const res = await fetch(`${FUNCTIONS_URL}/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({
          items: items.map((i) => ({
            product_id: i.id,
            size: i.size,
            quantity: i.quantity,
          })),
          country,
          success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/cart`,
        }),
      });

      // Parse defensively: a gateway 502 returns an HTML body, and res.json() would then
      // throw a raw "Unexpected token '<'" SyntaxError at the user instead of the reason.
      const raw = await res.text();
      let json: { url?: string; error?: string } = {};
      try {
        json = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error(
          `Checkout konnte nicht gestartet werden (Serverfehler ${res.status}). Bitte versuche es erneut.`,
        );
      }

      if (!res.ok || !json.url) {
        throw new Error(json.error ?? "Checkout konnte nicht gestartet werden.");
      }

      // Hand off to Stripe-hosted checkout. Stripe handles cards + (when enabled
      // in the Dashboard) Apple Pay, Google Pay, Klarna, SOFORT, SEPA, etc.
      window.location.href = json.url;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Etwas ist schiefgelaufen.";
      toast.error(msg);
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
        <SEOHead title="Checkout" canonicalPath="/checkout" noIndex />
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-3">Dein Warenkorb ist leer</h1>
          <p className="text-muted-foreground mb-6">
            Stöbere im Shop und füge etwas hinzu, bevor du auscheckst.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center bg-primary text-primary-foreground font-medium px-6 py-2.5 rounded-lg"
          >
            Zum Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Checkout"
        description="Sicherer Checkout — schließe deine Bestellung ab."
        canonicalPath="/checkout"
        noIndex
      />
      <div className="w-full max-w-2xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link
              to="/cart"
              className="text-muted-foreground hover:text-black dark:hover:text-white flex items-center gap-2"
            >
              ← Zurück
            </Link>
            <h1 className="text-2xl font-bold ml-4">Checkout</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10">
          {/* Order Summary */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Bestellübersicht</h2>
            <div className="space-y-4">
              {items.map((item) => {
                const available = stockLimits[item.id]?.[item.size] ?? Infinity;
                const stockIssue = item.quantity > available;
                return (
                  <div
                    key={`${item.id}-${item.size}`}
                    className="flex items-center space-x-4"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Größe: {item.size} · Menge: {item.quantity}
                      </p>
                      {stockIssue && (
                        <p className="text-red-500 text-sm">
                          Nur noch {available} verfügbar
                        </p>
                      )}
                    </div>
                    <p className="font-medium">
                      {formatPrice(item.price * item.quantity, country)}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-border mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Zwischensumme</span>
                <span>{formatPrice(subtotal, country)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Versand ({SHIPPING_RATES[country].label})
                </span>
                <span>{freeShipping ? "Kostenlos" : formatPrice(shippingCost, country)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2">
                <span>Total</span>
                <span>{formatPrice(total, country)}</span>
              </div>
              {/* CH: CHF ist nur Anzeige — Stripe rechnet in EUR ab. */}
              {country === "CH" && (
                <p className="text-xs text-muted-foreground pt-1">
                  Abrechnung in EUR ({formatPrice(total, "DE")}) — CHF-Preis
                  gerundet, Kurs ca. {SHOP_CONFIG.chfPerEur}
                </p>
              )}
            </div>
          </section>

          {/* Payment */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Zahlung</h2>
            <div className="rounded-xl border border-border p-5 mb-5 bg-muted">
              <div className="flex items-start gap-3">
                <ShieldCheck className="size-5 mt-0.5 text-emerald-500 shrink-0" />
                <div className="text-sm">
                  <p className="font-medium mb-1">
                    Sicher mit Stripe bezahlen
                  </p>
                  <p className="text-muted-foreground">
                    Du wirst zur sicheren Stripe-Bezahlseite weitergeleitet —
                    Kreditkarte, Apple Pay, Google Pay, Klarna und SEPA stehen
                    je nach Verfügbarkeit zur Auswahl. Deine Zahlungsdaten
                    erreichen unseren Server nie.
                  </p>
                </div>
              </div>
            </div>

            {/* Lieferland + Versandkosten */}
            <div className="mb-5">
              <label
                htmlFor="checkout-country"
                className="block text-sm font-medium mb-2"
              >
                Lieferland
              </label>
              <Select
                value={country}
                onValueChange={(v) => setCountry(v as Country)}
              >
                <SelectTrigger id="checkout-country" className="w-full">
                  <SelectValue placeholder="Lieferland wählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DE">Deutschland</SelectItem>
                  <SelectItem value="AT">Österreich</SelectItem>
                  <SelectItem value="CH">Schweiz</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex justify-between text-sm mt-3">
                <span className="text-muted-foreground">Versandkosten</span>
                <span>
                  {freeShipping ? "Kostenlos" : formatPrice(shippingCost, country)}
                </span>
              </div>
              {country === "DE" && (
                <p className="text-xs text-muted-foreground mt-1">
                  Versandkostenfrei ab 50 € (DE)
                </p>
              )}
            </div>

            {/* AGB / Widerruf Pflicht-Checkbox */}
            <div className="flex items-start gap-3 mb-5">
              <Checkbox
                id="accept-terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                className="mt-0.5"
              />
              <label
                htmlFor="accept-terms"
                className="text-sm leading-snug cursor-pointer"
              >
                Ich habe die{" "}
                <Link to="/agb" className="underline underline-offset-2">
                  AGB
                </Link>{" "}
                und die{" "}
                <Link to="/widerruf" className="underline underline-offset-2">
                  Widerrufsbelehrung
                </Link>{" "}
                gelesen und akzeptiere sie.
              </label>
            </div>

            <button
              onClick={handleStripeCheckout}
              disabled={payDisabled}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-medium rounded-lg py-3 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Weiterleiten…
                </>
              ) : stockStatus === "checking" ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Verfügbarkeit wird geprüft…
                </>
              ) : (
                <>
                  <Lock className="size-4" />
                  Sicher bezahlen · {formatPrice(total, country)}
                </>
              )}
            </button>

            <p className="text-xs text-center text-muted-foreground dark:text-muted-foreground mt-3">
              Der Gesamtbetrag inkl. Versand wird auf der Stripe-Bezahlseite
              noch einmal angezeigt.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
