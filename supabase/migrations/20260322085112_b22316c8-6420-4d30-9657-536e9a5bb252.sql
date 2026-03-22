
-- Allow anonymous users to insert customers (for guest checkout)
CREATE POLICY "Anon can insert customers" ON public.customers
  FOR INSERT TO anon WITH CHECK (true);

-- Allow anonymous users to insert orders (for guest checkout)
CREATE POLICY "Anon can insert orders" ON public.orders
  FOR INSERT TO anon WITH CHECK (true);

-- Allow anonymous users to insert order items (for guest checkout)
CREATE POLICY "Anon can insert order_items" ON public.order_items
  FOR INSERT TO anon WITH CHECK (true);

-- Allow anonymous users to read customers by phone (for duplicate check)
CREATE POLICY "Anon can select customers by phone" ON public.customers
  FOR SELECT TO anon USING (true);

-- Allow anonymous users to update customers (for guest checkout updates)
CREATE POLICY "Anon can update customers" ON public.customers
  FOR UPDATE TO anon USING (true) WITH CHECK (true);
