
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PageHeader } from '@/components/ui/PageHeader';
import { CartItem } from '@/lib/store/cart';
import { useAuth } from '@/hooks/useAuth';
import { ProfileSection } from '@/components/account/ProfileSection';
import { OrdersList } from '@/components/account/OrdersList';
import { AccountSidebar } from '@/components/account/AccountSidebar';
import { Loader } from 'lucide-react';

interface Profile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  address: string | null;
  avatar_url: string | null;
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
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const [profileLoading, setProfileLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchProfile();
      fetchOrders();
    }
  }, [authLoading, isAuthenticated]);

  const fetchProfile = async () => {
    try {
      setProfileLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setProfileLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
      
      setProfile(data);
    } catch (error: any) {
      toast.error(`Error loading profile: ${error.message}`);
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setOrdersLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }
      
      // Ensure items are properly parsed
      const parsedOrders = data.map((order: any) => ({
        ...order,
        items: Array.isArray(order.items) ? order.items : []
      }));
      
      setOrders(parsedOrders);
    } catch (error: any) {
      toast.error(`Error loading orders: ${error.message}`);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Show loading state for initial authentication check
  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader className="h-8 w-8 animate-spin text-primary" />
          <span>Checking authentication...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Account"
        description="Manage your account settings and view your orders"
      />
      
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-[1fr,400px] gap-8">
          {/* Main Content */}
          <div className="space-y-6">
            <ProfileSection 
              profile={profile} 
              isLoading={profileLoading} 
              onProfileUpdated={fetchProfile} 
            />

            <OrdersList 
              orders={orders} 
              isLoading={ordersLoading} 
              onOrderUpdated={fetchOrders} 
            />
          </div>

          {/* Sidebar */}
          <div>
            <AccountSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
