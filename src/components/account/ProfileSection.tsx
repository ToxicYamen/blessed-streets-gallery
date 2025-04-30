
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

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
  isLoading: boolean;
  onProfileUpdated: () => void;
}

export const ProfileSection = ({ profile, isLoading, onProfileUpdated }: ProfileSectionProps) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
  });

  // Update form data when profile changes
  useState(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
      });
    }
  });

  const handleUpdateProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', session.user.id);

      if (error) throw error;
      
      toast.success('Profile updated successfully');
      setEditing(false);
      onProfileUpdated();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="bg-accent/5 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
      
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : editing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="First Name"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            />
            <Input
              placeholder="Last Name"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            />
          </div>
          <Input
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <Input
            placeholder="Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
          <div className="flex gap-2">
            <Button onClick={handleUpdateProfile}>Save Changes</Button>
            <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p><strong>Email:</strong> {profile?.email}</p>
          <p><strong>Name:</strong> {profile?.first_name} {profile?.last_name}</p>
          <p><strong>Phone:</strong> {profile?.phone || 'Not set'}</p>
          <p><strong>Address:</strong> {profile?.address || 'Not set'}</p>
          <Button onClick={() => setEditing(true)}>Edit Profile</Button>
        </div>
      )}
    </div>
  );
};
