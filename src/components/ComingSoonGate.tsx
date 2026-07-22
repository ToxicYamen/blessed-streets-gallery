import { useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

const PREVIEW_KEY = "bs-preview";

/** Gate ist nur aktiv, wenn das Env-Flag explizit gesetzt ist. */
const gateEnabled = import.meta.env.VITE_COMING_SOON === "true";

/**
 * Geheimer Bypass für Esma/Yamen: `?vip=blessed` in der URL ODER
 * localStorage `bs-preview === "1"`. Der URL-Bypass wird in localStorage
 * persistiert, damit die Seite dauerhaft offen bleibt.
 */
const hasPreviewAccess = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    if (new URLSearchParams(window.location.search).get("vip") === "blessed") {
      localStorage.setItem(PREVIEW_KEY, "1");
      return true;
    }
    return localStorage.getItem(PREVIEW_KEY) === "1";
  } catch {
    return false;
  }
};

type Status = "idle" | "loading" | "success" | "already" | "error";

/**
 * Vollbild-Coming-Soon-Gate mit E-Mail-Sammlung.
 *
 * Rendert ÜBER der gesamten App (fixed inset-0, z-[100]) — die Routes
 * existieren darunter weiter, das Gate deckt sie einfach ab.
 */
const ComingSoonGate = () => {
  const [active] = useState(() => gateEnabled && !hasPreviewAccess());
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  if (!active) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();

    // Einfache Validierung: enthält @ und danach einen Punkt.
    if (!trimmed.includes("@") || !trimmed.split("@").pop()?.includes(".")) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    // `launch_signups` ist (noch) nicht in den generierten Database-Types —
    // deshalb der Weg über den untypisierten Client für diesen einen Insert.
    const { error } = await (supabase as SupabaseClient)
      .from("launch_signups")
      .insert({ email: trimmed.toLowerCase() });

    if (!error) {
      setStatus("success");
    } else if (error.code === "23505" || `${error.code}` === "409") {
      // Unique violation → E-Mail ist schon eingetragen. Kein Fehler.
      setStatus("already");
    } else {
      setStatus("error");
    }
  };

  const done = status === "success" || status === "already";

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black px-6 text-center text-white">
      <img
        src="/blessed-streets-logo.svg"
        alt="Blessed Streets"
        className="h-16 w-auto"
      />
      <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.35em] text-white/50">
        EST. 2022
      </p>
      <h1 className="mt-8 font-display text-3xl sm:text-4xl font-medium uppercase tracking-widest">
        Bald verfügbar
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
        Der Drop kommt. Trag dich ein und erfahre es als Erste:r.
      </p>

      {done ? (
        <p className="mt-8 text-sm font-medium text-white" role="status">
          {status === "success"
            ? "Wir sagen dir Bescheid ✓"
            : "Du bist schon auf der Liste ✓"}
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:flex-row"
        >
          <label htmlFor="coming-soon-email" className="sr-only">
            E-Mail-Adresse
          </label>
          <input
            id="coming-soon-email"
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            placeholder="deine@email.de"
            className="flex-1 rounded-md border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/50 transition-colors"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-md bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-white/85 disabled:opacity-60 transition-colors"
          >
            {status === "loading" ? "Moment…" : "Benachrichtigen"}
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="mt-3 text-xs text-white/60" role="alert">
          Das hat nicht geklappt — prüf deine E-Mail-Adresse und versuch es noch
          mal.
        </p>
      )}
    </div>
  );
};

export default ComingSoonGate;
