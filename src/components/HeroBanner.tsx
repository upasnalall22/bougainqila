import { Link } from "react-router-dom";
import heroBanner from "@/assets/hero-banner.jpg";
import { useHomepageContent } from "@/hooks/useCMS";

const HeroBanner = () => {
  const { data: content } = useHomepageContent("hero");

  const title = content?.title || "There is beauty in the broken\nand magic in the slow.";
  // subtitle not used in UI
  const description = content?.description || "Handmade home decor born from a terrace garden. Each piece carries the warmth of slow craft and an organic spirit.";
  const buttonText = content?.button_text || "Shop Now";
  const buttonLink = content?.button_link || "/shop";
  const bgImage = content?.image_url || heroBanner;

  return (
    <section className="relative w-full h-[50vh] md:h-[70vh] min-h-[400px] overflow-hidden flex items-end">
      <img
        src={bgImage}
        alt="Handcrafted clay home decor collection"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />
      <div className="absolute inset-0 bg-foreground/30" />

      <div className="relative z-10 w-full px-8 md:px-16 pb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="text-left max-w-2xl">
          <h1 className="text-[31px] md:text-[53px] lg:text-[64px] font-light leading-tight text-background mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {title.split("\n").map((line, i) => (
              <span key={i}>{line}{i === 0 && <br />}</span>
            ))}
          </h1>
          <p className="text-background/80 text-base md:text-lg max-w-md">
            {description}
          </p>
        </div>
        <Link
          to={buttonLink}
          className="inline-block bg-primary text-primary-foreground px-8 py-3 text-sm tracking-widest uppercase hover:opacity-90 transition-opacity rounded-sm self-start md:self-end"
        >
          {buttonText}
        </Link>
      </div>
    </section>
  );
};

export default HeroBanner;
