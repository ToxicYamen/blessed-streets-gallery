import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2, AlertTriangle } from "lucide-react";

import { useCartStore } from "@/lib/store/cart";
import { SEOHead } from "@/components/seo/SEOHead";

const FUNCTIONS_URL = "https://xsyjrijezdajiojxgzzr.supabase.co/functions/v1";

type Order = {
  id: string;
  total: number;
  items: Array<{ name: string; size: string; quantity: number; price: number }>;
  shipping_address: string | null;
  estimated_delivery: string | null;
};

const CheckoutSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = params.get("session_id");
  const { clearCart } = useCartStore();

  const [state, setState] = useState<"loading" | "paid" | "unpaid" | "error">("loading");
  const [order, setOrder] = useState<Order | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (!sessionId) {
      navigate("/", { replace: true });
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${FUNCTIONS_URL}/verify-checkout-session`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId }),
        });
        const json = await res.json();
        if (cancelled) return;

        if (!res.ok) {
          setErrorMessage(json.error ?? "Verifizierung fehlgeschlagen.");
          setState("error");
          return;
        }
        if (json.paid) {
          setOrder(json.order);
          setState("paid");
          clearCart();
        } else {
          setState("unpaid");
        }
      } catch (err) {
        if (cancelled) return;
        setErrorMessage(err instanceof Error ? err.message : "Netzwerkfehler.");
        setState("error");
      }
    })();

    return () => { cancelled = true; };
  }, [sessionId, navigate, clearCart]);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-16">
      <SEOHead title="Bestellung bestätigt" canonicalPath="/checkout/success" noIndex />
      <div className="w-full max-w-xl">
        {state === "loading" && (
          <div className="flex flex-col items-center gap-3 text-center py-12">
            <Loader2 className="size-10 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground">
              Bestellung wird bestätigt…
            </p>
          </div>
        )}

        {state === "paid" && order && (
          <div className="rounded-2xl border border-border p-8 text-center">
            <div className="grid size-14 place-items-center rounded-full bg-emerald-500/10 text-emerald-500 mx-auto mb-4">
              <CheckCircle2 className="size-7" />
            </div>
            <h1 className="text-2xl font-semibold mb-2">Danke für deinen Kauf!</h1>
            <p className="text-muted-foreground mb-6">
              Deine Bestellung <span className="font-mono">{order.id.slice(0, 8)}</span> ist eingegangen
              und wird vorbereitet.
            </p>

            <div className="text-left bg-muted rounded-lg p-4 mb-6">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm py-1.5">
                  <span>
                    {item.name} · {item.size} × {item.quantity}
                  </span>
                  <span>{(item.price * item.quantity).toFixed(2)} €</span>
                </div>
              ))}
              <div className="border-t border-border mt-3 pt-3 flex justify-between font-semibold">
                <span>Gesamt</span>
                <span>{Number(order.total).toFixed(2)} €</span>
              </div>
            </div>

            {order.estimated_delivery && (
              <p className="text-sm text-muted-foreground mb-6">
                Voraussichtliche Lieferung: {new Date(order.estimated_delivery).toLocaleDateString("de-DE")}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/account"
                className="inline-flex justify-center bg-primary text-primary-foreground font-medium px-6 py-2.5 rounded-lg"
              >
                Meine Bestellungen
              </Link>
              <Link
                to="/shop"
                className="inline-flex justify-center border border-border px-6 py-2.5 rounded-lg"
              >
                Weiter shoppen
              </Link>
            </div>
          </div>
        )}

        {state === "unpaid" && (
          <div className="rounded-2xl border border-amber-300 bg-amber-50 dark:bg-amber-950/30 p-8 text-center">
            <AlertTriangle className="size-10 text-amber-500 mx-auto mb-3" />
            <h1 className="text-xl font-semibold mb-2">
              Zahlung noch nicht abgeschlossen
            </h1>
            <p className="text-foreground/80 mb-6">
              Stripe hat die Zahlung noch nicht bestätigt. Falls du sie abgebrochen hast,
              kannst du es erneut versuchen.
            </p>
            <Link
              to="/checkout"
              className="inline-flex bg-primary text-primary-foreground font-medium px-6 py-2.5 rounded-lg"
            >
              Zurück zum Checkout
            </Link>
          </div>
        )}

        {state === "error" && (
          <div className="rounded-2xl border border-red-300 bg-red-50 dark:bg-red-950/30 p-8 text-center">
            <AlertTriangle className="size-10 text-red-500 mx-auto mb-3" />
            <h1 className="text-xl font-semibold mb-2">Etwas ist schiefgelaufen</h1>
            <p className="text-foreground/80 mb-2">{errorMessage}</p>
            <p className="text-sm text-muted-foreground mb-6">
              Falls Geld abgebucht wurde, melde dich kurz beim Support — wir prüfen das.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/support"
                className="inline-flex justify-center bg-primary text-primary-foreground font-medium px-6 py-2.5 rounded-lg"
              >
                Support kontaktieren
              </Link>
              <Link
                to="/"
                className="inline-flex justify-center border border-border px-6 py-2.5 rounded-lg"
              >
                Zur Startseite
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutSuccess;
