
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
}

export const useAuth = (requireAuth = true) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    // Define session fetch function
    const fetchSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error fetching session:', error);
          if (mounted) {
            if (requireAuth) {
              navigate('/auth/login');
            }
            setLoading(false);
          }
          return;
        }
        
        // We have a session
        if (data.session) {
          if (mounted) {
            setSession(data.session);
            
            // Map Supabase User to AuthUser with required fields
            if (data.session.user) {
              setUser({
                id: data.session.user.id,
                email: data.session.user.email || ''
              });
            }
          }
        } else if (requireAuth && mounted) {
          // No session but auth is required
          navigate('/auth/login');
        }
      } catch (error) {
        console.error('Unexpected error fetching session:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (mounted) {
          setSession(session);
          
          // Map Supabase User to AuthUser with required fields
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email || ''
            });
          } else {
            setUser(null);
          }
        }
      }
    );

    // Fetch session immediately
    fetchSession();

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
        toast.success('Logged out successfully');
        navigate('/');
      }
    } catch (error: any) {
      toast.error(`Error during logout: ${error.message}`);
    }
  };

  return { user, session, loading, logout };
};
