import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PageHeader } from '@/components/ui/PageHeader';
import { ProfileSection } from '@/components/account/ProfileSection';
import { OrdersList } from '@/components/account/OrdersList';
import { AccountSidebar } from '@/components/account/AccountSidebar';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { SEOHead } from '@/components/seo/SEOHead';

interface Profile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  address: string | null;
  avatar_url: string | null;
}

const Account = () => {
  const { user, loading: authLoading, logout } = useAuth(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  // Which user id we have already fetched a profile for. This used to be a plain
  // `fetchAttempted` boolean, which was a one-way latch: if auth ever settled with a
  // null user first (it did — the old 5s watchdog), the latch flipped to true forever
  // and the profile was NEVER fetched once the real user arrived, leaving the page
  // silently blank. Keying on the id makes a late-arriving user re-trigger the fetch.
  const fetchedForUser = useRef<string | null>(null);
  const [orderStats, setOrderStats] = useState<{ count: number; total: number }>();

  // Lifted callback so OrdersList can push its stats up to the sidebar without
  // a second Supabase round-trip in the sidebar itself.
  const handleOrderStats = useCallback(
    (stats: { count: number; total: number }) => setOrderStats(stats),
    [],
  );

  useEffect(() => {
    if (authLoading) return;

    const userId = user?.id;
    if (!userId) {
      // Auth settled with no user — useAuth(true) is already redirecting to /auth/login.
      fetchedForUser.current = null;
      setProfile(null);
      setProfileLoading(false);
      return;
    }

    if (fetchedForUser.current === userId) return;
    fetchedForUser.current = userId;

    let isMounted = true;
    void (async () => {
      try {
        setProfileLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (error) throw error;
        if (isMounted) setProfile(data);
      } catch (error: any) {
        if (isMounted) {
          // Allow a retry on the next render instead of latching the failure in.
          fetchedForUser.current = null;
          toast.error(`Profil konnte nicht geladen werden: ${error.message}`);
        }
      } finally {
        if (isMounted) setProfileLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [authLoading, user?.id]);

  const refetchProfile = async () => {
    if (!user?.id) return;
    setProfileLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      toast.error(`Profil konnte nicht aktualisiert werden: ${error.message}`);
    } finally {
      setProfileLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div>
        <PageHeader title="Mein Konto" description="Verwalte dein Profil und deine Bestellungen." />
        <div className="blesssed-container py-12">
          <div className="grid grid-cols-1 md:grid-cols-[1fr,360px] gap-10">
            <div className="space-y-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-72 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <SEOHead
        title="Mein Konto"
        description="Verwalte dein Profil und deine Bestellungen."
        canonicalPath="/account"
        noIndex
      />

      <PageHeader
        title="Mein Konto"
        description="Profil, Bestellungen und Sendungsverfolgung — alles an einem Ort."
      />

      {/* Decorative grid backdrop — editorial atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] opacity-[0.04] bg-[linear-gradient(to_right,theme(colors.mono.100)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.mono.100)_1px,transparent_1px)] [background-size:48px_48px]"
      />

      <div className="blesssed-container py-12 md:py-16 relative">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,360px] gap-10 lg:gap-12">
          {/* Main column */}
          <div className="space-y-12 min-w-0">
            <ProfileSection
              profile={profile}
              loading={profileLoading}
              onProfileUpdated={refetchProfile}
            />
            {user && <OrdersList userId={user.id} onStats={handleOrderStats} />}
          </div>

          {/* Sidebar */}
          <AccountSidebar onLogout={logout} stats={orderStats} />
        </div>
      </div>
    </div>
  );
};

export default Account;
