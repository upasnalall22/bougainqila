import { Link } from "react-router-dom";
import catLettering from "@/assets/cat-lettering.jpg";
import catContainers from "@/assets/cat-containers.jpg";
import catHair from "@/assets/cat-hair.jpg";

// windchimes image imported after generation
import catWindchimes from "@/assets/cat-windchimes.jpg";

const categories = [
  { name: "Clay Windchimes", image: catWindchimes, to: "/home-living/windchimes" },
  { name: "Clay Lettering", image: catLettering, to: "/home-living/letterings" },
  // Hidden until products are added:
  // { name: "Clay Containers", image: catContainers, to: "/home-living/containers" },
  // { name: "Hair Accessories", image: catHair, to: "/home-living/hair-accents" },
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            to={cat.to}
            className="group relative rounded-sm overflow-hidden aspect-square"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-foreground/25 group-hover:bg-foreground/35 transition-colors" />
            <div className="relative z-10 h-full flex flex-col items-center justify-end pb-6 text-center">
              <h3 className="text-lg font-medium text-background mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {cat.name}
              </h3>
              <span className="text-xs tracking-widest uppercase text-background/80 group-hover:text-background transition-colors">
                Explore More →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
