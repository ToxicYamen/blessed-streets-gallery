import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import type { Product, ProductColor, ProductSize } from "@/types/product";

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  price: number | string;
  description: string | null;
  color: string | null;
  images: string[] | null;
  size: string[] | null;
  size_quantities: Record<string, number> | unknown;
  stock: number | null;
  is_featured: boolean | null;
  is_new: boolean | null;
};

function mapRow(row: ProductRow): Product {
  const size = ((row.size ?? []) as string[]).filter(Boolean) as ProductSize[];
  const sq = (row.size_quantities ?? {}) as Record<string, number>;
  const inventory = size.map((s) => ({ size: s, quantity: Number(sq[s] ?? 0) }));
  const color = (row.color ?? "black") as ProductColor;
  return {
    id: row.slug, // route by slug → /product/{slug}
    name: row.name,
    price: Number(row.price),
    description: row.description ?? "",
    color,
    images: row.images ?? [],
    sizes: size,
    inventory,
    featured: !!row.is_featured,
    isNew: !!row.is_new,
    // mirror fields for ProductGrid & callers expecting the DB shape
    size,
    size_quantities: sq,
    is_featured: !!row.is_featured,
    is_new: !!row.is_new,
  };
}

export function useProducts() {
  return useQuery({
    queryKey: ["shop-products"],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("id,name,slug,price,description,color,images,size,size_quantities,stock,is_featured,is_new")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []).map((row) => mapRow(row as unknown as ProductRow));
    },
  });
}

export function useFeaturedProducts() {
  const q = useProducts();
  return { ...q, data: q.data?.filter((p) => p.featured) ?? [] };
}

export function useNewArrivals() {
  const q = useProducts();
  return { ...q, data: q.data?.filter((p) => p.isNew) ?? [] };
}

export function useProductBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["shop-product", slug],
    enabled: !!slug,
    queryFn: async (): Promise<Product | null> => {
      const { data, error } = await supabase
        .from("products")
        .select("id,name,slug,price,description,color,images,size,size_quantities,stock,is_featured,is_new")
        .eq("slug", slug!)
        .maybeSingle();
      if (error) throw error;
      return data ? mapRow(data as unknown as ProductRow) : null;
    },
  });
}

export function useRelatedProducts(currentSlug: string | undefined, limit = 4) {
  const q = useProducts();
  const data = (q.data ?? []).filter((p) => p.id !== currentSlug).slice(0, limit);
  return { ...q, data };
}
