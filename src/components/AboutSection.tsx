import { useHomepageContent } from "@/hooks/useCMS";
import { Link } from "react-router-dom";

const AboutSection = () => {
  const { data: content } = useHomepageContent("about");

  const title = content?.title || "Made by Hand,\nMade with Heart";
  const subtitle = content?.subtitle || "Our Story";
  const description = content?.description || "Every piece in our collection is shaped by hand from natural clay — no molds, no mass production. Each windchime, letter, container, and hair accessory carries the subtle imperfections that make handmade art truly special.";
  const buttonText = content?.button_text || "Learn More About Us →";
  const buttonLink = content?.button_link || "/our-story";
  const imageUrl = content?.image_url;

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="aspect-[4/5] bg-card rounded-sm border border-border flex items-center justify-center overflow-hidden">
          {imageUrl ? (
            <img src={imageUrl} alt="Our Story" className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <span className="text-muted-foreground text-sm">Your Story Image</span>
          )}
        </div>

        <div className="max-w-lg">
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-3">{subtitle}</p>
          <h2 className="text-3xl md:text-4xl font-light text-foreground mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {title.split("\n").map((line, i) => (
              <span key={i}>{line}{i === 0 && <br />}</span>
            ))}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">{description}</p>
          <Link to={buttonLink} className="text-xs tracking-widest uppercase text-primary hover:underline">
            {buttonText}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
