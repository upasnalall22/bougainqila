import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { useEffect, useRef, useState } from "react";

const FeaturedProducts = () => {
  const { data: products, isLoading } = useProducts();
  const { addToCart } = useCart();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Popularity-based sorting: best_seller first, then featured, then by stock_quantity desc
  const popularProducts =
    products
      ?.slice()
      .sort((a, b) => {
        if (a.best_seller !== b.best_seller) return a.best_seller ? -1 : 1;
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return (b.stock_quantity ?? 0) - (a.stock_quantity ?? 0);
      })
      .filter((p) => p.featured || p.best_seller)
      .slice(0, 10) ?? [];

  // Auto-scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || popularProducts.length <= 2) return;

    const interval = setInterval(() => {
      if (isPaused) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 2) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 220, behavior: "smooth" });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused, popularProducts.length]);

  if (isLoading || popularProducts.length === 0) return null;

  return (
    <section className="bg-card py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">From the Studio</p>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-light text-foreground"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Featured Pieces
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
          {popularProducts.map((product) => {
            const image = product.product_images?.[0]?.image_url || "/placeholder.svg";
            const label = product.tag || (product.best_seller ? "Bestseller" : null);
            return (
              <div
                key={product.id}
                className="group flex flex-col flex-shrink-0 w-[45vw] sm:w-[30vw] md:w-[22vw] lg:w-[18vw] snap-start"
              >
                <Link to={`/product/${product.slug}`}>
                  <div className="aspect-square bg-muted rounded-sm mb-2 overflow-hidden border border-border group-hover:shadow-md transition-shadow relative">
                    <img src={image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                    {label && (
                      <div className="absolute top-2 left-2">
                        <span className="bg-primary text-primary-foreground text-[9px] sm:text-[10px] px-2 py-0.5 rounded-sm uppercase tracking-wider">
                          {label}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
                <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mb-0.5 truncate">
                  {product.category}
                </p>
                <Link to={`/product/${product.slug}`}>
                  <h3 className="text-xs sm:text-sm font-medium text-foreground mb-0.5 hover:text-primary transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-xs sm:text-sm text-primary font-medium mb-2">
                  MRP ₹{Number(product.price).toLocaleString("en-IN")}.00
                </p>
                <button
                  onClick={() => addToCart(product.id)}
                  className="w-full mt-auto border border-border text-foreground text-[10px] tracking-[0.1em] uppercase py-2 rounded-sm hover:bg-muted transition-colors whitespace-nowrap"
                >
                  Add to Cart
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
