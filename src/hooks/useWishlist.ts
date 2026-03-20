import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

function getSessionId(): string {
  let id = localStorage.getItem("cart_session_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("cart_session_id", id);
  }
  return id;
}

export function useWishlist() {
  const [wishlistedIds, setWishlistedIds] = useState<Set<string>>(new Set());
  const sessionId = getSessionId();

  const fetchWishlist = useCallback(async () => {
    const { data } = await supabase
      .from("wishlists" as any)
      .select("product_id")
      .eq("session_id", sessionId);
    if (data) {
      setWishlistedIds(new Set((data as any[]).map((d: any) => d.product_id)));
    }
  }, [sessionId]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleWishlist = useCallback(async (productId: string) => {
    if (wishlistedIds.has(productId)) {
      setWishlistedIds((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
      await supabase
        .from("wishlists" as any)
        .delete()
        .eq("session_id", sessionId)
        .eq("product_id", productId);
    } else {
      setWishlistedIds((prev) => new Set(prev).add(productId));
      await supabase
        .from("wishlists" as any)
        .insert({ session_id: sessionId, product_id: productId } as any);
    }
  }, [wishlistedIds, sessionId]);

  const isWishlisted = useCallback((productId: string) => wishlistedIds.has(productId), [wishlistedIds]);

  return { toggleWishlist, isWishlisted, wishlistedIds };
}
