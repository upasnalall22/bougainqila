import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 max-w-3xl mx-auto px-6 py-20 w-full">
      <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-3">Legal</p>
      <h1
        className="text-3xl md:text-4xl font-light text-foreground mb-8"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        Terms & Conditions
      </h1>
      <div className="prose prose-sm text-muted-foreground space-y-4">
        <p>
          By using the BougainQila website and purchasing our products, you agree to the following terms and conditions.
        </p>
        <h3 className="text-foreground font-medium text-base">Products</h3>
        <p>
          All products are handmade and may have slight variations in colour, size, and texture. These are not defects
          but characteristics of handcrafted items.
        </p>
        <h3 className="text-foreground font-medium text-base">Pricing</h3>
        <p>
          All prices are listed in INR and are inclusive of applicable taxes unless stated otherwise. Shipping charges
          may apply based on your location.
        </p>
        <h3 className="text-foreground font-medium text-base">Intellectual Property</h3>
        <p>
          All content, designs, and images on this website are the property of BougainQila and may not be reproduced
          without permission.
        </p>
        <h3 className="text-foreground font-medium text-base">Contact</h3>
        <p>
          For questions regarding these terms, reach us at{" "}
          <a href="mailto:studio@bougainqila.com" className="text-primary hover:underline">
            studio@bougainqila.com
          </a>
          .
        </p>
      </div>
    </main>
    <Footer />
  </div>
);

export default Terms;
