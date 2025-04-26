
import { Json } from "@/integrations/supabase/types";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

export interface Order {
  id: string;
  total: number;
  status: string;
  created_at: string;
  items: CartItem[];
  shipping_address: string;
  payment_method: string;
  estimated_delivery: string;
}

// Helper function to convert JSON from database to strongly typed CartItem array
export const parseOrderItems = (items: Json): CartItem[] => {
  if (!items) return [];
  
  if (typeof items === 'string') {
    try {
      return JSON.parse(items) as CartItem[];
    } catch (e) {
      console.error('Error parsing order items:', e);
      return [];
    }
  }
  
  return items as unknown as CartItem[];
};
