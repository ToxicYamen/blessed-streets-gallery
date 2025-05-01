
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
    // Set up auth state listener first
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
        
        setLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
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
      
      if (!session && requireAuth) {
        navigate('/auth/login');
      }
      
      setLoading(false);
    });

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
