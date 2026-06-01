-- Remove RLS policies that allow authenticated users to bypass server-side validation
DROP POLICY IF EXISTS "orders_insert_authenticated" ON public.orders;
DROP POLICY IF EXISTS "customers_insert_authenticated" ON public.customers;

-- Add admin-only insert for customers (service role policy already exists for edge function)
CREATE POLICY "customers_insert_admin"
ON public.customers
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));