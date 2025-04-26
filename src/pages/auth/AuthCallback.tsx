
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session and check if we have a valid user
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        if (session?.user) {
          // Check if the user has a profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          // If no profile exists, create one
          if (profileError || !profile) {
            let firstName = '';
            let lastName = '';
            
            // Try to extract name from user metadata or email
            if (session.user.user_metadata?.full_name) {
              const nameParts = session.user.user_metadata.full_name.split(' ');
              firstName = nameParts[0] || '';
              lastName = nameParts.slice(1).join(' ') || '';
            } else if (session.user.email) {
              firstName = session.user.email.split('@')[0];
            }
            
            await supabase
              .from('profiles')
              .insert({
                id: session.user.id,
                email: session.user.email,
                first_name: firstName,
                last_name: lastName,
                avatar_url: session.user.user_metadata?.avatar_url || null
              });
          }
          
          toast.success('Successfully logged in!');
          navigate('/account');
        } else {
          navigate('/auth/login');
        }
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setError(err.message);
        setTimeout(() => {
          navigate('/auth/login');
        }, 3000);
      }
    };
    
    handleAuthCallback();
  }, [navigate]);
  
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="text-center">
        {error ? (
          <div>
            <h2 className="text-xl font-semibold text-red-500">Authentication Error</h2>
            <p className="mt-2">{error}</p>
            <p className="mt-4">Redirecting to login page...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4">Completing login...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
