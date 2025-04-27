
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/lib/store/cart";
import { Json } from "@/integrations/supabase/types";

interface CreateOrderParams {
  items: CartItem[];
  total: number;
  shippingAddress: string;
  paymentMethod: string;
}

export const createOrder = async ({ items, total, shippingAddress, paymentMethod }: CreateOrderParams) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('User must be logged in');

  // Calculate estimated delivery (7 days from now)
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

  // Convert CartItem[] to Json compatible format
  const itemsJson = JSON.parse(JSON.stringify(items)) as Json;

  const { data, error } = await supabase
    .from('orders')
    .insert({
      user_id: session.user.id,
      items: itemsJson,
      total,
      shipping_address: shippingAddress,
      payment_method: paymentMethod,
      estimated_delivery: estimatedDelivery.toISOString(),
      status: 'confirmed'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const cancelOrder = async (orderId: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('User must be logged in');

  const { data, error } = await supabase
    .from('orders')
    .update({ status: 'cancelled' })
    .eq('id', orderId)
    .eq('user_id', session.user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getOrders = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('User must be logged in');

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Safely parse items JSON
    const parsedOrders = data.map((order) => ({
      ...order,
      items: Array.isArray(order.items) ? order.items : JSON.parse(JSON.stringify(order.items))
    }));
    
    return parsedOrders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};
