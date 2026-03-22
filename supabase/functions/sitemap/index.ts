import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Content-Type": "application/xml",
  "Cache-Control": "public, max-age=3600",
};

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!
  );

  const baseUrl = "https://bougainqila.com";

  // Fetch all products, journal posts, and categories in parallel
  const [productsRes, journalRes, categoriesRes] = await Promise.all([
    supabase.from("products").select("slug, updated_at"),
    supabase.from("journal_posts").select("slug, updated_at").eq("published", true),
    supabase.from("category_content").select("slug, updated_at"),
  ]);

  const products = productsRes.data ?? [];
  const journals = journalRes.data ?? [];
  const categories = categoriesRes.data ?? [];

  const staticPages = [
    { loc: "/", priority: "1.0" },
    { loc: "/shop", priority: "0.9" },
    { loc: "/home-living", priority: "0.8" },
    { loc: "/gift-shop", priority: "0.8" },
    { loc: "/journal", priority: "0.7" },
    { loc: "/our-story", priority: "0.6" },
    { loc: "/connect", priority: "0.5" },
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  for (const page of staticPages) {
    xml += `
  <url>
    <loc>${baseUrl}${page.loc}</loc>
    <priority>${page.priority}</priority>
    <changefreq>weekly</changefreq>
  </url>`;
  }

  for (const p of products) {
    xml += `
  <url>
    <loc>${baseUrl}/product/${p.slug}</loc>
    <lastmod>${new Date(p.updated_at).toISOString().split("T")[0]}</lastmod>
    <priority>0.8</priority>
    <changefreq>weekly</changefreq>
  </url>`;
  }

  for (const j of journals) {
    xml += `
  <url>
    <loc>${baseUrl}/journal/${j.slug}</loc>
    <lastmod>${new Date(j.updated_at).toISOString().split("T")[0]}</lastmod>
    <priority>0.6</priority>
    <changefreq>monthly</changefreq>
  </url>`;
  }

  for (const c of categories) {
    xml += `
  <url>
    <loc>${baseUrl}/home-living/${c.slug}</loc>
    <lastmod>${new Date(c.updated_at).toISOString().split("T")[0]}</lastmod>
    <priority>0.7</priority>
    <changefreq>monthly</changefreq>
  </url>`;
  }

  xml += `
</urlset>`;

  return new Response(xml, { headers: corsHeaders });
});
