DROP POLICY IF EXISTS "journal_public_read" ON public.journal_posts;
CREATE POLICY "journal_public_read" ON public.journal_posts FOR SELECT TO anon, authenticated USING (published = true);