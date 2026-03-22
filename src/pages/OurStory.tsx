import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsletterBar from "@/components/NewsletterBar";
import SEOHead from "@/components/SEOHead";
import { useOurStorySections } from "@/hooks/useOurStory";
import { Link } from "react-router-dom";

const OurStory = () => {
  const { data: sections, isLoading } = useOurStorySections();

  const getSection = (key: string) => sections?.find((s: any) => s.section_key === key);

  const hero = getSection("hero");
  const tagline = getSection("tagline");
  const brandStory = getSection("brand-story");
  const philosophy = getSection("philosophy");
  const foundersIntro = getSection("founders-intro");
  const founder1 = getSection("founder-1");
  const card1 = getSection("card-1");
  const card2 = getSection("card-2");
  const card3 = getSection("card-3");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Brand Story */}
        <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="order-2 md:order-1">
              <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                {brandStory?.description || ""}
              </p>
            </div>
            <div className="aspect-[4/5] bg-card rounded-sm overflow-hidden border border-border order-1 md:order-2">
              {brandStory?.image_url ? (
                <img src={brandStory.image_url} alt="Brand Story" className="w-full h-full object-cover" loading="lazy" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">Image</div>
              )}
            </div>
          </div>
        </section>

        {/* Philosophy / Quote */}
        <section className="bg-card border-y border-border">
          <div className="max-w-4xl mx-auto px-6 py-16 md:py-24 text-center">
            <h3
              className="text-xl md:text-3xl font-light text-foreground mb-8 leading-relaxed"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {philosophy?.title || "Taking inspiration from the world around us, our offerings are thoughtfully crafted and curated."}
            </h3>
            <p className="text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              {philosophy?.description || ""}
            </p>
          </div>
        </section>

        {/* Founders Section */}
        <section className="max-w-5xl mx-auto px-6 py-16 md:py-24">
          <h3
            className="text-sm tracking-[0.3em] uppercase text-muted-foreground text-center mb-12"
          >
            {foundersIntro?.title || "OUR FOUNDER"}
          </h3>
          {foundersIntro?.description && (
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">{foundersIntro.description}</p>
          )}

          {founder1 && (
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="aspect-[3/4] bg-card rounded-sm overflow-hidden border border-border">
                {founder1.image_url ? (
                  <img src={founder1.image_url} alt={founder1.subtitle || "Founder"} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">Founder Photo</div>
                )}
              </div>
              <div className="bg-card border border-border rounded-sm p-6 md:p-10 flex flex-col justify-center h-full">
                {founder1.quote && (
                  <blockquote
                    className="text-lg md:text-xl font-light text-foreground mb-6 leading-relaxed italic"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    "{founder1.quote}"
                  </blockquote>
                )}
                {founder1.subtitle && (
                  <p className="text-sm font-medium text-foreground mb-2">{founder1.subtitle}</p>
                )}
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {founder1.description || ""}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Bottom Cards */}
        <section className="max-w-6xl mx-auto px-6 pb-16 md:pb-24">
          <div className="grid md:grid-cols-3 gap-6">
            {[card1, card2, card3].map((card, i) => card && (
              <Link
                key={card.section_key}
                to={card.button_link || ["/shop", "/gift-shop", "/journal"][i]}
                className="group block"
              >
                <div className="aspect-[4/3] bg-card rounded-sm overflow-hidden border border-border mb-4">
                  {card.image_url ? (
                    <img
                      src={card.image_url}
                      alt={card.title || ""}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">Image</div>
                  )}
                </div>
                <h4
                  className="text-lg font-light text-foreground mb-1"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {card.title}
                </h4>
                <p className="text-muted-foreground text-sm">{card.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <NewsletterBar />
      <Footer />
    </div>
  );
};

export default OurStory;
