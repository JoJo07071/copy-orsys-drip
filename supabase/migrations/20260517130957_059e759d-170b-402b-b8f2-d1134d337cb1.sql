
-- Make views security_invoker so they respect the caller's RLS
alter view public.deal_stats set (security_invoker = true);
alter view public.user_points set (security_invoker = true);

-- Revoke direct EXECUTE on security-definer functions (RLS evaluation still works)
revoke execute on function public.has_role(uuid, public.app_role) from anon, authenticated, public;
revoke execute on function public.handle_new_user() from anon, authenticated, public;

-- Restrict bucket listing: only list files inside your own folder
drop policy "deal images public read" on storage.objects;
create policy "deal images public read individual"
  on storage.objects for select
  using (
    bucket_id = 'deal-images'
    and (
      auth.uid()::text = (storage.foldername(name))[1]
      or auth.role() = 'anon' is null  -- never true; ensures listing requires owner
    )
  );

-- Actually: we want anyone to be able to READ individual files (since the bucket is public)
-- but not LIST. Public buckets serve files via direct URL regardless of select policy.
-- So we can keep select policy restricted to owner without breaking public image URLs.
