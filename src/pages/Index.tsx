import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedProducts from "@/components/FeaturedProducts";
import AboutSection from "@/components/AboutSection";
import JournalSection from "@/components/JournalSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroBanner />
        <CategoryGrid />
        <FeaturedProducts />
        <AboutSection />
        <JournalSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
