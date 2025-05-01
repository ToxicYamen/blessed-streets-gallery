
import { Button } from '@/components/ui/button';
import { CartItem } from '@/lib/store/cart';
import { useState } from 'react';

interface OrderProps {
  order: {
    id: string;
    total: number;
    status: string;
    created_at: string;
    items: CartItem[];
    shipping_address: string;
    payment_method: string;
    estimated_delivery: string;
  };
  onCancelOrder: (orderId: string) => Promise<void>;
}

export const OrderItem = ({ order, onCancelOrder }: OrderProps) => {
  const [cancelingOrderId, setCancelingOrderId] = useState<string | null>(null);

  const handleCancel = async () => {
    setCancelingOrderId(order.id);
    try {
      await onCancelOrder(order.id);
    } finally {
      setCancelingOrderId(null);
    }
  };

  return (
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
          <p className={`text-sm capitalize ${
            order.status === 'cancelled' 
              ? 'text-red-500' 
              : order.status === 'confirmed' 
              ? 'text-green-500' 
              : 'text-muted-foreground'
          }`}>
            {order.status}
          </p>
        </div>
      </div>
      <div className="space-y-2">
        {(order.items || []).map((item: CartItem) => (
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
      
      {order.status === 'confirmed' && (
        <div className="mt-4">
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleCancel}
            disabled={cancelingOrderId === order.id}
          >
            {cancelingOrderId === order.id ? 'Cancelling...' : 'Cancel Order'}
          </Button>
        </div>
      )}
    </div>
  );
};
