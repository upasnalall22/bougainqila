import { Link } from "react-router-dom";
import { useAllCategoryContent } from "@/hooks/useCMS";
import { useEffect, useRef, useState } from "react";
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
  const [isPaused, setIsPaused] = useState(false);

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

  // Auto-scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || displayCategories.length <= 2) return;

    const interval = setInterval(() => {
      if (isPaused) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 2) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 200, behavior: "smooth" });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused, displayCategories.length]);

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">Collections</p>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-light text-foreground"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Made by hand, meant to last
          </h2>
        </div>

        <div
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {displayCategories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.to}
              className="group relative flex-shrink-0 w-[45vw] sm:w-[30vw] md:w-[22vw] lg:w-[18vw] aspect-[3/4] rounded-sm overflow-hidden snap-start"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-foreground/25 group-hover:bg-foreground/35 transition-colors" />
              <div className="relative z-10 h-full flex flex-col items-center justify-end pb-4 sm:pb-6 text-center">
                <h3
                  className="text-sm sm:text-lg font-medium text-background mb-1"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {cat.name}
                </h3>
                <span className="text-[10px] sm:text-xs tracking-widest uppercase text-background/80 group-hover:text-background transition-colors">
                  Explore →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
