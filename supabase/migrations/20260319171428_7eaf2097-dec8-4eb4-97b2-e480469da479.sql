
-- Add best_seller column to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS best_seller boolean NOT NULL DEFAULT false;

-- Homepage content table
CREATE TABLE public.homepage_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL UNIQUE,
  title text,
  subtitle text,
  description text,
  button_text text,
  button_link text,
  image_url text,
  meta_title text,
  meta_description text,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Homepage content viewable by everyone" ON public.homepage_content FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated users can manage homepage content" ON public.homepage_content FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Category content table
CREATE TABLE public.category_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  banner_image_url text,
  meta_title text,
  meta_description text,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.category_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Category content viewable by everyone" ON public.category_content FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated users can manage category content" ON public.category_content FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Journal posts table
CREATE TABLE public.journal_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  body text,
  category text,
  cover_image_url text,
  published boolean NOT NULL DEFAULT false,
  published_at timestamp with time zone,
  meta_title text,
  meta_description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.journal_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published journal posts viewable by everyone" ON public.journal_posts FOR SELECT TO public USING (published = true);
CREATE POLICY "Authenticated users can view all journal posts" ON public.journal_posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage journal posts" ON public.journal_posts FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- User roles table for admin auth
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Add SEO fields to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS meta_title text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS meta_description text;

-- Seed default homepage content
INSERT INTO public.homepage_content (section, title, subtitle, description, button_text, button_link, meta_title, meta_description) VALUES
('hero', 'One of a Kind Clay Creations', 'Handcrafted with Love', 'Unique handmade home decor & accessories, crafted piece by piece with intention.', 'Explore More', '/shop', 'BougainQila — Handcrafted Clay Home Decor', 'BougainQila — Handcrafted clay home decor & accessories. Every piece is one of a kind.'),
('about', 'Made by Hand, Made with Heart', 'Our Story', 'Every piece in our collection is shaped by hand from natural clay — no molds, no mass production. Each windchime, letter, container, and hair accessory carries the subtle imperfections that make handmade art truly special.', 'Learn More About Us →', '/our-story', NULL, NULL)
ON CONFLICT (section) DO NOTHING;

-- Seed default category content
INSERT INTO public.category_content (slug, name, description, meta_title, meta_description) VALUES
('windchimes', 'Clay Windchimes', 'Handcrafted clay windchimes that bring melodic charm to your living spaces.', 'Clay Windchimes — BougenQila', 'Shop handcrafted clay windchimes. Each piece is unique and made with love.'),
('letterings', 'Clay Lettering', 'Personalised clay lettering for your walls and spaces.', 'Clay Lettering — BougenQila', 'Custom clay lettering, hand-shaped to order. Perfect for home decor and gifts.'),
('containers', 'Clay Containers', 'Handmade clay planters, bowls and trinket containers.', 'Clay Containers — BougenQila', 'Unique handmade clay containers, planters and bowls for your home.'),
('hair-accents', 'Hair Accessories', 'One-of-a-kind clay hair accessories and jooda sticks.', 'Clay Hair Accessories — BougenQila', 'Handcrafted clay hair accessories. Unique jooda sticks and hair pins.'),
('gift-set', 'Gift Sets', 'Curated gift sets of handcrafted clay pieces.', 'Gift Sets — BougenQila', 'Thoughtful handmade clay gift sets for every occasion.')
ON CONFLICT (slug) DO NOTHING;
