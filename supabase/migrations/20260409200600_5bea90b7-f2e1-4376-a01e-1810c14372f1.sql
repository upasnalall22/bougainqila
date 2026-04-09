
-- ============================================================
-- ERROR 1: CUSTOMERS — drop all, recreate strict policies
-- ============================================================
DROP POLICY IF EXISTS "Admins can manage customers" ON public.customers;
DROP POLICY IF EXISTS "Anon can insert customers" ON public.customers;
DROP POLICY IF EXISTS "Anon can update customers" ON public.customers;

-- SELECT: admin only
CREATE POLICY "customers_select_admin"
  ON public.customers FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- INSERT: authenticated users only (guest checkout must go through authenticated session or edge function)
CREATE POLICY "customers_insert_authenticated"
  ON public.customers FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- UPDATE: admin only (no user_id column on customers table for self-update)
CREATE POLICY "customers_update_admin"
  ON public.customers FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- DELETE: admin only
CREATE POLICY "customers_delete_admin"
  ON public.customers FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- ============================================================
-- ERROR 2 + 3: ORDERS — drop conflicting INSERT & SELECT, recreate
-- ============================================================

-- Drop all existing INSERT policies
DROP POLICY IF EXISTS "Anon can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON public.orders;
DROP POLICY IF EXISTS "orders_insert" ON public.orders;

-- Drop all existing SELECT policies
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "orders_select" ON public.orders;

-- INSERT: authenticated only, must be pending
CREATE POLICY "orders_insert_authenticated"
  ON public.orders FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND status = 'pending'::order_status
    AND payment_status = 'pending'
  );

-- SELECT: owner or admin only, zero anonymous access
CREATE POLICY "orders_select_owner_or_admin"
  ON public.orders FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR public.has_role(auth.uid(), 'admin'::app_role)
  );

-- Also drop the anon INSERT on order_items to match
DROP POLICY IF EXISTS "Anon can insert order_items" ON public.order_items;
DROP POLICY IF EXISTS "Anon can insert order items" ON public.order_items;
