import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useHomepageContent(section: string) {
  return useQuery({
    queryKey: ["homepage-content", section],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("homepage_content")
        .select("*")
        .eq("section", section)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useAllHomepageContent() {
  return useQuery({
    queryKey: ["homepage-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("homepage_content")
        .select("*");
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCategoryContent(slug?: string) {
  return useQuery({
    queryKey: ["category-content", slug],
    queryFn: async () => {
      if (slug) {
        const { data, error } = await supabase
          .from("category_content")
          .select("*")
          .eq("slug", slug)
          .maybeSingle();
        if (error) throw error;
        return data;
      }
      return null;
    },
    enabled: !!slug,
  });
}

export function useAllCategoryContent() {
  return useQuery({
    queryKey: ["all-category-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("category_content")
        .select("*")
        .order("name");
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useJournalPosts(publishedOnly = true) {
  return useQuery({
    queryKey: ["journal-posts", publishedOnly],
    queryFn: async () => {
      let query = supabase
        .from("journal_posts")
        .select("*")
        .order("published_at", { ascending: false, nullsFirst: false });
      if (publishedOnly) {
        query = query.eq("published", true);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useJournalPost(slug: string) {
  return useQuery({
    queryKey: ["journal-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("journal_posts")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
}
