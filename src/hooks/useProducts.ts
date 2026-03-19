import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Product = Tables<"products"> & {
  product_images: Tables<"product_images">[];
};

export function useProducts(category?: string) {
  return useQuery({
    queryKey: ["products", category],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("*, product_images(*)")
        .order("created_at", { ascending: false });

      if (category) {
        query = query.eq("category", category);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data as Product[]) ?? [];
    },
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, product_images(*)")
        .eq("slug", slug)
        .single();

      if (error) throw error;
      return data as Product;
    },
    enabled: !!slug,
  });
}

export function useRelatedProducts(category: string, excludeId: string) {
  return useQuery({
    queryKey: ["related-products", category, excludeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, product_images(*)")
        .eq("category", category)
        .neq("id", excludeId)
        .limit(4);

      if (error) throw error;
      return (data as Product[]) ?? [];
    },
    enabled: !!category && !!excludeId,
  });
}
