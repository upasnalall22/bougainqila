import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { useParams, Link } from "react-router-dom";

const subCategories = [
  { label: "All", slug: "" },
  { label: "Windchimes", slug: "windchimes" },
  { label: "Letterings", slug: "letterings" },
  { label: "Containers", slug: "containers" },
  { label: "Hair Accents", slug: "hair-accents" },
];

const homeLivingCategories = ["windchimes", "letterings", "containers", "hair-accents"];

const HomeLiving = () => {
  const { category } = useParams<{ category?: string }>();
  const { data: allProducts, isLoading } = useProducts(category || undefined);

  const products = category
    ? allProducts
    : allProducts?.filter((p) => homeLivingCategories.includes(p.category));

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

        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading products...</p>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link key={product.id} to={`/product/${product.slug}`}>
                <ProductCard
                  product={{
                    id: product.id,
                    name: product.name,
                    description: product.description || "",
                    price: product.price,
                    image: product.product_images?.[0]?.image_url || "/placeholder.svg",
                    category: product.category as any,
                    tag: product.tag || undefined,
                  }}
                />
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No products found in this category.</p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default HomeLiving;
