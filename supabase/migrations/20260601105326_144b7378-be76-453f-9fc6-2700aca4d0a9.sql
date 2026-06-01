-- 1) Revoke EXECUTE on SECURITY DEFINER functions that should not be callable by clients.
-- Trigger functions (never called directly by clients)
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.generate_order_number() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.decrement_stock_on_order() FROM PUBLIC, anon, authenticated;

-- Edge-function-only helpers
REVOKE EXECUTE ON FUNCTION public.find_customer_by_phone(text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM PUBLIC, anon, authenticated;

-- Note: public.has_role(uuid, app_role) is intentionally left executable by
-- authenticated because RLS policies invoke it in the caller's context.

-- 2) Remove broad SELECT (listing) policies on storage.objects for public buckets.
-- Files remain reachable via the public URL endpoint (which bypasses storage.objects RLS),
-- but clients can no longer enumerate bucket contents.
DROP POLICY IF EXISTS "Product images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Public can view cms images" ON storage.objects;
