import { Link } from "react-router-dom";

const categories = [
  { name: "Clay Windchimes", description: "Melodic handmade pieces for your space", image: "🎐" },
  { name: "Clay Lettering", description: "Personalized clay letter art", image: "✦" },
  { name: "Clay Containers", description: "Functional art for everyday use", image: "🏺" },
  { name: "Hair Accessories", description: "Handmade jooda stick pieces", image: "✿" },
];

const CategoryGrid = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-3">Collections</p>
        <h2 className="text-3xl md:text-4xl font-light text-foreground" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Shop by Category
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            to="/"
            className="group relative bg-card rounded-sm overflow-hidden aspect-[4/3] flex items-center justify-center hover:shadow-lg transition-shadow border border-border"
          >
            <div className="text-center p-8">
              <span className="text-5xl mb-4 block">{cat.image}</span>
              <h3 className="text-xl font-medium text-foreground mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {cat.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">{cat.description}</p>
              <span className="text-xs tracking-widest uppercase text-primary group-hover:underline">
                Explore →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
