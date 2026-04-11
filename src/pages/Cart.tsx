import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { useCart, type CartItem } from "@/hooks/useCart";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useRef, useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { trackAddToCart } from "@/lib/analytics";

const FREE_SHIPPING_THRESHOLD = 800;
const SHIPPING_COST = 100;

/* ─── Cart Item Row ─── */
function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCart();
  const lineTotal = item.product.price * item.quantity;

  return (
    <div className="flex gap-4 py-5 border-b border-border">
      <Link to={`/product/${item.product.slug}`} className="flex-shrink-0">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-sm overflow-hidden bg-muted">
          <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
        </div>
      </Link>
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <Link to={`/product/${item.product.slug}`}>
              <h3 className="text-sm sm:text-base text-foreground leading-snug line-clamp-2" style={{ fontFamily: "var(--font-heading)" }}>
                {item.product.name}
              </h3>
            </Link>
            <button
              onClick={() => removeItem(item.id)}
              className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0 p-1"
              aria-label="Remove item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{item.product.category}</p>
        </div>
        <div className="flex items-end justify-between mt-2">
          <div className="inline-flex items-center border border-border rounded-sm">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          <p className="text-sm font-medium text-foreground">₹{lineTotal.toLocaleString("en-IN")}.00</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Recommendations Strip ─── */
function RecommendationStrip({ cartProductIds }: { cartProductIds: string[] }) {
  const { addToCart } = useCart();
  const { data: recommendations } = useQuery({
    queryKey: ["cart-recommendations", cartProductIds],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, slug, price, product_images(image_url, display_order)")
        .eq("in_stock", true)
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return (data || [])
        .filter((p: any) => !cartProductIds.includes(p.id))
        .slice(0, 6)
        .map((p: any) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: p.price,
          image_url: p.product_images?.sort((a: any, b: any) => a.display_order - b.display_order)[0]?.image_url || "/placeholder.svg",
        }));
    },
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  };

  useEffect(() => { checkScroll(); }, [recommendations]);

  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 200, behavior: "smooth" });
    setTimeout(checkScroll, 350);
  };

  if (!recommendations?.length) return null;

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl text-foreground tracking-[0.05em]" style={{ fontFamily: "var(--font-heading)" }}>
          Don't Miss These Essentials
        </h2>
        <div className="flex gap-1.5">
          <button onClick={() => scroll(-1)} disabled={!canScrollLeft} className="w-8 h-8 rounded-full border border-border flex items-center justify-center disabled:opacity-30 hover:bg-muted transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => scroll(1)} disabled={!canScrollRight} className="w-8 h-8 rounded-full border border-border flex items-center justify-center disabled:opacity-30 hover:bg-muted transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div ref={scrollRef} onScroll={checkScroll} className="flex gap-4 overflow-x-auto scrollbar-hide pb-2" style={{ scrollbarWidth: "none" }}>
        {recommendations.map((rec) => (
          <div key={rec.id} className="flex flex-col flex-shrink-0 w-[160px] sm:w-[180px]">
            <Link to={`/product/${rec.slug}`} className="block">
              <div className="aspect-square rounded-sm overflow-hidden bg-muted mb-2">
                <img src={rec.image_url} alt={rec.name} className="w-full h-full object-cover" />
              </div>
              <p className="text-xs text-foreground leading-tight line-clamp-2 mb-1" style={{ fontFamily: "var(--font-heading)" }}>{rec.name}</p>
            </Link>
            <p className="text-xs font-medium text-foreground mb-2">₹{rec.price.toLocaleString("en-IN")}.00</p>
            <button
              onClick={() => { addToCart(rec.id); trackAddToCart({ id: rec.id, name: rec.name, price: rec.price, quantity: 1 }); }}
              className="w-full mt-auto border border-border text-foreground text-[10px] tracking-[0.1em] uppercase py-2 rounded-sm hover:bg-muted transition-colors"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Frequently Bought Together ─── */
function FrequentlyBoughtTogether({ cartProductIds }: { cartProductIds: string[] }) {
  const { addToCart } = useCart();
  const { data: products } = useQuery({
    queryKey: ["frequently-bought", cartProductIds],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, slug, price, category, best_seller, product_images(image_url, display_order)")
        .eq("in_stock", true)
        .eq("best_seller", true)
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return (data || [])
        .filter((p: any) => !cartProductIds.includes(p.id))
        .slice(0, 5)
        .map((p: any) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: p.price,
          category: p.category,
          image_url: p.product_images?.sort((a: any, b: any) => a.display_order - b.display_order)[0]?.image_url || "/placeholder.svg",
        }));
    },
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  };

  useEffect(() => { checkScroll(); }, [products]);

  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 220, behavior: "smooth" });
    setTimeout(checkScroll, 350);
  };

  if (!products?.length) return null;

  return (
    <div className="mt-12 border-t border-border pt-10">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl sm:text-2xl text-foreground tracking-[0.05em] uppercase" style={{ fontFamily: "var(--font-heading)" }}>
          Frequently Bought Together
        </h2>
        <div className="flex gap-1.5">
          <button onClick={() => scroll(-1)} disabled={!canScrollLeft} className="w-8 h-8 rounded-full border border-border flex items-center justify-center disabled:opacity-30 hover:bg-muted transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => scroll(1)} disabled={!canScrollRight} className="w-8 h-8 rounded-full border border-border flex items-center justify-center disabled:opacity-30 hover:bg-muted transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div ref={scrollRef} onScroll={checkScroll} className="flex gap-4 overflow-x-auto scrollbar-hide pb-2" style={{ scrollbarWidth: "none" }}>
        {products.map((p) => (
          <div key={p.id} className="flex flex-col flex-shrink-0 w-[160px] sm:w-[200px]">
            <Link to={`/product/${p.slug}`} className="block group">
              <div className="aspect-square rounded-sm overflow-hidden bg-muted mb-2">
                <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <p className="text-xs sm:text-sm text-foreground leading-tight line-clamp-2 mb-1" style={{ fontFamily: "var(--font-heading)" }}>{p.name}</p>
            </Link>
            <p className="text-xs font-medium text-foreground mb-2">MRP ₹{p.price.toLocaleString("en-IN")}.00</p>
            <button
              onClick={() => { addToCart(p.id); trackAddToCart({ id: p.id, name: p.name, price: p.price, quantity: 1 }); }}
              className="w-full mt-auto border border-border text-foreground text-[10px] tracking-[0.1em] uppercase py-2.5 rounded-sm hover:bg-muted transition-colors"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Cart Page ─── */
const Cart = () => {
  const { items, subtotal, isLoading } = useCart();
  const cartProductIds = items.map((i) => i.product_id);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : items.length > 0 ? SHIPPING_COST : 0;
  const total = subtotal + shipping;

  return (
    <>
      <SEOHead title="Your Cart | BougainQila" description="Review your cart and proceed to checkout." canonical="/cart" />
      <Navbar />
      <main className="min-h-screen bg-background pt-6 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="text-xs text-muted-foreground mb-6">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Cart</span>
          </nav>

          <h1 className="text-2xl sm:text-3xl text-foreground tracking-[0.05em] uppercase mb-8" style={{ fontFamily: "var(--font-heading)" }}>
            Your Cart
          </h1>

          {isLoading ? (
            <p className="text-muted-foreground text-sm py-12 text-center">Loading your cart...</p>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-5">
              <ShoppingBag className="w-16 h-16 text-muted-foreground/40" />
              <p className="text-muted-foreground text-sm">Your cart is empty</p>
              <Link
                to="/shop"
                className="border border-border text-foreground text-[10px] tracking-[0.15em] uppercase px-8 py-3 rounded-sm hover:bg-muted transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Left: Items */}
              <div className="lg:col-span-2">
                {/* Table header (desktop) */}
                <div className="hidden sm:grid grid-cols-[1fr_120px_100px] gap-4 text-[10px] tracking-[0.15em] uppercase text-muted-foreground pb-3 border-b border-border">
                  <span>Product</span>
                  <span className="text-center">Quantity</span>
                  <span className="text-right">Total</span>
                </div>

                {/* Items */}
                {items.map((item) => (
                  <CartItemRow key={item.id} item={item} />
                ))}

                {/* Continue Shopping */}
                <div className="mt-6">
                  <Link to="/shop" className="text-xs text-muted-foreground hover:text-foreground transition-colors tracking-[0.1em] uppercase underline underline-offset-4">
                    ← Continue Shopping
                  </Link>
                </div>

                {/* Recommendations */}
                <RecommendationStrip cartProductIds={cartProductIds} />
              </div>

              {/* Right: Order Summary */}
              <div className="lg:col-span-1">
                <div className="border border-border rounded-sm p-5 sm:p-6 sticky top-24">
                  <h2 className="text-base tracking-[0.1em] uppercase text-foreground mb-5" style={{ fontFamily: "var(--font-heading)" }}>
                    Order Summary
                  </h2>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground">₹{subtotal.toLocaleString("en-IN")}.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-foreground">
                        {shipping === 0 ? <span className="text-green-600">Free</span> : `₹${shipping}.00`}
                      </span>
                    </div>
                    {shipping > 0 && (
                      <p className="text-[10px] text-muted-foreground">
                        Add ₹{(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString("en-IN")} more for free shipping
                      </p>
                    )}
                    {shipping === 0 && subtotal > 0 && (
                      <p className="text-[10px] text-green-600 flex items-center gap-1">
                        ✓ Free shipping on orders above ₹{FREE_SHIPPING_THRESHOLD}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between text-sm font-medium mt-4 pt-4 border-t border-border">
                    <span className="text-foreground">Total</span>
                    <span className="text-foreground">₹{total.toLocaleString("en-IN")}.00</span>
                  </div>

                  <p className="text-[10px] text-muted-foreground mt-2">
                    Inclusive of all taxes. Shipping calculated at checkout.
                  </p>

                  <Link
                    to="/checkout"
                    className="block w-full bg-primary text-primary-foreground text-xs tracking-[0.15em] uppercase py-3.5 rounded-sm text-center hover:opacity-90 transition-opacity mt-5"
                  >
                    Proceed to Checkout
                  </Link>

                  <Link
                    to="/shop"
                    className="block w-full border border-border text-foreground text-xs tracking-[0.15em] uppercase py-3 rounded-sm text-center hover:bg-muted transition-colors mt-3"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Frequently Bought Together */}
          {items.length > 0 && <FrequentlyBoughtTogether cartProductIds={cartProductIds} />}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Cart;
