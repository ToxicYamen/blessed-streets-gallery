import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Session } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
}

export const useAuth = (requireAuth = true) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Single source of truth: onAuthStateChange. auth-js emits INITIAL_SESSION to every
    // new subscriber once it has recovered/refreshed the stored session, so there is no
    // need for a separate getSession() call — that only paid the auth gate a second time.
    //
    // This replaces a 5s watchdog that called `navigate('/auth/login')` *unconditionally*
    // on timeout. It existed because getSession() used to hang forever (an async
    // onAuthStateChange callback in Header.tsx deadlocked the auth client — fixed), and
    // it was actively harmful: a logged-in user whose session merely resolved slowly got
    // kicked out to the login page. The hang is gone at the root, and every Supabase
    // request now has a hard 15s fetch timeout (see integrations/supabase/client.ts), so
    // INITIAL_SESSION always arrives — with a session or with null — and we redirect on
    // the real answer instead of on a guess.
    //
    // Keep this callback SYNCHRONOUS: auth-js awaits it while holding the auth lock.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;

      setSession(nextSession);
      setUser(
        nextSession?.user
          ? { id: nextSession.user.id, email: nextSession.user.email ?? '' }
          : null,
      );
      setLoading(false);

      if (requireAuth && !nextSession) {
        navigate('/auth/login');
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, requireAuth]);

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Abgemeldet');
        navigate('/');
      }
    } catch (error: any) {
      toast.error(`Fehler beim Abmelden: ${error.message}`);
    }
  };

  return { user, session, loading, logout };
};
