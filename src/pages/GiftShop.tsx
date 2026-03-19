import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsletterBar from "@/components/NewsletterBar";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const curatedSets = [
  {
    title: "The Housewarming Edit",
    description: "A curated collection of handcrafted pieces to make any new house feel like home.",
  },
  {
    title: "The Festive Edit",
    description: "Celebrate the season with thoughtfully chosen decor that brings warmth and joy.",
  },
  {
    title: "The Everyday Edit",
    description: "Small touches of beauty for daily living — perfect for gifting just because.",
  },
];

const GiftShop = () => {
  const { data: products, isLoading } = useProducts("gift-set");
  const [form, setForm] = useState({ name: "", mobile: "", note: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.mobile.trim()) return;

    const sanitizedMobile = form.mobile.replace(/[^0-9+\- ]/g, "").slice(0, 15);
    const sanitizedName = form.name.trim().slice(0, 100);
    const sanitizedNote = form.note.trim().slice(0, 500);

    try {
      await supabase.from("customers").insert({
        name: sanitizedName,
        phone: sanitizedMobile,
        notes: sanitizedNote || null,
      });
    } catch {
      // non-blocking
    }
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 w-full">
        {/* Hero */}
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-3">Curated with Love</p>
          <h1 className="text-3xl md:text-4xl font-light text-foreground" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            The Gift Shop
          </h1>
          <p className="text-sm text-muted-foreground mt-4 max-w-lg mx-auto">
            Thoughtfully curated gift sets perfect for every occasion — housewarming, weddings, festivals, or just because.
          </p>
        </div>

        {/* Curated Gift Sets - 3 image placeholders in a row */}
        <section className="max-w-7xl mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {curatedSets.map((set, i) => (
              <div key={i} className="text-center">
                <div className="aspect-[4/5] bg-muted border border-border rounded-sm overflow-hidden mb-4 flex items-center justify-center">
                  <span className="text-muted-foreground text-xs tracking-widest uppercase">Coming Soon</span>
                </div>
                <h3
                  className="text-lg font-light text-foreground mb-1"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {set.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {set.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form */}
        <section className="bg-muted py-12 md:py-16">
          <div className="max-w-md mx-auto px-6">
            <h2
              className="text-xl md:text-2xl font-light text-foreground text-center mb-2 italic"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Let's curate your gift
            </h2>
            <p className="text-xs text-muted-foreground tracking-wide text-center mb-8">
              Share your details and we'll get in touch to help create the perfect gift.
            </p>

            {submitted ? (
              <p className="text-sm text-primary text-center">Thank you! We'll be in touch soon.</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Your name"
                  className="w-full border border-border bg-background px-4 py-2.5 text-sm text-foreground rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <input
                  type="tel"
                  required
                  maxLength={15}
                  value={form.mobile}
                  onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))}
                  placeholder="Mobile number"
                  className="w-full border border-border bg-background px-4 py-2.5 text-sm text-foreground rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <textarea
                  maxLength={500}
                  rows={3}
                  value={form.note}
                  onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                  placeholder="A note about what you're looking for (optional)"
                  className="w-full border border-border bg-background px-4 py-2.5 text-sm text-foreground rounded-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-2.5 text-xs tracking-[0.15em] uppercase hover:opacity-90 transition-opacity rounded-sm"
                >
                  Connect with Us
                </button>
              </form>
            )}
          </div>
        </section>

        {/* Products */}
        {isLoading ? (
          <div className="max-w-7xl mx-auto px-6 py-16">
            <p className="text-center text-muted-foreground">Loading products...</p>
          </div>
        ) : products && products.length > 0 ? (
          <div className="max-w-7xl mx-auto px-6 py-16">
            <h2
              className="text-xl md:text-2xl font-light text-foreground text-center mb-10"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Gift Sets
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link key={product.id} to={`/product/${product.slug}`}>
                  <ProductCard
                    product={{
                      id: product.id,
                      name: product.name,
                      description: product.description || "",
                      price: product.price,
                      image: product.product_images?.[0]?.image_url || "/placeholder.svg",
                      category: product.category as any,
                      tag: product.tag || undefined,
                    }}
                  />
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        <NewsletterBar />
      </main>
      <Footer />
    </div>
  );
};

export default GiftShop;
