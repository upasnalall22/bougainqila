import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const RefundPolicy = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 max-w-3xl mx-auto px-6 py-20 w-full">
      <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-3">Policies</p>
      <h1 className="text-3xl md:text-4xl font-light text-foreground mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        Refund Policy
      </h1>
      <div className="prose prose-sm text-muted-foreground space-y-4">
        <p>At BougenQila, we take great pride in the quality of our handcrafted products. Since each piece is made to order, we have a limited refund policy.</p>
        <h3 className="text-foreground font-medium text-base">Returns</h3>
        <p>If you receive a damaged or defective item, please contact us within 48 hours of delivery with photos of the issue. We will arrange a replacement or full refund.</p>
        <h3 className="text-foreground font-medium text-base">Cancellations</h3>
        <p>Orders can be cancelled within 24 hours of placement. After this window, production may have already begun and cancellations may not be possible.</p>
        <h3 className="text-foreground font-medium text-base">Contact</h3>
        <p>For any refund-related queries, please email us at <a href="mailto:kavanika@gmail.com" className="text-primary hover:underline">kavanika@gmail.com</a>.</p>
      </div>
    </main>
    <Footer />
  </div>
);

export default RefundPolicy;
