
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

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

  // Race an auth promise against a timeout so the button doesn't hang forever
  // when the network is flaky or the Supabase auth endpoint is slow.
  const withTimeout = <T,>(p: Promise<T>, ms = 15000): Promise<T> =>
    new Promise<T>((resolve, reject) => {
      const t = setTimeout(() => reject(new Error('Zeitüberschreitung — bitte erneut versuchen.')), ms);
      p.then((v) => { clearTimeout(t); resolve(v); }, (e) => { clearTimeout(t); reject(e); });
    });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await withTimeout(
          supabase.auth.signInWithPassword({ email, password }),
        );

        if (error) throw error;
        toast.success('Erfolgreich angemeldet');
        navigate('/account');
      } else if (mode === 'register') {
        const { error } = await withTimeout(
          supabase.auth.signUp({
            email,
            password,
            options: { data: { first_name: firstName, last_name: lastName } },
          }),
        );

        if (error) throw error;
        toast.success('Registrierung erfolgreich! Bitte prüfe deine E-Mails.');
      } else if (mode === 'reset') {
        const { error } = await withTimeout(
          supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/reset-password`,
          }),
        );

        if (error) throw error;
        toast.success('Link zum Zurücksetzen wurde an deine E-Mail gesendet.');
      }
    } catch (error: any) {
      // Translate the most common Supabase auth errors so the user sees
      // something useful instead of raw English error strings.
      const msg = error?.message ?? 'Unbekannter Fehler';
      const translated =
        msg.includes('Invalid login credentials')
          ? 'E-Mail oder Passwort falsch.'
          : msg.includes('Email not confirmed')
          ? 'E-Mail noch nicht bestätigt — bitte den Link in der Bestätigungs-Mail klicken.'
          : msg.includes('User already registered')
          ? 'Diese E-Mail ist bereits registriert — bitte stattdessen anmelden.'
          : msg.includes('Password should be')
          ? 'Passwort zu schwach — mindestens 6 Zeichen.'
          : msg;
      toast.error(translated);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleAuth} className="space-y-4">
      {mode === 'register' && (
        <>
          <div>
            <Input
              type="text"
              placeholder="Vorname"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              type="text"
              placeholder="Nachname"
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
          placeholder="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      {mode !== 'reset' && (
        <div>
          <Input
            type="password"
            placeholder="Passwort"
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
        {loading ? 'Lädt…' : mode === 'login' ? 'Anmelden' : mode === 'register' ? 'Registrieren' : 'Passwort zurücksetzen'}
      </Button>
    </form>
  );
}
