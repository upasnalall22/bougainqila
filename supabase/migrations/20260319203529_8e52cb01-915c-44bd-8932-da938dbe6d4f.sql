
CREATE TABLE public.our_story_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text NOT NULL UNIQUE,
  title text,
  subtitle text,
  description text,
  quote text,
  image_url text,
  image_url_2 text,
  button_text text,
  button_link text,
  display_order integer NOT NULL DEFAULT 0,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.our_story_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Our story sections viewable by everyone"
  ON public.our_story_sections FOR SELECT TO public USING (true);

CREATE POLICY "Authenticated users can manage our story sections"
  ON public.our_story_sections FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Seed default sections
INSERT INTO public.our_story_sections (section_key, title, subtitle, description, display_order) VALUES
  ('hero', 'OUR STORY', null, null, 0),
  ('tagline', 'Turn everyday into small moments of joy', null, null, 1),
  ('brand-story', null, null, 'Forged from a place of love for the unique, the handcrafted, and the personal, Kavira embraces design that delights. With great reverence for craftsmanship and the experienced touch of artisans, the brand celebrates the transformative nature of design that merges age-old techniques with contemporary aesthetics.', 2),
  ('philosophy', 'Taking inspiration from the world around us, our offerings are thoughtfully crafted and curated.', null, 'For Kavira, sustainability is more than a concept, it is a translation of considered actions. We believe that taking one step towards sustainability albeit imperfect is still a step. Weaving the threads of design, craftsmanship, culture, and effortless aesthetics, Kavira creates a tapestry that tells stories that are nostalgic, comforting, and truly experiential.', 3),
  ('founders-intro', 'OUR FOUNDER', null, null, 4),
  ('founder-1', null, null, null, 5),
  ('card-1', 'SHOP ALL', null, 'Browse our complete collection of handcrafted pieces.', 6),
  ('card-2', 'GIFT SHOP', null, 'Gifting starts with a thought. Explore our range of gifts.', 7),
  ('card-3', 'JOURNAL', null, 'Stories, inspiration, and behind-the-scenes from our studio.', 8);
