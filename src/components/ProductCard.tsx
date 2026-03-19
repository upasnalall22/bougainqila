import { Heart } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/data/products";

const ProductCard = ({ product }: { product: Product }) => {
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <div className="group">
      {/* Image */}
      <div className="relative aspect-square rounded-sm overflow-hidden bg-muted mb-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.tag && (
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[9px] tracking-[0.15em] uppercase px-2.5 py-1 rounded-sm">
            {product.tag}
          </span>
        )}
        <button
          onClick={() => setWishlisted(!wishlisted)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
          aria-label="Add to wishlist"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${wishlisted ? "fill-red-500 text-red-500" : "text-foreground/60"}`}
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
        INR {product.price.toLocaleString("en-IN")}.00
      </p>

      {/* Buttons */}
      <div className="flex gap-2">
        <button className="flex-1 border border-border text-foreground text-[10px] tracking-[0.1em] uppercase py-2 rounded-sm hover:bg-muted transition-colors">
          Add to Cart
        </button>
        <button className="flex-1 bg-primary text-primary-foreground text-[10px] tracking-[0.1em] uppercase py-2 rounded-sm hover:opacity-90 transition-opacity">
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
