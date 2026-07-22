// Supabase-backed reads for editorial content: lookbook entries and
// collections. Schema lives in 20260522000000_init_blessed_streets.sql.

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type LookbookItem = {
  id: string;
  image: string;
  title: string | null;
  tags: string[];
  order_index: number;
};

export type CollectionItem = {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
};

export function useLookbook() {
  return useQuery({
    queryKey: ["lookbook"],
    queryFn: async (): Promise<LookbookItem[]> => {
      const { data, error } = await supabase
        .from("lookbook")
        .select("id, image, title, tags, order_index")
        .order("order_index", { ascending: true });
      if (error) throw error;
      return (data ?? []).map((row) => ({
        id: row.id,
        image: row.image,
        title: row.title,
        tags: row.tags ?? [],
        order_index: row.order_index ?? 0,
      }));
    },
  });
}

export function useCollections() {
  return useQuery({
    queryKey: ["collections"],
    queryFn: async (): Promise<CollectionItem[]> => {
      const { data, error } = await supabase
        .from("collections")
        .select("id, name, description, image")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}
