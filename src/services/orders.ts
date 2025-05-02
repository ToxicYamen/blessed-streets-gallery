
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/lib/store/cart";
import { Json } from "@/integrations/supabase/types";
import { products as localProducts, getProductById } from "@/data/products";

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
  const itemsJson = items as unknown as Json;

  // Get the color from the first item (assuming all items have the same color in an order)
  // This is just an additional reference for the order
  const orderColor = items.length > 0 && items[0].color ? items[0].color : null;

  // Create the order
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: session.user.id,
      items: itemsJson,
      total,
      shipping_address: shippingAddress,
      payment_method: paymentMethod,
      estimated_delivery: estimatedDelivery.toISOString(),
      status: 'confirmed',
      color: orderColor // Store the color in the order
    })
    .select()
    .single();

  if (orderError) throw orderError;

  // Update product inventory in the database for each item
  for (const item of items) {
    // First try to get the product from Supabase
    const { data: supabaseProduct } = await supabase
      .from('products')
      .select('*')
      .eq('id', item.id)
      .single();

    if (supabaseProduct) {
      // Handle Supabase product inventory update
      const currentQuantities = supabaseProduct.size_quantities || {};
      const newQuantities = { ...currentQuantities };
      
      if (newQuantities[item.size]) {
        newQuantities[item.size] = Math.max(0, newQuantities[item.size] - item.quantity);
      }
      
      await supabase
        .from('products')
        .update({ size_quantities: newQuantities })
        .eq('id', item.id);
    } else {
      // Handle local product inventory update
      const localProduct = getProductById(item.id);
      if (localProduct && localProduct.inventory) {
        const sizeInventory = localProduct.inventory.find(inv => inv.size === item.size);
        if (sizeInventory) {
          sizeInventory.quantity = Math.max(0, sizeInventory.quantity - item.quantity);
        }
      }
    }
  }

  return orderData;
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
