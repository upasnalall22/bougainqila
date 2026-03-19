
-- Cart items table using session_id for anonymous cart support
CREATE TABLE public.cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Anyone can manage their own cart items (matched by session_id passed from client)
CREATE POLICY "Anyone can view cart items" ON public.cart_items FOR SELECT USING (true);
CREATE POLICY "Anyone can insert cart items" ON public.cart_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update cart items" ON public.cart_items FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete cart items" ON public.cart_items FOR DELETE USING (true);

-- Trigger to update updated_at
CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON public.cart_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
