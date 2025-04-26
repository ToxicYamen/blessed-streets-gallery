
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Mail, Loader2 } from 'lucide-react';

interface AuthFormProps {
  mode: 'login' | 'register' | 'reset';
}

export function AuthForm({ mode }: AuthFormProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOAuthLoading] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        navigate('/account');
        toast.success('Successfully logged in!');
      } else if (mode === 'register') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
            },
          },
        });
        
        if (error) throw error;
        toast.success('Registration successful! Please check your email.');
      } else if (mode === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        
        if (error) throw error;
        toast.success('Password reset instructions sent to your email!');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'discord') => {
    try {
      setOAuthLoading(provider);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message);
      setOAuthLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAuth} className="space-y-4">
        {mode === 'register' && (
          <>
            <div>
              <Input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </>
        )}
        <div>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {mode !== 'reset' && (
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        )}
        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {loading ? 'Loading...' : mode === 'login' ? 'Sign In' : mode === 'register' ? 'Sign Up' : 'Reset Password'}
        </Button>
      </form>

      {(mode === 'login' || mode === 'register') && (
        <>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white dark:bg-black text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <Button 
              variant="outline" 
              type="button" 
              disabled={!!oauthLoading} 
              onClick={() => handleOAuthLogin('google')}
              className="flex items-center justify-center gap-2"
            >
              {oauthLoading === 'google' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              Google
            </Button>
            
            <Button 
              variant="outline" 
              type="button" 
              disabled={!!oauthLoading} 
              onClick={() => handleOAuthLogin('discord')}
              className="flex items-center justify-center gap-2"
            >
              {oauthLoading === 'discord' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.14 96.36">
                  <path fill="#5865F2" d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a.72.72,0,0,0-.75.51,73.26,73.26,0,0,0-3.24,6.64,97.68,97.68,0,0,0-29.32,0A67.27,67.27,0,0,0,44.92.51.74.74,0,0,0,44.17,0,105.89,105.89,0,0,0,17.94,8.07.72.72,0,0,0,17.7,8.2C2.73,31.65-1.67,54.41.54,76.8a.79.79,0,0,0,.3.52,106.46,106.46,0,0,0,32.07,16.3.75.75,0,0,0,.81-.29,75.47,75.47,0,0,0,6.52-10.62.74.74,0,0,0-.41-1,70.09,70.09,0,0,1-10-4.73.75.75,0,0,1-.07-1.23,52.68,52.68,0,0,0,2.35-1.85.73.73,0,0,1,.76-.11c16.21,7.4,33.7,7.4,49.67,0a.73.73,0,0,1,.76.1,57.76,57.76,0,0,0,2.36,1.86.75.75,0,0,1-.07,1.23,65.42,65.42,0,0,1-10,4.72.75.75,0,0,0-.4,1,87.92,87.92,0,0,0,6.51,10.61.75.75,0,0,0,.81.3A106,106,0,0,0,126.3,77.32a.77.77,0,0,0,.3-.52c2.66-27.45-4.42-50.06-18.61-68.6A.6.6,0,0,0,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36,40.34,42.45,40.34s11.66,5.89,11.45,12.72S48.73,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5.12-12.72,11.44-12.72S96.35,46.14,96.14,53,90.94,65.69,84.69,65.69Z" />
                </svg>
              )}
              Discord
            </Button>
            
            <Button 
              variant="outline" 
              type="button" 
              disabled={!!oauthLoading} 
              onClick={() => handleOAuthLogin('discord')}
              className="flex items-center justify-center gap-2"
            >
              {oauthLoading === 'email' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Mail className="h-4 w-4" />
              )}
              Email Magic Link
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
