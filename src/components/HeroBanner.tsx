import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useActiveHeroBanners } from "@/hooks/useHeroBanners";
import heroBanner from "@/assets/hero-banner.jpg";
import { useHomepageContent } from "@/hooks/useCMS";

const HeroBanner = () => {
  const { data: banners, isLoading } = useActiveHeroBanners();
  const { data: fallbackContent } = useHomepageContent("hero");
  const [current, setCurrent] = useState(0);

  const slides = banners && banners.length > 0
    ? banners
    : fallbackContent
      ? [{
          title: fallbackContent.title || "There is beauty in the broken\nand magic in the slow.",
          description: fallbackContent.description || "Handmade home decor born from a terrace garden. Each piece carries the warmth of slow craft and an organic spirit.",
          button_text: fallbackContent.button_text || "Shop Now",
          button_link: fallbackContent.button_link || "/shop",
          image_url: fallbackContent.image_url || heroBanner,
        }]
      : [{
          title: "There is beauty in the broken\nand magic in the slow.",
          description: "Handmade home decor born from a terrace garden. Each piece carries the warmth of slow craft and an organic spirit.",
          button_text: "Shop Now",
          button_link: "/shop",
          image_url: heroBanner,
        }];

  const goTo = useCallback((idx: number) => setCurrent(idx), []);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[current];

  return (
    <section className="relative w-full h-[50vh] md:h-[70vh] min-h-[400px] overflow-hidden flex items-end">
      {/* Background images with fade transition */}
      {slides.map((s, i) => (
        <img
          key={i}
          src={s.image_url}
          alt={s.title || "Hero banner"}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
          loading={i === 0 ? "eager" : "lazy"}
        />
      ))}
      <div className="absolute inset-0 bg-foreground/30" />

      <div className="relative z-10 w-full px-8 md:px-16 pb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="text-left max-w-2xl">
          <h1
            className="text-[31px] md:text-[53px] lg:text-[64px] font-light leading-tight text-background mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {(slide?.title || "").split("\n").map((line: string, i: number) => (
              <span key={i}>{line}{i === 0 && <br />}</span>
            ))}
          </h1>
          <p className="text-background/80 text-base md:text-lg max-w-md">
            {slide?.description}
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-4 self-start md:self-end">
          <Link
            to={slide?.button_link || "/shop"}
            className="inline-block bg-primary text-primary-foreground px-8 py-3 text-sm tracking-widest uppercase hover:opacity-90 transition-opacity rounded-full"
          >
            {slide?.button_text || "SHOP"}
          </Link>

          {/* Dots indicator */}
          {slides.length > 1 && (
            <div className="flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === current ? "bg-background w-6" : "bg-background/50"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
