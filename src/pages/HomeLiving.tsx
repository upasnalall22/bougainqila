import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import { useParams, Link } from "react-router-dom";

const subCategories = [
  { label: "All", slug: "" },
  { label: "Windchimes", slug: "windchimes" },
  { label: "Letterings", slug: "letterings" },
  { label: "Containers", slug: "containers" },
  { label: "Hair Accents", slug: "hair-accents" },
];

const homeLivingCategories = ["windchimes", "letterings", "containers", "hair-accents"] as const;

const HomeLiving = () => {
  const { category } = useParams<{ category?: string }>();
  const filtered = category
    ? products.filter((p) => p.category === category)
    : products.filter((p) => (homeLivingCategories as readonly string[]).includes(p.category));

  const activeLabel = subCategories.find((s) => s.slug === (category || ""))?.label || "All";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-6 py-16 w-full">
        <div className="text-center mb-12">
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-3">Collections</p>
          <h1 className="text-3xl md:text-4xl font-light text-foreground" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Home & Living
          </h1>
        </div>

        {/* Sub-category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {subCategories.map((sub) => (
            <Link
              key={sub.slug}
              to={sub.slug ? `/home-living/${sub.slug}` : "/home-living"}
              className={`text-[10px] tracking-[0.2em] uppercase px-4 py-2 rounded-sm border transition-colors ${
                activeLabel === sub.label
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
              }`}
            >
              {sub.label}
            </Link>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomeLiving;
