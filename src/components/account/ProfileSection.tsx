import { useEffect, useState } from 'react';
import { Mail, MapPin, Phone, User, Pencil, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface Profile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  address: string | null;
  avatar_url: string | null;
}

interface ProfileSectionProps {
  profile: Profile | null;
  loading: boolean;
  onProfileUpdated: () => void;
}

function initials(profile: Profile | null): string {
  if (!profile) return 'BS';
  const first = profile.first_name?.[0] ?? '';
  const last = profile.last_name?.[0] ?? '';
  const combo = (first + last).trim();
  if (combo) return combo.toUpperCase();
  return (profile.email[0] || 'B').toUpperCase();
}

export const ProfileSection = ({ profile, loading, onProfileUpdated }: ProfileSectionProps) => {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
      });
    }
  }, [profile]);

  const handleUpdateProfile = async () => {
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', session.user.id);

      if (error) throw error;

      toast.success('Profil aktualisiert');
      setEditing(false);
      onProfileUpdated();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="border border-mono-100/10 bg-mono-950/40 p-8 md:p-10">
        <div className="flex items-start gap-6">
          <Skeleton className="size-20 shrink-0" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-5 w-40" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  const fullName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(' ').trim() ||
    'Unbenannt';

  return (
    <section
      className={cn(
        'relative border border-mono-100/10 bg-mono-950/40 backdrop-blur-sm',
        'p-8 md:p-10 transition-all',
        editing && 'border-mono-100/30',
      )}
    >
      {/* Header strip */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-6 sm:gap-8">
        {/* Avatar — softly rounded square, brand initials */}
        <div className="relative shrink-0">
          <div className="size-20 md:size-24 grid place-items-center bg-mono-100 text-mono-950 rounded-lg">
            <span className="font-display text-3xl md:text-4xl leading-none -mt-0.5 font-semibold">
              {initials(profile)}
            </span>
          </div>
          <div className="absolute -bottom-1 -right-1 size-3 bg-emerald-400 rounded-full" aria-hidden />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-mono-500">
            Profil
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-mono-100 mt-1.5 leading-tight truncate">
            {fullName}
          </h2>
          <p className="text-mono-400 mt-1 text-sm font-mono truncate">
            {profile?.email}
          </p>
        </div>

        {!editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className={cn(
              'self-start group/edit flex items-center gap-2 text-sm',
              'border border-mono-100/20 px-4 py-2',
              'hover:bg-mono-100 hover:text-mono-950 transition-colors',
            )}
          >
            <Pencil className="size-3.5" />
            <span className="uppercase tracking-wider text-xs">Bearbeiten</span>
          </button>
        )}
      </div>

      {/* Hairline divider with brand mark in the middle */}
      <div className="mt-8 mb-8 flex items-center gap-4">
        <div className="h-px flex-1 bg-mono-100/10" />
        <span className="font-mono text-[10px] text-mono-500 tracking-[0.3em]">
          ESSENTIALS
        </span>
        <div className="h-px flex-1 bg-mono-100/10" />
      </div>

      {/* Fields */}
      {editing ? (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] uppercase tracking-[0.2em] text-mono-500">
                Vorname
              </Label>
              <Input
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="border-0 border-b border-mono-100/20 rounded-none px-0 bg-transparent focus-visible:ring-0 focus-visible:border-mono-100"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] uppercase tracking-[0.2em] text-mono-500">
                Nachname
              </Label>
              <Input
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="border-0 border-b border-mono-100/20 rounded-none px-0 bg-transparent focus-visible:ring-0 focus-visible:border-mono-100"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="font-mono text-[10px] uppercase tracking-[0.2em] text-mono-500">
              Telefon
            </Label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+49 …"
              className="border-0 border-b border-mono-100/20 rounded-none px-0 bg-transparent focus-visible:ring-0 focus-visible:border-mono-100"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="font-mono text-[10px] uppercase tracking-[0.2em] text-mono-500">
              Adresse
            </Label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Straße, PLZ, Stadt, Land"
              className="border-0 border-b border-mono-100/20 rounded-none px-0 bg-transparent focus-visible:ring-0 focus-visible:border-mono-100"
            />
          </div>
          <div className="flex items-center gap-3 pt-4">
            <Button
              onClick={handleUpdateProfile}
              disabled={saving}
              className="bg-mono-100 text-mono-950 hover:bg-mono-200 rounded-none px-6 h-10"
            >
              <Check className="size-4 mr-2" />
              {saving ? 'Speichere…' : 'Speichern'}
            </Button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              disabled={saving}
              className="text-sm text-mono-400 hover:text-mono-100 transition-colors flex items-center gap-1.5"
            >
              <X className="size-4" />
              Abbrechen
            </button>
          </div>
        </div>
      ) : (
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
          <Field icon={Mail} label="E-Mail" value={profile?.email} />
          <Field icon={User} label="Name" value={fullName !== 'Unbenannt' ? fullName : null} />
          <Field icon={Phone} label="Telefon" value={profile?.phone} />
          <Field icon={MapPin} label="Adresse" value={profile?.address} multiline />
        </dl>
      )}
    </section>
  );
};

function Field({
  icon: Icon,
  label,
  value,
  multiline,
}: {
  icon: typeof Mail;
  label: string;
  value: string | null | undefined;
  multiline?: boolean;
}) {
  return (
    <div className="group">
      <dt className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-mono-500">
        <Icon className="size-3" />
        {label}
      </dt>
      <dd
        className={cn(
          'mt-1.5 text-mono-100',
          multiline ? 'whitespace-pre-line' : 'truncate',
          !value && 'text-mono-600 italic',
        )}
      >
        {value || 'nicht angegeben'}
      </dd>
    </div>
  );
}
