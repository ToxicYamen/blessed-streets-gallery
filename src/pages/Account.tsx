import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { PageHeader } from '@/components/ui/PageHeader';

interface Profile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  address: string | null;
}

interface Order {
  id: string;
  total: number;
  status: string;
  created_at: string;
  items: CartItem[];
  shipping_address: string;
  payment_method: string;
  estimated_delivery: string;
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
      setProfile(data);
      setFormData({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        phone: data.phone || '',
        address: data.address || '',
      });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

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
      fetchProfile();
    } catch (error: any) {
      toast.error(error.message);
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
                            {new Date(order.created_at).toLocaleDateString()}
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
