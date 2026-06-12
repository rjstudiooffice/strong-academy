-- ─────────────────────────────────────────────────────────────────────────────
-- Strong Academy — Resources Storage Bucket
-- Migration: 20260612000000_resources_bucket
-- Separate bucket for document files (PDF, DOCX, PPTX, XLSX, ZIP, images)
-- ─────────────────────────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'resources',
  'resources',
  true,
  52428800,   -- 50 MB
  array[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'application/zip',
    'application/x-zip-compressed',
    'image/jpeg',
    'image/png'
  ]
)
on conflict (id) do nothing;

-- Public read for everyone
create policy "resources_public_read"
  on storage.objects
  for select
  to public
  using (bucket_id = 'resources');

-- Admin can upload
create policy "resources_admin_insert"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'resources' and public.is_admin());

-- Admin can update
create policy "resources_admin_update"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'resources' and public.is_admin());

-- Admin can delete
create policy "resources_admin_delete"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'resources' and public.is_admin());
