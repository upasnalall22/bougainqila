import { Link } from "react-router-dom";
import { useAllCategoryContent } from "@/hooks/useCMS";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  };

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.7;
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  };

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

      {/* Desktop: 4-column full-width grid */}
      <div className="hidden md:grid grid-cols-4 gap-1 px-2">
        {displayCategories.slice(0, 4).map((cat) => (
          <Link
            key={cat.name}
            to={cat.to}
            className="group relative aspect-[3/4] overflow-hidden"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-foreground/25 group-hover:bg-foreground/40 transition-colors" />
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center">
              <h3
                className="text-lg lg:text-xl font-medium text-background mb-1"
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

      {/* Mobile: horizontal scroll with navigation cues */}
      <div className="md:hidden relative">
        {/* Scroll arrows */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-20 bg-background/80 backdrop-blur-sm rounded-full p-1.5 shadow-md text-foreground/70 hover:text-foreground transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-20 bg-background/80 backdrop-blur-sm rounded-full p-1.5 shadow-md text-foreground/70 hover:text-foreground transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory px-4 pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
        >
          {displayCategories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.to}
              className="group relative flex-shrink-0 w-[70vw] sm:w-[45vw] aspect-[3/4] rounded-sm overflow-hidden snap-start"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-foreground/25 group-hover:bg-foreground/35 transition-colors" />
              <div className="relative z-10 h-full flex flex-col items-center justify-center text-center">
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

        {/* Scroll indicator dots */}
        <div className="flex justify-center gap-1.5 mt-2">
          {displayCategories.map((cat, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-foreground/20"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
