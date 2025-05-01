
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
    // First check for existing session
    const fetchSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error fetching session:', error);
          setLoading(false);
          if (requireAuth) {
            navigate('/auth/login');
          }
          return;
        }
        
        if (data.session) {
          setSession(data.session);
          
          // Map Supabase User to AuthUser with required fields
          if (data.session.user) {
            setUser({
              id: data.session.user.id,
              email: data.session.user.email || '' // Provide default value for potentially undefined email
            });
          }
        } else if (requireAuth) {
          navigate('/auth/login');
        }
      } catch (error) {
        console.error('Unexpected error fetching session:', error);
      } finally {
        setLoading(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        
        // Map Supabase User to AuthUser with required fields
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '' // Provide default value for potentially undefined email
          });
        } else {
          setUser(null);
        }
      }
    );

    fetchSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, requireAuth]);

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      navigate('/');
    }
  };

  return { user, session, loading, logout };
};
