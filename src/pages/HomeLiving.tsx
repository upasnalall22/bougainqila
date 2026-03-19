import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const HomeLiving = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 max-w-7xl mx-auto px-6 py-20">
      <h1 className="text-3xl md:text-4xl font-light text-foreground mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        Home & Living
      </h1>
      <p className="text-muted-foreground">Browse our handcrafted home decor collections.</p>
    </main>
    <Footer />
  </div>
);

export default HomeLiving;
