// Final step of the password-recovery flow.
// The email link from Supabase redirects here with a recovery token in the
// URL hash. The supabase-js client (with detectSessionInUrl: true) parses the
// hash on mount and fires a PASSWORD_RECOVERY event — at that point the user
// has a recovery session and we can show a "new password" form.

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/seo/SEOHead";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    // Two paths to "ready":
    //   1. The client picks up the hash and fires PASSWORD_RECOVERY.
    //   2. We already have a session when the page mounts (e.g. user navigates
    //      here manually while logged in to change their password).
    const sub = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled) return;
      if (event === "PASSWORD_RECOVERY" || session) {
        setReady(true);
        setErrorMessage("");
      }
    });

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!cancelled && data.session) setReady(true);
    })();

    // Watchdog — if we don't get a recovery session within 6s, the link
    // probably expired or the hash is malformed.
    const watchdog = setTimeout(() => {
      if (!cancelled && !ready) {
        setErrorMessage(
          "Der Link ist ungültig oder abgelaufen. Bitte fordere einen neuen Reset-Link an.",
        );
      }
    }, 6000);

    return () => {
      cancelled = true;
      clearTimeout(watchdog);
      sub.data.subscription.unsubscribe();
    };
    // We intentionally don't depend on `ready` to avoid resetting the watchdog.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Mindestens 6 Zeichen.");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwörter stimmen nicht überein.");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setDone(true);
      toast.success("Passwort gespeichert.");
      setTimeout(() => navigate("/account", { replace: true }), 1500);
    } catch (err: any) {
      toast.error(err?.message ?? "Konnte Passwort nicht setzen.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen w-full bg-background dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center">
      <SEOHead title="Neues Passwort" canonicalPath="/auth/reset-password" noIndex />
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-card">
        {done ? (
          <div className="text-center py-6">
            <div className="grid size-14 place-items-center rounded-full bg-emerald-500/10 text-emerald-500 mx-auto mb-4">
              <CheckCircle2 className="size-7" />
            </div>
            <h2 className="font-bold text-xl text-foreground mb-2">
              Passwort gesetzt
            </h2>
            <p className="text-muted-foreground text-sm">
              Du wirst gleich weitergeleitet…
            </p>
          </div>
        ) : !ready ? (
          <div className="flex flex-col items-center text-center gap-3 py-6">
            {errorMessage ? (
              <>
                <h2 className="font-bold text-xl text-foreground">
                  Link ungültig
                </h2>
                <p className="text-muted-foreground text-sm">
                  {errorMessage}
                </p>
                <Link
                  to="/auth/forgot-password"
                  className="font-medium text-primary hover:text-primary/80 mt-2"
                >
                  Neuen Link anfordern
                </Link>
              </>
            ) : (
              <>
                <Loader2 className="size-8 animate-spin text-neutral-400" />
                <p className="text-muted-foreground text-sm">
                  Link wird geprüft…
                </p>
              </>
            )}
          </div>
        ) : (
          <>
            <h2 className="font-bold text-xl text-foreground">
              Neues Passwort
            </h2>
            <p className="text-muted-foreground text-sm max-w-sm mt-2">
              Wähle ein neues Passwort für dein Konto. Mindestens 6 Zeichen.
            </p>

            <form onSubmit={onSubmit} className="my-8 space-y-4">
              <Input
                type="password"
                placeholder="Neues Passwort"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <Input
                type="password"
                placeholder="Passwort bestätigen"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={6}
              />
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Speichere…" : "Passwort setzen"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-2">
              <Link
                to="/auth/login"
                className="font-medium text-primary hover:text-primary/80"
              >
                Zurück zum Login
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
