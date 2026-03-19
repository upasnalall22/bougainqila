import { Link } from "react-router-dom";
import heroBanner from "@/assets/hero-banner.jpg";
import { useHomepageContent } from "@/hooks/useCMS";

const HeroBanner = () => {
  const { data: content } = useHomepageContent("hero");

  const title = content?.title || "One of a Kind\nClay Creations";
  const subtitle = content?.subtitle || "Handcrafted with Love";
  const description = content?.description || "Unique handmade home decor & accessories, crafted piece by piece with intention.";
  const buttonText = content?.button_text || "Explore More";
  const buttonLink = content?.button_link || "/shop";
  const bgImage = content?.image_url || heroBanner;

  return (
    <section className="relative w-full h-[50vh] md:h-[70vh] min-h-[400px] overflow-hidden flex items-center justify-center">
      <img
        src={bgImage}
        alt="Handcrafted clay home decor collection"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />
      <div className="absolute inset-0 bg-foreground/30" />

      <div className="relative z-10 text-center px-6 max-w-2xl">
        <p className="text-sm tracking-[0.3em] uppercase text-background/80 mb-4">{subtitle}</p>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-light leading-tight text-background mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          {title.split("\n").map((line, i) => (
            <span key={i}>{line}{i === 0 && <br />}</span>
          ))}
        </h1>
        <p className="text-background/80 text-base md:text-lg mb-8 max-w-md mx-auto">
          {description}
        </p>
        <Link
          to={buttonLink}
          className="inline-block bg-primary text-primary-foreground px-8 py-3 text-sm tracking-widest uppercase hover:opacity-90 transition-opacity rounded-sm"
        >
          {buttonText}
        </Link>
      </div>
    </section>
  );
};

export default HeroBanner;
