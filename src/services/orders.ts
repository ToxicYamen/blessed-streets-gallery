
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/types/order";
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

  // Convert items to a format suitable for the database
  const jsonItems: Json = items as unknown as Json;

  const { data, error } = await supabase
    .from('orders')
    .insert({
      user_id: session.user.id,
      items: jsonItems,
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

// Get orders for the current user
export const getUserOrders = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('User must be logged in');

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};
