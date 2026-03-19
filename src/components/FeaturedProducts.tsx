import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";

const FeaturedProducts = () => {
  const { data: products, isLoading } = useProducts();
  const { addToCart } = useCart();

  const featured = products?.filter((p) => p.featured).slice(0, 6) ?? [];

  if (isLoading || featured.length === 0) return null;

  return (
    <section className="bg-card py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
           <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-3">From the Studio</p>
          <h2 className="text-3xl md:text-4xl font-light text-foreground" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Featured Pieces
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {featured.map((product) => {
            const image = product.product_images?.[0]?.image_url || "/placeholder.svg";
            return (
              <div key={product.id} className="group">
                <Link to={`/product/${product.slug}`}>
                  <div className="aspect-square bg-muted rounded-sm mb-3 overflow-hidden border border-border group-hover:shadow-md transition-shadow relative">
                    <img src={image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute top-2 left-2 flex gap-1">
                      {product.featured && (
                        <span className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-sm uppercase tracking-wider">Featured</span>
                      )}
                      {(product as any).best_seller && (
                        <span className="bg-foreground text-background text-[10px] px-2 py-0.5 rounded-sm uppercase tracking-wider">Bestseller</span>
                      )}
                      {product.tag && (
                        <span className="bg-accent text-accent-foreground text-[10px] px-2 py-0.5 rounded-sm uppercase tracking-wider">{product.tag}</span>
                      )}
                    </div>
                  </div>
                </Link>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{product.category}</p>
                <Link to={`/product/${product.slug}`}>
                  <h3 className="text-sm font-medium text-foreground mb-1 hover:text-primary transition-colors">{product.name}</h3>
                </Link>
                <p className="text-sm text-primary font-medium mb-2">MRP ₹{Number(product.price).toLocaleString("en-IN")}.00</p>
                <button
                  onClick={() => addToCart(product.id)}
                  className="text-xs tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors"
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
