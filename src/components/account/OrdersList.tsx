
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { OrderItem } from './OrderItem';
import { Skeleton } from '@/components/ui/skeleton';
import { cancelOrder } from '@/services/orders';
import { CartItem } from '@/lib/store/cart';

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

interface OrdersListProps {
  userId: string | undefined;
}

export const OrdersList = ({ userId }: OrdersListProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Ensure items are properly parsed
        const parsedOrders = data.map((order: any) => ({
          ...order,
          items: Array.isArray(order.items) ? order.items : []
        }));
        
        setOrders(parsedOrders);
      } catch (error: any) {
        toast.error(`Error loading orders: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const handleCancelOrder = async (orderId: string) => {
    try {
      await cancelOrder(orderId);
      
      toast.success('Order cancelled successfully');
      
      // Update the orders list
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: 'cancelled' } 
          : order
      ));
    } catch (error: any) {
      toast.error(`Failed to cancel order: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="bg-accent/5 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Order History</h3>
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex justify-between mb-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-20" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-16 h-16" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-56" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-accent/5 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Order History</h3>
      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderItem 
              key={order.id} 
              order={order} 
              onCancelOrder={handleCancelOrder} 
            />
          ))}
        </div>
      )}
    </div>
  );
};
