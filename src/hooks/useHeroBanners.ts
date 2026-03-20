import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useHeroBanners() {
  return useQuery({
    queryKey: ["hero-banners"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hero_banners" as any)
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data as any[];
    },
  });
}

export function useActiveHeroBanners() {
  return useQuery({
    queryKey: ["hero-banners-active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hero_banners" as any)
        .select("*")
        .eq("is_active", true)
        .order("display_order");
      if (error) throw error;
      // Only return banners that have both image and title
      return (data as any[]).filter((b: any) => b.image_url && b.title);
    },
  });
}
