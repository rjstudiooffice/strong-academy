-- ─────────────────────────────────────────────────────────────────────────────
-- Strong Academy — Resources Table Update
-- Migration: 20260530000000_resources_update
--
-- Adds file_type, file_size, sort_order, is_active to resources table.
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.resources
  add column if not exists file_type  text,
  add column if not exists file_size  text,
  add column if not exists sort_order integer not null default 0,
  add column if not exists is_active  boolean not null default true;

create index if not exists idx_resources_sort_order on public.resources(sort_order);
