
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/auth/login', { replace: true });
          return;
        }
        
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error checking authentication:', error);
        navigate('/auth/login', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          navigate('/auth/login', { replace: true });
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      }
    );

    checkAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return { isLoading, isAuthenticated };
};
