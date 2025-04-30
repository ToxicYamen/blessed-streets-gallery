
import { OrderItem } from './OrderItem';
import { Skeleton } from '@/components/ui/skeleton';
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
  orders: Order[];
  isLoading: boolean;
  onOrderUpdated: () => void;
}

export const OrdersList = ({ orders, isLoading, onOrderUpdated }: OrdersListProps) => {
  return (
    <div className="bg-accent/5 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Order History</h3>
      
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderItem 
              key={order.id} 
              order={order} 
              onOrderUpdated={onOrderUpdated} 
            />
          ))}
        </div>
      )}
    </div>
  );
};
