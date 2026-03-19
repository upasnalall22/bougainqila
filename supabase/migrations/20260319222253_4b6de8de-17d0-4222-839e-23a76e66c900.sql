
-- Add template column to journal_posts
ALTER TABLE public.journal_posts ADD COLUMN template text NOT NULL DEFAULT 'classic';

-- Create journal_post_images table for up to 5 images per post
CREATE TABLE public.journal_post_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.journal_posts(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  caption text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.journal_post_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Journal post images viewable by everyone"
ON public.journal_post_images FOR SELECT TO public USING (true);

CREATE POLICY "Authenticated users can manage journal post images"
ON public.journal_post_images FOR ALL TO authenticated
USING (true) WITH CHECK (true);
