import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { Link } from "react-router-dom";

const GiftShop = () => {
  const { data: products, isLoading } = useProducts("gift-set");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-6 py-16 w-full">
        <div className="text-center mb-12">
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-3">Curated with Love</p>
          <h1 className="text-3xl md:text-4xl font-light text-foreground" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            The Gift Shop
          </h1>
          <p className="text-sm text-muted-foreground mt-4 max-w-lg mx-auto">
            Thoughtfully curated gift sets perfect for every occasion — housewarming, weddings, festivals, or just because.
          </p>
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
          <p className="text-center text-muted-foreground">No gift sets available yet.</p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default GiftShop;
