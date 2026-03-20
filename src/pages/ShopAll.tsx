import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsletterBar from "@/components/NewsletterBar";
import ProductCard from "@/components/ProductCard";
import SEOHead from "@/components/SEOHead";
import { useProducts } from "@/hooks/useProducts";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const filters = [
  { label: "All", value: "" },
  { label: "Windchimes", value: "windchimes" },
  { label: "Letterings", value: "letterings" },
  { label: "Containers", value: "containers" },
  { label: "Hair Accents", value: "hair-accents" },
  { label: "Gift Sets", value: "gift-set" },
];

type SortOption = "newest" | "price-asc" | "price-desc" | "bestseller";

const sortOptions: { label: string; value: SortOption }[] = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Bestsellers", value: "bestseller" },
];

const ShopAll = () => {
  const [active, setActive] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const { data: products, isLoading } = useProducts(active || undefined);

  const sortedProducts = [...(products ?? [])].sort((a, b) => {
    switch (sort) {
      case "price-asc": return a.price - b.price;
      case "price-desc": return b.price - a.price;
      case "bestseller": return (b.best_seller ? 1 : 0) - (a.best_seller ? 1 : 0);
      case "newest":
      default: return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Shop All — Our Collection"
        description="Browse the full BougenQila collection of handcrafted clay home decor, windchimes, lettering, and accessories."
        canonical={`${window.location.origin}/shop`}
      />
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-6 py-16 w-full">
        <div className="text-center mb-12">
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-3">Our Collection</p>
          <h1 className="text-3xl md:text-4xl font-light text-foreground" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Shop All
          </h1>
        </div>

        {/* Filters + Sort */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-12">
          <div className="flex flex-wrap gap-3">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setActive(f.value)}
                className={`text-[10px] tracking-[0.2em] uppercase px-4 py-2 rounded-sm border transition-colors ${
                  active === f.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="text-[10px] tracking-[0.2em] uppercase px-4 py-2 rounded-sm border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors inline-flex items-center gap-1.5"
            >
              Sort: {sortOptions.find((s) => s.value === sort)?.label}
              <ChevronDown className={`w-3 h-3 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full mt-1 bg-background border border-border rounded-sm shadow-lg z-20 min-w-[180px]">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setSort(opt.value); setSortOpen(false); }}
                    className={`block w-full text-left px-4 py-2.5 text-xs tracking-wide transition-colors ${
                      sort === opt.value ? "text-primary bg-muted" : "text-foreground/80 hover:bg-muted"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading products...</p>
        ) : sortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <Link key={product.id} to={`/product/${product.slug}`}>
                <ProductCard
                  product={{
                    id: product.id,
                    name: product.name,
                    description: product.description || "",
                    price: product.price,
                    image: product.product_images?.[0]?.image_url || "/placeholder.svg",
                    category: product.category,
                    tag: product.tag || undefined,
                    featured: product.featured,
                    best_seller: (product as any).best_seller,
                  }}
                />
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No products found. Add products via the admin panel.</p>
        )}
      </main>
      <NewsletterBar />
      <Footer />
    </div>
  );
};

export default ShopAll;
