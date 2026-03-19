import type { Product } from "@/data/products";

const ProductCard = ({ product }: { product: Product }) => (
  <div className="group cursor-pointer">
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
    </div>
    <h3 className="text-sm text-foreground mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
      {product.name}
    </h3>
    <p className="text-xs text-muted-foreground">₹{product.price.toLocaleString("en-IN")}</p>
  </div>
);

export default ProductCard;
