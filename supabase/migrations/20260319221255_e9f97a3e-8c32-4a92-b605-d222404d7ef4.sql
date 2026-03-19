-- Create a public storage bucket for CMS images
INSERT INTO storage.buckets (id, name, public)
VALUES ('cms-images', 'cms-images', true);

-- Allow authenticated users to upload to cms-images
CREATE POLICY "Authenticated users can upload cms images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'cms-images');

-- Allow authenticated users to update cms images
CREATE POLICY "Authenticated users can update cms images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'cms-images');

-- Allow authenticated users to delete cms images
CREATE POLICY "Authenticated users can delete cms images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'cms-images');

-- Allow public read access to cms images
CREATE POLICY "Public can view cms images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'cms-images');