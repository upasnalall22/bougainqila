import { Link } from "react-router-dom";
import heroBanner from "@/assets/hero-banner.jpg";

const HeroBanner = () => {
  return (
    <section className="relative w-full h-[70vh] min-h-[500px] overflow-hidden flex items-center justify-center">
      <img
        src={heroBanner}
        alt="Handcrafted clay home decor collection"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-foreground/30" />

      <div className="relative z-10 text-center px-6 max-w-2xl">
        <p className="text-sm tracking-[0.3em] uppercase text-background/80 mb-4">Handcrafted with Love</p>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-light leading-tight text-background mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          One of a Kind<br />Clay Creations
        </h1>
        <p className="text-background/80 text-base md:text-lg mb-8 max-w-md mx-auto">
          Unique handmade home decor & accessories, crafted piece by piece with intention.
        </p>
        <Link
          to="/"
          className="inline-block bg-primary text-primary-foreground px-8 py-3 text-sm tracking-widest uppercase hover:opacity-90 transition-opacity rounded-sm"
        >
          Explore More
        </Link>
      </div>
    </section>
  );
};

export default HeroBanner;
