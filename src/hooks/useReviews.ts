import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProductReview {
  id: string;
  product_id: string;
  reviewer_name: string;
  rating: number;
  review_text: string | null;
  created_at: string;
}

export function useProductReviews(productId: string) {
  return useQuery({
    queryKey: ["product-reviews", productId],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("product_reviews")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as ProductReview[];
    },
    enabled: !!productId,
  });
}

export function useSubmitReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (review: { product_id: string; reviewer_name: string; rating: number; review_text: string }) => {
      const { error } = await (supabase as any)
        .from("product_reviews")
        .insert(review);
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product-reviews", variables.product_id] });
    },
  });
}
