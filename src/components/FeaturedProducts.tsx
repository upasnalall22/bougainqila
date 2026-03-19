import { Link } from "react-router-dom";

const products = [
  { id: 1, name: "Terracotta Wind Chime", price: 1200, category: "Windchimes" },
  { id: 2, name: "Custom Name Lettering", price: 850, category: "Lettering" },
  { id: 3, name: "Mini Clay Planter", price: 650, category: "Containers" },
  { id: 4, name: "Floral Jooda Stick", price: 450, category: "Hair Accessories" },
  { id: 5, name: "Ocean Breeze Chime", price: 1400, category: "Windchimes" },
  { id: 6, name: "Clay Trinket Bowl", price: 550, category: "Containers" },
];

const FeaturedProducts = () => {
  return (
    <section className="bg-card py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-3">Curated</p>
          <h2 className="text-3xl md:text-4xl font-light text-foreground" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Featured Pieces
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {products.map((product) => (
            <Link key={product.id} to="/" className="group">
              <div className="aspect-square bg-muted rounded-sm mb-3 flex items-center justify-center border border-border group-hover:shadow-md transition-shadow">
                <span className="text-muted-foreground text-sm">Product Image</span>
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{product.category}</p>
              <h3 className="text-sm font-medium text-foreground mb-1">{product.name}</h3>
              <p className="text-sm text-primary font-medium">MRP ₹{product.price.toLocaleString("en-IN")}.00</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
