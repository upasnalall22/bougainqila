
-- Re-grant EXECUTE to authenticated — required for RLS policies to work
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;

-- Keep revoked from anon and public (anon can't use it)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM public;
