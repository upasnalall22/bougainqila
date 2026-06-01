// Runs before `vite dev` and `vite build` (predev/prebuild hooks); writes public/sitemap.xml.
import { writeFileSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = "https://bougainqila.com";
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://dlggzmetemhzioddfjzs.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsZ2d6bWV0ZW1oemlvZGRmanpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MzIwMzUsImV4cCI6MjA4OTUwODAzNX0.ziRD92itg_M8rxrxg99fU20PQWte5Xv9G8rW_N9t6KY";

interface Entry {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
}

const staticEntries: Entry[] = [
  { loc: "/", priority: "1.0", changefreq: "weekly" },
  { loc: "/shop", priority: "0.9", changefreq: "weekly" },
  { loc: "/home-living", priority: "0.8", changefreq: "weekly" },
  { loc: "/gift-shop", priority: "0.8", changefreq: "weekly" },
  { loc: "/journal", priority: "0.7", changefreq: "weekly" },
  { loc: "/our-story", priority: "0.6", changefreq: "monthly" },
  { loc: "/connect", priority: "0.5", changefreq: "monthly" },
  { loc: "/refund-policy", priority: "0.3", changefreq: "yearly" },
  { loc: "/terms", priority: "0.3", changefreq: "yearly" },
  { loc: "/cookie-policy", priority: "0.3", changefreq: "yearly" },
];

async function main() {
  const entries: Entry[] = [...staticEntries];

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const [productsRes, journalsRes, categoriesRes] = await Promise.all([
      supabase.from("products").select("slug, updated_at"),
      supabase.from("journal_posts").select("slug, updated_at").eq("published", true),
      supabase.from("category_content").select("slug, updated_at"),
    ]);

    for (const p of productsRes.data ?? []) {
      if (!p.slug) continue;
      entries.push({
        loc: `/product/${p.slug}`,
        lastmod: p.updated_at ? new Date(p.updated_at).toISOString().split("T")[0] : undefined,
        priority: "0.8",
        changefreq: "weekly",
      });
    }
    for (const j of journalsRes.data ?? []) {
      if (!j.slug) continue;
      entries.push({
        loc: `/journal/${j.slug}`,
        lastmod: j.updated_at ? new Date(j.updated_at).toISOString().split("T")[0] : undefined,
        priority: "0.6",
        changefreq: "monthly",
      });
    }
    for (const c of categoriesRes.data ?? []) {
      if (!c.slug) continue;
      entries.push({
        loc: `/home-living/${c.slug}`,
        lastmod: c.updated_at ? new Date(c.updated_at).toISOString().split("T")[0] : undefined,
        priority: "0.7",
        changefreq: "monthly",
      });
    }
  } catch (err) {
    console.warn("sitemap: failed to fetch dynamic entries, writing static-only:", err);
  }

  const urls = entries
    .map((e) =>
      [
        "  <url>",
        `    <loc>${BASE_URL}${e.loc}</loc>`,
        e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
        e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
        e.priority ? `    <priority>${e.priority}</priority>` : null,
        "  </url>",
      ]
        .filter(Boolean)
        .join("\n"),
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  writeFileSync(resolve("public/sitemap.xml"), xml);
  console.log(`sitemap.xml written (${entries.length} entries)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
