import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import TrustBadges from "@/components/TrustBadges";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedProducts from "@/components/FeaturedProducts";
import AboutSection from "@/components/AboutSection";
import JournalSection from "@/components/JournalSection";
import NewsletterBar from "@/components/NewsletterBar";
import NewsletterPopup from "@/components/NewsletterPopup";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { useHomepageContent } from "@/hooks/useCMS";

const Index = () => {
  const { data: heroContent } = useHomepageContent("hero");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "BougainQila",
    url: window.location.origin,
    description: heroContent?.meta_description || "Handcrafted clay home decor & accessories.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${window.location.origin}/shop?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title={heroContent?.meta_title || "BougainQila — Handcrafted Clay Home Decor"}
        description={heroContent?.meta_description || "Handcrafted clay home decor & accessories. Every piece is one of a kind."}
        canonical={window.location.origin}
        jsonLd={jsonLd}
      />
      <Navbar />
      <main className="flex-1">
        <HeroBanner />
        <TrustBadges />
        <CategoryGrid />
        <AboutSection />
        <FeaturedProducts />
        <JournalSection />
        <NewsletterBar />
      </main>
      <Footer />
      <NewsletterPopup />
    </div>
  );
};

export default Index;
