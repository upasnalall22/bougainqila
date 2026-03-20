import { Link } from "react-router-dom";
import { useAllCategoryContent } from "@/hooks/useCMS";
import catWindchimes from "@/assets/cat-windchimes.jpg";
import catLettering from "@/assets/cat-lettering.jpg";
import catContainers from "@/assets/cat-containers.jpg";
import catHair from "@/assets/cat-hair.jpg";

// Fallback images for categories that don't have a CMS image yet
const fallbackImages: Record<string, string> = {
  windchimes: catWindchimes,
  letterings: catLettering,
  containers: catContainers,
  "hair-accents": catHair,
};

const categoryRoutes: Record<string, string> = {
  windchimes: "/home-living/windchimes",
  letterings: "/home-living/letterings",
  containers: "/home-living/containers",
  "hair-accents": "/home-living/hair-accents",
};

const CategoryGrid = () => {
  const { data: categories } = useAllCategoryContent();

  // Use CMS categories if available, otherwise show default two
  const displayCategories =
    categories && categories.length > 0
      ? categories
          .filter((c: any) => categoryRoutes[c.slug]) // only show categories with known routes
          .map((c: any) => ({
            name: c.name,
            image: c.banner_image_url || fallbackImages[c.slug] || "/placeholder.svg",
            to: categoryRoutes[c.slug] || "/shop",
          }))
      : [
          { name: "Clay Windchimes", image: catWindchimes, to: "/home-living/windchimes" },
          { name: "Clay Lettering", image: catLettering, to: "/home-living/letterings" },
        ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-3">Collections</p>
        <h2
          className="text-3xl md:text-4xl font-light text-foreground"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Made by hand, meant to last
        </h2>
      </div>

      <div className={`grid grid-cols-2 ${displayCategories.length > 2 ? "md:grid-cols-4" : "md:grid-cols-2"} gap-4`}>
        {displayCategories.map((cat) => (
          <Link
            key={cat.name}
            to={cat.to}
            className="group relative rounded-sm overflow-hidden aspect-square"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-foreground/25 group-hover:bg-foreground/35 transition-colors" />
            <div className="relative z-10 h-full flex flex-col items-center justify-end pb-6 text-center">
              <h3
                className="text-lg font-medium text-background mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {cat.name}
              </h3>
              <span className="text-xs tracking-widest uppercase text-background/80 group-hover:text-background transition-colors">
                Explore →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
