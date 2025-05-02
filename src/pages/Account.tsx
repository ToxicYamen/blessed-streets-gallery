
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PageHeader } from '@/components/ui/PageHeader';
import { ProfileSection } from '@/components/account/ProfileSection';
import { OrdersList } from '@/components/account/OrdersList';
import { AccountSidebar } from '@/components/account/AccountSidebar';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';

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
  const [fetchAttempted, setFetchAttempted] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      // Only fetch if we have a user and we're mounted
      if (!user?.id || !isMounted) return;
      
      try {
        setProfileLoading(true);
        console.log('Fetching profile for user:', user.id);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error.message);
          throw error;
        }
        
        if (isMounted) {
          console.log('Profile data received:', data);
          setProfile(data);
        }
      } catch (error: any) {
        console.error('Error loading profile:', error);
        if (isMounted) {
          toast.error(`Error loading profile: ${error.message}`);
        }
      } finally {
        if (isMounted) {
          setProfileLoading(false);
          setFetchAttempted(true);
        }
      }
    };

    // Only try to fetch profile when auth is done loading and we have a user
    if (!authLoading && user && !fetchAttempted) {
      fetchProfile();
    } else if (!authLoading) {
      // Auth is done loading but no user
      setProfileLoading(false);
      setFetchAttempted(true);
    }

    return () => {
      isMounted = false;
    };
  }, [authLoading, user, fetchAttempted]);

  // Force refetch profile function
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
      console.error('Error refetching profile:', error);
      toast.error(`Error refetching profile: ${error.message}`);
    } finally {
      setProfileLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
        <span className="ml-3">Loading authentication...</span>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Account"
        description="Manage your account settings and view your orders"
      />
      
      <div className="blesssed-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-[1fr,400px] gap-8">
          {/* Profile and Orders Sections */}
          <div className="space-y-6">
            <ProfileSection 
              profile={profile} 
              loading={profileLoading} 
              onProfileUpdated={refetchProfile} 
            />
            {user && <OrdersList userId={user.id} />}
          </div>

          {/* Sidebar */}
          <AccountSidebar onLogout={logout} />
        </div>
      </div>
    </div>
  );
};

export default Account;
