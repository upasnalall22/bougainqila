-- Drop the overly permissive customers insert policy
DROP POLICY IF EXISTS "customers_insert_authenticated" ON public.customers;

-- Add a service_role-only insert policy for customers (used by create-order edge function)
CREATE POLICY "customers_insert_service_role"
ON public.customers
FOR INSERT
TO public
WITH CHECK (auth.role() = 'service_role');
