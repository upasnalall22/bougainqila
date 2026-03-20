
CREATE TABLE public.insta_feed_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  caption text,
  link_type text NOT NULL DEFAULT 'external',
  link_url text,
  journal_post_id uuid REFERENCES public.journal_posts(id) ON DELETE SET NULL,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.insta_feed_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Insta feed viewable by everyone" ON public.insta_feed_items FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated users can manage insta feed" ON public.insta_feed_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
