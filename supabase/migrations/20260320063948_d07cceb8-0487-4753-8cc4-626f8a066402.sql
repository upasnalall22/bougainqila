CREATE TABLE public.wishlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(session_id, product_id)
);

ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view wishlists" ON public.wishlists FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can insert wishlists" ON public.wishlists FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can delete wishlists" ON public.wishlists FOR DELETE TO public USING (true);