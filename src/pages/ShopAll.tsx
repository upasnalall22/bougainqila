import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ShopAll = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 max-w-7xl mx-auto px-6 py-20">
      <h1 className="text-3xl md:text-4xl font-light text-foreground mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        Shop All
      </h1>
      <p className="text-muted-foreground">Full catalogue coming soon.</p>
    </main>
    <Footer />
  </div>
);

export default ShopAll;
