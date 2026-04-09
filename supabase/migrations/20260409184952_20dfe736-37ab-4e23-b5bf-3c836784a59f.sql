
-- Drop all existing write policies on storage.objects for product-images and cms-images
-- We need to find and replace them with admin-only policies

-- Remove existing permissive write policies for product-images bucket
DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete product images" ON storage.objects;
DROP POLICY IF EXISTS "authenticated can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "authenticated can update product images" ON storage.objects;
DROP POLICY IF EXISTS "authenticated can delete product images" ON storage.objects;

-- Remove existing permissive write policies for cms-images bucket
DROP POLICY IF EXISTS "Authenticated users can upload cms images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update cms images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete cms images" ON storage.objects;
DROP POLICY IF EXISTS "authenticated can upload cms images" ON storage.objects;
DROP POLICY IF EXISTS "authenticated can update cms images" ON storage.objects;
DROP POLICY IF EXISTS "authenticated can delete cms images" ON storage.objects;

-- Also try generic names
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to own folder" ON storage.objects;

-- Create admin-only INSERT policies
CREATE POLICY "Only admins can upload product images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'product-images'
    AND public.has_role(auth.uid(), 'admin'::public.app_role)
  );

CREATE POLICY "Only admins can upload cms images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'cms-images'
    AND public.has_role(auth.uid(), 'admin'::public.app_role)
  );

-- Create admin-only UPDATE policies
CREATE POLICY "Only admins can update product images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'product-images'
    AND public.has_role(auth.uid(), 'admin'::public.app_role)
  );

CREATE POLICY "Only admins can update cms images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'cms-images'
    AND public.has_role(auth.uid(), 'admin'::public.app_role)
  );

-- Create admin-only DELETE policies
CREATE POLICY "Only admins can delete product images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'product-images'
    AND public.has_role(auth.uid(), 'admin'::public.app_role)
  );

CREATE POLICY "Only admins can delete cms images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'cms-images'
    AND public.has_role(auth.uid(), 'admin'::public.app_role)
  );
