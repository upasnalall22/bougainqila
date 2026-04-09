
-- =============================================
-- 1. FIX PRIVILEGE ESCALATION ON user_roles
-- =============================================
-- Ensure no authenticated user can write to user_roles (only service_role/admin)
CREATE POLICY "Only admins can insert roles" ON public.user_roles
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update roles" ON public.user_roles
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete roles" ON public.user_roles
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- =============================================
-- 2. RESTRICT CMS WRITE POLICIES TO ADMIN ONLY
-- =============================================

-- homepage_content
DROP POLICY IF EXISTS "Authenticated users can manage homepage content" ON public.homepage_content;
CREATE POLICY "Admins can manage homepage content" ON public.homepage_content
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- category_content
DROP POLICY IF EXISTS "Authenticated users can manage category content" ON public.category_content;
CREATE POLICY "Admins can manage category content" ON public.category_content
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- hero_banners
DROP POLICY IF EXISTS "Authenticated users can manage hero banners" ON public.hero_banners;
CREATE POLICY "Admins can manage hero banners" ON public.hero_banners
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- our_story_sections
DROP POLICY IF EXISTS "Authenticated users can manage our story sections" ON public.our_story_sections;
CREATE POLICY "Admins can manage our story sections" ON public.our_story_sections
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- insta_feed_items
DROP POLICY IF EXISTS "Authenticated users can manage insta feed" ON public.insta_feed_items;
CREATE POLICY "Admins can manage insta feed" ON public.insta_feed_items
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- journal_posts
DROP POLICY IF EXISTS "Authenticated users can manage journal posts" ON public.journal_posts;
DROP POLICY IF EXISTS "Authenticated users can view all journal posts" ON public.journal_posts;
CREATE POLICY "Admins can manage journal posts" ON public.journal_posts
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- journal_post_images
DROP POLICY IF EXISTS "Authenticated users can manage journal post images" ON public.journal_post_images;
CREATE POLICY "Admins can manage journal post images" ON public.journal_post_images
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- products
DROP POLICY IF EXISTS "Authenticated users can insert products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON public.products;
CREATE POLICY "Admins can insert products" ON public.products
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update products" ON public.products
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete products" ON public.products
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- product_images
DROP POLICY IF EXISTS "Authenticated users can insert product images" ON public.product_images;
DROP POLICY IF EXISTS "Authenticated users can update product images" ON public.product_images;
DROP POLICY IF EXISTS "Authenticated users can delete product images" ON public.product_images;
CREATE POLICY "Admins can insert product images" ON public.product_images
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update product images" ON public.product_images
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete product images" ON public.product_images
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- product_reviews (admin manage, public can still insert)
DROP POLICY IF EXISTS "Authenticated can manage reviews" ON public.product_reviews;
CREATE POLICY "Admins can manage reviews" ON public.product_reviews
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- =============================================
-- 3. FIX CUSTOMERS ANON SELECT EXPOSURE
-- =============================================
-- Create a secure function for phone lookup (used by guest checkout)
CREATE OR REPLACE FUNCTION public.find_customer_by_phone(_phone text)
RETURNS TABLE(id uuid)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT c.id FROM public.customers c WHERE c.phone = _phone LIMIT 1;
$$;

-- Remove the overly broad anon SELECT
DROP POLICY IF EXISTS "Anon can select customers by phone" ON public.customers;

-- =============================================
-- 4. RESTRICT ORDERS/ORDER_ITEMS WRITE TO ADMIN
-- =============================================
DROP POLICY IF EXISTS "Authenticated users can manage orders" ON public.orders;
CREATE POLICY "Admins can manage orders" ON public.orders
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Authenticated users can still insert their own orders
CREATE POLICY "Users can insert own orders" ON public.orders
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Authenticated users can manage order items" ON public.order_items;
CREATE POLICY "Admins can manage order items" ON public.order_items
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Authenticated users can insert order items for their own orders
CREATE POLICY "Users can insert own order items" ON public.order_items
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id AND o.user_id = auth.uid()
    )
  );

-- =============================================
-- 5. RESTRICT CUSTOMERS WRITE TO ADMIN (keep anon insert/update for checkout)
-- =============================================
DROP POLICY IF EXISTS "Authenticated users can manage customers" ON public.customers;
DROP POLICY IF EXISTS "Customers viewable by authenticated" ON public.customers;
CREATE POLICY "Admins can manage customers" ON public.customers
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
