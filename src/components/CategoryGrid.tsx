import { Link } from "react-router-dom";
import { useAllCategoryContent } from "@/hooks/useCMS";
import { useRef, useEffect } from "react";
import catWindchimes from "@/assets/cat-windchimes.jpg";
import catContainers from "@/assets/cat-containers.jpg";

const fallbackImages: Record<string, string> = {
  windchimes: catWindchimes,
  containers: catContainers,
};

const categoryRoutes: Record<string, string> = {
  windchimes: "/home-living/windchimes",
  containers: "/home-living/containers",
};

const CategoryGrid = () => {
  const { data: categories } = useAllCategoryContent();
  const scrollRef = useRef<HTMLDivElement>(null);

  const displayCategories =
    categories && categories.length > 0
      ? categories
          .filter((c: any) => categoryRoutes[c.slug])
          .map((c: any) => ({
            name: c.name,
            image: c.banner_image_url || fallbackImages[c.slug] || "/placeholder.svg",
            to: categoryRoutes[c.slug] || "/shop",
          }))
      : [
          { name: "Clay Windchimes", image: catWindchimes, to: "/home-living/windchimes" },
          { name: "Mix Bag", image: catContainers, to: "/home-living/containers" },
        ];

  return (
    <section className="py-16">
      {/* Header */}
      <div className="text-center mb-8 px-4">
        <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">Collections</p>
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-light text-foreground"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Where slow things live.
        </h2>
      </div>

      {/* Edge-to-edge 2-up grid, responsive across all devices */}
      <div ref={scrollRef} className="grid grid-cols-2 gap-0 w-full">
        {displayCategories.map((cat) => (
          <Link
            key={cat.name}
            to={cat.to}
            className="group relative aspect-[3/4] sm:aspect-[4/5] md:aspect-[16/10] overflow-hidden"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-foreground/55 to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
              <h3
                className="text-sm sm:text-base font-medium text-foreground whitespace-nowrap tracking-[0.15em] uppercase bg-background/90 backdrop-blur-sm px-4 py-2 rounded-md shadow-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {cat.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
