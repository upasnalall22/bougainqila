import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const GiftShop = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 max-w-7xl mx-auto px-6 py-20">
      <h1 className="text-3xl md:text-4xl font-light text-foreground mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        The Gift Shop
      </h1>
      <p className="text-muted-foreground">Curated gift sets and bundles coming soon.</p>
    </main>
    <Footer />
  </div>
);

export default GiftShop;
