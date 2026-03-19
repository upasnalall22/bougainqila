import { createContext, useContext, useCallback, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

function getSessionId() {
  let id = localStorage.getItem("cart_session_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("cart_session_id", id);
  }
  return id;
}

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    original_price: number | null;
    image_url: string;
    category: string;
  };
}

interface CartContextValue {
  items: CartItem[];
  isLoading: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const sessionId = getSessionId();

  const fetchCart = useCallback(async () => {
    const { data, error } = await supabase
      .from("cart_items")
      .select("id, product_id, quantity, products(id, name, slug, price, original_price, category, product_images(image_url, display_order))")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    if (!error && data) {
      setItems(
        data.map((item: any) => ({
          id: item.id,
          product_id: item.product_id,
          quantity: item.quantity,
          product: {
            id: item.products.id,
            name: item.products.name,
            slug: item.products.slug,
            price: item.products.price,
            original_price: item.products.original_price,
            category: item.products.category,
            image_url:
              item.products.product_images?.sort((a: any, b: any) => a.display_order - b.display_order)[0]?.image_url ||
              "/placeholder.svg",
          },
        }))
      );
    }
    setIsLoading(false);
  }, [sessionId]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = useCallback(
    async (productId: string, quantity = 1) => {
      // Check if already in cart
      const existing = items.find((i) => i.product_id === productId);
      if (existing) {
        await supabase
          .from("cart_items")
          .update({ quantity: existing.quantity + quantity })
          .eq("id", existing.id);
      } else {
        await supabase
          .from("cart_items")
          .insert({ session_id: sessionId, product_id: productId, quantity });
      }
      await fetchCart();
      setIsOpen(true);
    },
    [items, sessionId, fetchCart]
  );

  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      if (quantity < 1) return removeItem(itemId);
      await supabase.from("cart_items").update({ quantity }).eq("id", itemId);
      await fetchCart();
    },
    [fetchCart]
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      await supabase.from("cart_items").delete().eq("id", itemId);
      await fetchCart();
    },
    [fetchCart]
  );

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isLoading,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addToCart,
        updateQuantity,
        removeItem,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
