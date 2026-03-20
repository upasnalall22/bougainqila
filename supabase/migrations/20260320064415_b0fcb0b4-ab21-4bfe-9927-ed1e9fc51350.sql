CREATE TABLE public.product_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  reviewer_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  approved boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews viewable by everyone" ON public.product_reviews FOR SELECT TO public USING (approved = true);
CREATE POLICY "Anyone can submit reviews" ON public.product_reviews FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Authenticated can manage reviews" ON public.product_reviews FOR ALL TO authenticated USING (true) WITH CHECK (true);