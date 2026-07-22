// Canonical Product shape used across the shop.
// (Previously lived in src/data/products.ts alongside a mock product map; the
//  mock data has been removed since everything now flows through Supabase via
//  src/hooks/use-products.ts. Only the types survive.)

export type ProductColor = 'black' | 'khaki';
export type ProductSize = 'M' | 'L' | 'XL';

export interface ProductInventory {
  size: ProductSize;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  color: ProductColor;
  images: string[];
  sizes: ProductSize[];
  inventory: ProductInventory[];
  featured?: boolean;
  isNew?: boolean;
  isSale?: boolean;
  salePrice?: number;
  // Mirror fields so DB-style consumers (ProductGrid, etc.) work without a
  // separate adapter layer.
  size?: string[];
  size_quantities?: Record<string, number>;
  is_featured?: boolean;
  is_new?: boolean;
}

export type ProductCollection = {
  [key: string]: Product;
};
