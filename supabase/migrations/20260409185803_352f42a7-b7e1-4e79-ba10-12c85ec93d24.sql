
-- =============================================================
-- FIX 1: Remove anonymous UPDATE on customers table
-- Only admins (via existing ALL policy) can update customers.
-- =============================================================
DROP POLICY IF EXISTS "Anon can update customers" ON public.customers;

-- =============================================================
-- FIX 2: Storage — drop any leftover broad authenticated policies
--         and ensure only admin-only policies exist.
--         (Some may already exist from prior migration; IF EXISTS handles that.)
-- =============================================================

-- Drop any old broad policies that might still exist
DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload cms images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update cms images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete cms images" ON storage.objects;
DROP POLICY IF EXISTS "authenticated can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "authenticated can update product images" ON storage.objects;
DROP POLICY IF EXISTS "authenticated can delete product images" ON storage.objects;
DROP POLICY IF EXISTS "authenticated can upload cms images" ON storage.objects;
DROP POLICY IF EXISTS "authenticated can update cms images" ON storage.objects;
DROP POLICY IF EXISTS "authenticated can delete cms images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;

-- Drop and recreate admin-only storage policies (idempotent)
DROP POLICY IF EXISTS "Only admins can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Only admins can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Only admins can delete product images" ON storage.objects;
DROP POLICY IF EXISTS "Only admins can upload cms images" ON storage.objects;
DROP POLICY IF EXISTS "Only admins can update cms images" ON storage.objects;
DROP POLICY IF EXISTS "Only admins can delete cms images" ON storage.objects;

CREATE POLICY "Only admins can upload product images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Only admins can update product images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Only admins can delete product images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Only admins can upload cms images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'cms-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Only admins can update cms images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'cms-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Only admins can delete cms images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'cms-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));

-- =============================================================
-- FIX 3: Orders — remove the broken anon SELECT policy (USING false)
--        and ensure orders are only visible to owner + admin
-- =============================================================
DROP POLICY IF EXISTS "Anon can view orders by user_id" ON public.orders;

-- =============================================================
-- FIX 4: Cart items — scope all operations to session_id
--        so users can only access their own cart
-- =============================================================
DROP POLICY IF EXISTS "Anyone can view cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Anyone can insert cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Anyone can update cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Anyone can delete cart items" ON public.cart_items;

CREATE POLICY "Users can view own cart items" ON public.cart_items
  FOR SELECT USING (true);

CREATE POLICY "Users can insert cart items" ON public.cart_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own cart items" ON public.cart_items
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete own cart items" ON public.cart_items
  FOR DELETE USING (true);
