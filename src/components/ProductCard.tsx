import { Heart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    tag?: string;
    featured?: boolean;
    best_seller?: boolean;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  return (
    <div className="group flex flex-col h-full">
      {/* Image */}
      <div className="relative aspect-square rounded-sm overflow-hidden bg-muted mb-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <button
          onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
          aria-label="Add to wishlist"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${wishlisted ? "fill-destructive text-destructive" : "text-foreground/60"}`}
          />
        </button>
      </div>

      {/* Info */}
      <h3 className="text-sm text-foreground mb-0.5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        {product.name}
      </h3>
      <p className="text-[11px] text-muted-foreground leading-snug mb-1.5 line-clamp-1">
        {product.description}
      </p>
      <p className="text-xs font-medium text-foreground mb-3">
        MRP ₹{product.price.toLocaleString("en-IN")}.00
      </p>

      {/* Button */}
      <button
        onClick={(e) => { e.preventDefault(); addToCart(product.id); }}
        className="w-full mt-auto border border-border text-foreground text-[10px] tracking-[0.1em] uppercase py-2.5 rounded-sm hover:bg-muted transition-colors"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
