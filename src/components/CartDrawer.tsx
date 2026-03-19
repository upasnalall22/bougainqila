import { X, Minus, Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart, type CartItem } from "@/hooks/useCart";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useRef, useState, useEffect } from "react";

function RecommendationStrip({ cartProductIds }: { cartProductIds: string[] }) {
  const { addToCart } = useCart();
  const { data: recommendations } = useQuery({
    queryKey: ["cart-recommendations", cartProductIds],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("id, name, slug, price, original_price, product_images(image_url, display_order)")
        .eq("in_stock", true)
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(10);

      const { data, error } = await query;
      if (error) throw error;
      // filter out items already in cart, take top 5
      return (data || [])
        .filter((p: any) => !cartProductIds.includes(p.id))
        .slice(0, 5)
        .map((p: any) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: p.price,
          original_price: p.original_price,
          image_url:
            p.product_images?.sort((a: any, b: any) => a.display_order - b.display_order)[0]?.image_url ||
            "/placeholder.svg",
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

  useEffect(() => {
    checkScroll();
  }, [recommendations]);

  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 180, behavior: "smooth" });
    setTimeout(checkScroll, 350);
  };

  if (!recommendations?.length) return null;

  return (
    <div className="border-t border-border pt-5 pb-2">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3
          className="text-base font-medium text-foreground"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Don't Miss These Essentials
        </h3>
        <div className="flex gap-1">
          <button
            onClick={() => scroll(-1)}
            disabled={!canScrollLeft}
            className="w-7 h-7 rounded-full border border-border flex items-center justify-center disabled:opacity-30 hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => scroll(1)}
            disabled={!canScrollRight}
            className="w-7 h-7 rounded-full border border-border flex items-center justify-center disabled:opacity-30 hover:bg-muted transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-3 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: "none" }}
      >
        {recommendations.map((rec) => (
          <div key={rec.id} className="flex-shrink-0 w-[140px] border border-border rounded-sm p-2">
            <Link to={`/product/${rec.slug}`} className="block">
              <div className="aspect-square rounded-sm overflow-hidden bg-muted mb-2">
                <img src={rec.image_url} alt={rec.name} className="w-full h-full object-cover" />
              </div>
              <p className="text-[11px] text-foreground leading-tight line-clamp-2 mb-1">{rec.name}</p>
            </Link>
            <div className="flex items-baseline gap-1.5 mb-2">
              <span className="text-xs font-medium text-foreground">₹{rec.price.toLocaleString("en-IN")}</span>
            </div>
            <button
              onClick={() => addToCart(rec.id)}
              className="w-full bg-primary text-primary-foreground text-[9px] tracking-[0.1em] uppercase py-1.5 rounded-sm hover:opacity-90 transition-opacity"
            >
              Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex gap-3 py-4 border-b border-border">
      <Link to={`/product/${item.product.slug}`} className="flex-shrink-0">
        <div className="w-20 h-20 rounded-sm overflow-hidden bg-muted">
          <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
        </div>
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/product/${item.product.slug}`}>
            <h4 className="text-sm text-foreground leading-snug line-clamp-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {item.product.name}
            </h4>
          </Link>
          <button
            onClick={() => removeItem(item.id)}
            className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
            aria-label="Remove"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs font-medium text-foreground mt-1">
          MRP ₹{item.product.price.toLocaleString("en-IN")}.00
        </p>
        <div className="inline-flex items-center border border-border rounded-sm mt-2">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="w-7 h-7 flex items-center justify-center hover:bg-muted transition-colors"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="w-8 text-center text-xs">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="w-7 h-7 flex items-center justify-center hover:bg-muted transition-colors"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

const CartDrawer = () => {
  const { items, isOpen, closeCart, subtotal } = useCart();
  const shipping = 0; // calculated later at checkout
  const cartProductIds = items.map((i) => i.product_id);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-foreground/30 z-[60]" onClick={closeCart} />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-background z-[70] shadow-xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2
            className="text-lg tracking-[0.1em] uppercase text-foreground"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Cart
          </h2>
          <button onClick={closeCart} className="text-foreground hover:text-muted-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <p className="text-muted-foreground text-sm">Your cart is empty</p>
              <Link
                to="/shop"
                onClick={closeCart}
                className="text-primary text-xs tracking-[0.15em] uppercase underline"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}

              {/* Recommendations */}
              <div className="mt-4">
                <RecommendationStrip cartProductIds={cartProductIds} />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border px-5 py-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Sub-Total</span>
              <span className="text-foreground">₹{subtotal.toLocaleString("en-IN")}.00</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-foreground text-xs">Calculated at checkout</span>
            </div>
            <div className="flex justify-between text-sm font-medium mt-2 pt-2 border-t border-border">
              <span className="text-foreground">Total</span>
              <span className="text-foreground">₹{subtotal.toLocaleString("en-IN")}.00</span>
            </div>

            <div className="flex gap-3 mt-4">
              <Link
                to="/shop"
                onClick={closeCart}
                className="flex-1 border border-primary text-primary text-[10px] tracking-[0.15em] uppercase py-3 rounded-sm text-center hover:bg-primary/5 transition-colors"
              >
                View Cart
              </Link>
              <Link
                to="/checkout"
                onClick={closeCart}
                className="flex-1 bg-primary text-primary-foreground text-[10px] tracking-[0.15em] uppercase py-3 rounded-sm text-center hover:opacity-90 transition-opacity"
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
