-- ─────────────────────────────────────────────────────────────────────────────
-- Strong Academy — Welcome Video Gate
-- Migration: 20260626000000_welcome_video
-- Every newly registered user must watch the welcome video before using the app.
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.profiles
  add column welcome_video_seen    boolean     not null default false,
  add column welcome_video_seen_at timestamptz;

-- Backfill: existing users must not be retroactively gated by this feature.
update public.profiles
  set welcome_video_seen = true, welcome_video_seen_at = now();

-- Singleton settings row for global app config (currently just the welcome video).
create table public.app_settings (
  id                             boolean     primary key default true check (id),
  welcome_video_id               text,
  welcome_video_url              text,
  welcome_video_duration_seconds integer,
  updated_at                     timestamptz not null default now()
);

insert into public.app_settings (id) values (true);

create trigger trg_app_settings_updated_at
  before update on public.app_settings
  for each row execute function public.handle_updated_at();

alter table public.app_settings enable row level security;

create policy "app_settings_select_authenticated"
  on public.app_settings
  for select
  to authenticated
  using (true);

create policy "app_settings_admin_all"
  on public.app_settings
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
