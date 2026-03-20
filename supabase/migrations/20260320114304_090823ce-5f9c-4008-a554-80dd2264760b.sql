ALTER TABLE public.hero_banners
  ADD COLUMN title_italic boolean NOT NULL DEFAULT false,
  ADD COLUMN title_color text DEFAULT NULL,
  ADD COLUMN title_size text DEFAULT NULL;