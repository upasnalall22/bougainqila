CREATE TABLE public.hero_banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  display_order integer NOT NULL DEFAULT 0,
  title text,
  description text,
  button_text text,
  button_link text,
  image_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hero banners viewable by everyone" ON public.hero_banners
  FOR SELECT TO public USING (true);

CREATE POLICY "Authenticated users can manage hero banners" ON public.hero_banners
  FOR ALL TO authenticated USING (true) WITH CHECK (true);