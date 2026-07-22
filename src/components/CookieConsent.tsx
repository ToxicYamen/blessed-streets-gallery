import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "bs-cookie-notice";

/**
 * Datenschutz-Hinweisbanner.
 *
 * Der Shop setzt ausschließlich technisch notwendige Cookies bzw. Speicher
 * (Supabase-Auth-Session, Warenkorb in localStorage) — kein Tracking, keine
 * Werbung. Dafür ist nach DSGVO/TTDSG keine Einwilligung nötig, deshalb ist
 * das hier bewusst ein ehrlicher Info-Banner mit einem einzigen Button und
 * kein Consent-Dialog.
 */
const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) !== "1") {
        setVisible(true);
      }
    } catch {
      // localStorage nicht verfügbar (z. B. blockiert) → Banner einfach zeigen
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Speichern fehlgeschlagen → Banner trotzdem für diese Sitzung schließen
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie-Hinweis"
      className="fixed bottom-4 right-4 left-4 sm:left-auto z-50 max-w-lg rounded-xl border border-white/15 bg-black p-4 text-white shadow-lg"
    >
      <p className="text-xs leading-relaxed text-white/80">
        Wir verwenden ausschließlich technisch notwendige Cookies — kein
        Tracking, keine Werbung.{" "}
        <Link
          to="/datenschutz"
          className="underline underline-offset-2 text-white/90 hover:text-white transition-colors"
        >
          Mehr in der Datenschutzerklärung
        </Link>
      </p>
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={dismiss}
          className="rounded-md border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-wide hover:bg-white/20 transition-colors"
        >
          Alles klar
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
