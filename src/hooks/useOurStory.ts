import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useOurStorySections() {
  return useQuery({
    queryKey: ["our-story-sections"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("our_story_sections")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

export function useOurStorySection(sectionKey: string) {
  return useQuery({
    queryKey: ["our-story-sections", sectionKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("our_story_sections")
        .select("*")
        .eq("section_key", sectionKey)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}
