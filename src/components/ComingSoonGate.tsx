import { Component, Suspense, lazy, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import BlurText from "@/components/BlurText";
import StarBorder from "@/components/StarBorder";

// Particles nutzt WebGL (ogl) — lazy, damit es den Haupt-Chunk nicht belastet.
// Schlägt schon der Chunk-Load fehl, rendern wir einfach nichts.
const Particles = lazy(() =>
  import("@/components/Particles").catch(() => ({ default: () => null })),
);

/** Fängt WebGL-/Render-Fehler des Deko-Effekts ab — das Gate selbst (E-Mail-
 *  Sammlung!) darf durch Deko niemals mitgerissen werden. */
class EffectBoundary extends Component<{ children: ReactNode }, { broken: boolean }> {
  state = { broken: false };
  static getDerivedStateFromError() {
    return { broken: true };
  }
  render() {
    return this.state.broken ? null : this.props.children;
  }
}

const PREVIEW_KEY = "bs-preview";

/** Team-Passwort für den Zugang zur Seite vor dem Launch (Betreiber-Wunsch).
 *  Bewusst nur ein weiches Tor: Es hält Besucher fern, ist aber keine echte
 *  Sicherheitsmaßnahme (steht im JS-Bundle) — der Shop-Inhalt ist nicht geheim. */
const TEAM_PASSWORD = "Yamen123";

/** Gate ist STANDARDMÄSSIG AKTIV — die Coming-Soon-Seite ist die Hauptseite.
 *  Abschalten zum Launch: VITE_COMING_SOON=false beim Build/Deploy setzen. */
const gateEnabled = import.meta.env.VITE_COMING_SOON !== "false";

/**
 * Bypass: `?vip=blessed` in der URL ODER localStorage `bs-preview === "1"`
 * (wird auch durch die korrekte Passwort-Eingabe gesetzt). Der URL-Bypass
 * wird persistiert, damit die Seite dauerhaft offen bleibt.
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
 * Vollbild-Coming-Soon-Gate mit E-Mail-Sammlung (Tabelle launch_signups).
 *
 * Rendert ÜBER der gesamten App (fixed inset-0, z-[100]) — die Routes
 * existieren darunter weiter, das Gate deckt sie einfach ab.
 */
const ComingSoonGate = () => {
  const [active, setActive] = useState(() => gateEnabled && !hasPreviewAccess());
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordWrong, setPasswordWrong] = useState(false);

  const reducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

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

  const handlePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === TEAM_PASSWORD) {
      try {
        localStorage.setItem(PREVIEW_KEY, "1");
      } catch {
        // localStorage blockiert → Zugang gilt trotzdem für diese Sitzung
      }
      setActive(false);
    } else {
      setPasswordWrong(true);
    }
  };

  const done = status === "success" || status === "already";

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-black px-6 text-center text-white">
      {/* Sternenstaub-Backdrop — monochrom, dezent, nicht bei reduced-motion */}
      {!reducedMotion && (
        <EffectBoundary>
          <Suspense fallback={null}>
            <div className="pointer-events-none absolute inset-0 opacity-60">
              <Particles
                particleColors={["#ffffff", "#8a898c"]}
                particleCount={160}
                speed={0.06}
                alphaParticles
                moveParticlesOnHover={false}
              />
            </div>
          </Suspense>
        </EffectBoundary>
      )}

      {/* Marken-Raster hinter allem, wie auf der restlichen Seite */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808018_1px,transparent_1px),linear-gradient(to_bottom,#80808018_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_45%,black_50%,transparent_100%)]"
      />

      <div className="relative flex w-full flex-col items-center">
        <img
          src="/blessed-streets-icon.svg"
          alt="Blessed Streets"
          width={72}
          height={72}
          className="h-18 w-18 rounded-2xl"
        />
        <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.35em] text-white/50">
          EST. 2022 · DETMOLD
        </p>

        <BlurText
          text="BALD VERFÜGBAR"
          animateBy="letters"
          delay={40}
          className="mt-8 justify-center font-display text-3xl font-medium uppercase tracking-widest sm:text-5xl"
        />

        <p className="mt-5 max-w-md text-sm leading-relaxed text-white/70">
          Der Drop kommt. Trag dich ein und erfahre es als Erste:r.
        </p>

        {done ? (
          <p className="mt-9 text-sm font-medium text-white" role="status">
            {status === "success"
              ? "Wir sagen dir Bescheid ✓"
              : "Du bist schon auf der Liste ✓"}
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-9 flex w-full max-w-sm flex-col items-stretch gap-3 sm:flex-row"
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
              className="min-h-11 flex-1 rounded-md border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none transition-colors focus:border-white/60 focus-visible:ring-2 focus-visible:ring-white/40"
            />
            <StarBorder
              as="button"
              type="submit"
              disabled={status === "loading"}
              color="#ffffff"
              speed="5s"
              className="cursor-pointer disabled:opacity-60"
            >
              <span className="text-sm font-medium">
                {status === "loading" ? "Moment…" : "Benachrichtigen"}
              </span>
            </StarBorder>
          </form>
        )}

        {status === "error" && (
          <p className="mt-3 text-xs text-white/60" role="alert">
            Das hat nicht geklappt — prüf deine E-Mail-Adresse und versuch es
            noch mal.
          </p>
        )}

        {/* Team-Zugang: dezenter Link unten, Passwort öffnet die Seite dauerhaft */}
        <div className="mt-14">
          {showPassword ? (
            <form
              onSubmit={handlePassword}
              className="flex items-center justify-center gap-2"
            >
              <label htmlFor="gate-password" className="sr-only">
                Team-Passwort
              </label>
              <input
                id="gate-password"
                type="password"
                autoFocus
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordWrong(false);
                }}
                placeholder="Passwort"
                className="min-h-11 w-44 rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-white/50"
              />
              <button
                type="submit"
                className="min-h-11 rounded-md border border-white/20 px-4 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                Öffnen
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setShowPassword(true)}
              className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/30 transition-colors hover:text-white/60"
            >
              Team-Zugang
            </button>
          )}
          {passwordWrong && (
            <p className="mt-2 text-xs text-white/50" role="alert">
              Falsches Passwort.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComingSoonGate;
