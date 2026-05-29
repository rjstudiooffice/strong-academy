-- ─────────────────────────────────────────────────────────────────────────────
-- Strong Academy — Media Storage Bucket
-- Migration: 20260530000002_storage_bucket
-- ─────────────────────────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  52428800,   -- 50 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

-- Public read for everyone
create policy "media_public_read"
  on storage.objects
  for select
  to public
  using (bucket_id = 'media');

-- Admin can upload
create policy "media_admin_insert"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'media' and public.is_admin());

-- Admin can update
create policy "media_admin_update"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'media' and public.is_admin());

-- Admin can delete
create policy "media_admin_delete"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'media' and public.is_admin());
