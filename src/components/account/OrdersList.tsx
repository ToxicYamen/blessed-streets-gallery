import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

import { supabase } from '@/integrations/supabase/client';
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
  tracking_number?: string | null;
  shipping_carrier?: 'dhl' | 'ups' | 'dpd' | 'gls' | 'hermes' | null;
  shipped_at?: string | null;
}

interface OrdersListProps {
  userId: string | undefined;
  onStats?: (stats: { count: number; total: number }) => void;
}

export const OrdersList = ({ userId, onStats }: OrdersListProps) => {
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

        const parsedOrders: Order[] = (data ?? []).map((order: any) => ({
          ...order,
          items: Array.isArray(order.items) ? order.items : [],
        }));

        setOrders(parsedOrders);
      } catch (error: any) {
        toast.error(`Bestellungen konnten nicht geladen werden: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  // Lift order stats up to the page shell (sidebar summary card).
  useEffect(() => {
    if (loading) return;
    const count = orders.length;
    const total = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + Number(o.total ?? 0), 0);
    onStats?.({ count, total });
  }, [orders, loading, onStats]);

  const handleCancelOrder = async (orderId: string) => {
    try {
      await cancelOrder(orderId);
      toast.success('Bestellung storniert');
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: 'cancelled' } : order,
        ),
      );
    } catch (error: any) {
      toast.error(`Stornierung fehlgeschlagen: ${error.message}`);
    }
  };

  const heading = useMemo(
    () => (
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-mono-500">
            Section II
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-mono-100 mt-1.5 leading-tight">
            Bestellverlauf
          </h2>
        </div>
        {!loading && orders.length > 0 && (
          <p className="font-mono text-xs text-mono-500">
            {orders.length} {orders.length === 1 ? 'Bestellung' : 'Bestellungen'}
          </p>
        )}
      </div>
    ),
    [orders.length, loading],
  );

  if (loading) {
    return (
      <div>
        {heading}
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="border border-mono-100/10 p-6 md:p-8 space-y-6">
              <div className="flex justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-40" />
                </div>
                <Skeleton className="h-10 w-24" />
              </div>
              <Skeleton className="h-2 w-full" />
              <div className="flex items-center gap-4">
                <Skeleton className="size-14" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div>
        {heading}
        <div className="border border-mono-100/10 p-12 md:p-16 text-center">
          <div className="mx-auto size-14 grid place-items-center border border-mono-100/20 mb-6">
            <Package className="size-6 text-mono-400" />
          </div>
          <p className="font-display text-2xl text-mono-100 mb-3">
            Noch keine Bestellungen
          </p>
          <p className="text-mono-400 text-sm max-w-sm mx-auto mb-8">
            Sobald du etwas bestellst, findest du hier alles — von der Bestätigung
            bis zur Zustellung.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-mono-100 text-mono-950 hover:bg-mono-200 px-6 h-11 transition-colors text-sm uppercase tracking-wider"
          >
            <ShoppingBag className="size-4" />
            Zum Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {heading}
      <div className="space-y-6">
        {orders.map((order) => (
          <OrderItem key={order.id} order={order} onCancelOrder={handleCancelOrder} />
        ))}
      </div>
    </div>
  );
};
