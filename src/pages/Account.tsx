
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { PageHeader } from '@/components/ui/PageHeader';
import { getUserOrders } from '@/services/orders';
import { Order, parseOrderItems, CartItem } from '@/types/order';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Update Profile interface to include avatar_url
interface Profile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  address: string | null;
  avatar_url: string | null;
  created_at: string | null;
  updated_at: string | null;
}

const Account = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    checkUser();
    fetchProfile();
    fetchOrders();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth/login');
    }
  };

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      
      // Ensure all properties are set, including avatar_url
      setProfile({
        ...data,
        avatar_url: data.avatar_url || null,
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        phone: data.phone || '',
        address: data.address || '',
      });

      setFormData({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        phone: data.phone || '',
        address: data.address || '',
      });
      setAvatarUrl(data.avatar_url);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      // Prepare updates, explicitly including avatar_url if needed
      const updates: Partial<Profile> = { 
        ...formData,
        avatar_url: avatarUrl 
      };
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', session.user.id);

      if (error) throw error;
      
      // Then upload avatar if selected
      if (avatarFile) {
        await uploadAvatar(session.user.id, avatarFile);
      }
      
      toast.success('Profile updated successfully');
      setEditing(false);
      fetchProfile();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const uploadAvatar = async (userId: string, file: File) => {
    try {
      setUploadingAvatar(true);
      
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/avatar.${fileExt}`;
      
      // Check if bucket exists, if not create it
      const { data: bucketData } = await supabase.storage.getBucket('avatars');
      if (!bucketData) {
        await supabase.storage.createBucket('avatars', {
          public: true,
          fileSizeLimit: 1024 * 1024 * 2 // 2MB
        });
      }
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      // Update profile with avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', userId);
      
      if (updateError) throw updateError;
      
      setAvatarUrl(data.publicUrl);
      
    } catch (error: any) {
      toast.error(`Error uploading avatar: ${error.message}`);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setAvatarFile(file);
      
      // Show preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      navigate('/');
    }
  };
  
  const viewOrderReceipt = (order: Order) => {
    // Open a modal with receipt details
    // For now we'll just show a toast
    toast(`Receipt for order #${order.id.slice(0, 8)}`, {
      description: `Total: ${order.total.toFixed(2)} €, Items: ${order.items.length}, Date: ${new Date(order.created_at).toLocaleDateString()}`
    });
  };
  
  const trackOrder = (order: Order) => {
    // For now show tracking info in a toast
    toast(`Tracking order #${order.id.slice(0, 8)}`, {
      description: `Status: ${order.status}, Estimated delivery: ${new Date(order.estimated_delivery).toLocaleDateString()}`
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div>
      <PageHeader
        title="Account"
        description="Manage your account settings and view your orders"
      />
      
      <div className="blesssed-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-[1fr,400px] gap-8">
          {/* Profile Section */}
          <div className="space-y-6">
            <div className="bg-accent/5 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
              {editing ? (
                <div className="space-y-4">
                  <div className="flex flex-col items-center mb-6">
                    <Avatar className="w-24 h-24 mb-4">
                      <AvatarImage src={avatarUrl || ''} alt="Profile" />
                      <AvatarFallback>
                        {profile?.first_name?.charAt(0)}{profile?.last_name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <Input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleAvatarChange}
                      className="w-full max-w-xs"
                    />
                  </div>
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
                    <Button onClick={handleUpdateProfile} disabled={uploadingAvatar}>
                      {uploadingAvatar ? 'Uploading...' : 'Save Changes'}
                    </Button>
                    <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={profile?.avatar_url || ''} alt="Profile" />
                      <AvatarFallback>
                        {profile?.first_name?.charAt(0)}{profile?.last_name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p><strong>Email:</strong> {profile?.email}</p>
                      <p><strong>Name:</strong> {profile?.first_name} {profile?.last_name}</p>
                      <p><strong>Phone:</strong> {profile?.phone || 'Not set'}</p>
                      <p><strong>Address:</strong> {profile?.address || 'Not set'}</p>
                    </div>
                  </div>
                  <Button onClick={() => setEditing(true)}>Edit Profile</Button>
                </div>
              )}
            </div>

            {/* Orders Section */}
            <div className="bg-accent/5 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Order History</h3>
              {orders.length === 0 ? (
                <p>No orders yet</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between mb-4">
                        <div>
                          <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{order.total.toFixed(2)} €</p>
                          <p className="text-sm capitalize text-muted-foreground">
                            {order.status}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {order.items.map((item: CartItem) => (
                          <div key={`${item.id}-${item.size}`} className="flex items-center gap-4">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Size: {item.size} | Quantity: {item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 text-sm text-muted-foreground">
                        <p><strong>Shipping Address:</strong> {order.shipping_address}</p>
                        <p><strong>Payment Method:</strong> {order.payment_method}</p>
                        <p><strong>Estimated Delivery:</strong> {new Date(order.estimated_delivery).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" onClick={() => trackOrder(order)}>Track</Button>
                        <Button size="sm" variant="outline" onClick={() => viewOrderReceipt(order)}>Receipt</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-accent/5 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Account Actions</h3>
              <div className="space-y-2">
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleLogout}
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
