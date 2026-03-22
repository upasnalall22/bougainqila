import { Link } from "react-router-dom";
import { useAllCategoryContent } from "@/hooks/useCMS";
import { useRef, useEffect } from "react";
import catWindchimes from "@/assets/cat-windchimes.jpg";
import catLettering from "@/assets/cat-lettering.jpg";
import catContainers from "@/assets/cat-containers.jpg";
import catHair from "@/assets/cat-hair.jpg";

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
          { name: "Clay Lettering", image: catLettering, to: "/home-living/letterings" },
          { name: "Clay Containers", image: catContainers, to: "/home-living/containers" },
          { name: "Hair Accents", image: catHair, to: "/home-living/hair-accents" },
        ];

  // Auto-scroll carousel with 3-second interval
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const interval = setInterval(() => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) return;

      if (el.scrollLeft >= maxScroll - 2) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        const cardWidth = el.querySelector("a")?.clientWidth ?? 280;
        el.scrollBy({ left: cardWidth + 12, behavior: "smooth" });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [displayCategories]);

  return (
    <section className="py-16">
      {/* Header */}
      <div className="text-center mb-8 px-4">
        <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">Collections</p>
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-light text-foreground"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Made by hand, meant to last
        </h2>
      </div>

      {/* Single-line auto-scrolling carousel for all screen sizes */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory px-4 pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
      >
        {displayCategories.map((cat) => (
          <Link
            key={cat.name}
            to={cat.to}
            className="group relative flex-shrink-0 w-[70vw] sm:w-[45vw] md:w-[30vw] lg:w-[23vw] aspect-[3/4] rounded-sm overflow-hidden snap-start"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
              <h3
                className="text-sm sm:text-base font-medium text-foreground whitespace-nowrap tracking-[0.15em] uppercase bg-background/80 px-4 py-2 rounded-md group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
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
