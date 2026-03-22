import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsletterBar from "@/components/NewsletterBar";
import ProductCard from "@/components/ProductCard";
import SEOHead from "@/components/SEOHead";
import SortDropdown, { sortProducts, type SortOption } from "@/components/SortDropdown";
import { useProducts } from "@/hooks/useProducts";
import { useState } from "react";
import { Link } from "react-router-dom";

const filters = [
  { label: "All", value: "" },
  { label: "Windchimes", value: "windchimes" },
  { label: "Letterings", value: "letterings" },
  { label: "Containers", value: "containers" },
  { label: "Hair Accents", value: "hair-accents" },
  { label: "Gift Sets", value: "gift-set" },
];

const ShopAll = () => {
  const [active, setActive] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const { data: products, isLoading } = useProducts(active || undefined);

  const sortedProducts = sortProducts(products ?? [], sort);

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Shop All — Our Collection"
        description="Browse the full BougainQila collection of handcrafted clay home decor, windchimes, lettering, and accessories."
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
          <SortDropdown sort={sort} onSortChange={setSort} />
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
