-- ─────────────────────────────────────────────────────────────────────────────
-- Strong Academy — Initial Schema
-- Migration: 20260529000000_initial_schema
-- Run via: Supabase Dashboard → SQL Editor, or supabase db push
-- ─────────────────────────────────────────────────────────────────────────────


-- ─── ENUM TYPES ──────────────────────────────────────────────────────────────

create type public.user_role as enum ('admin', 'partner');

create type public.category_type as enum ('foundation', 'library', 'leadership');


-- ─── HELPER: auto-update updated_at ──────────────────────────────────────────

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- ─────────────────────────────────────────────────────────────────────────────
-- PROFILES
-- One row per auth.users entry.
-- sponsor_id = who invited this partner (self-referential tree).
-- leadership_unlocked caches the computed unlock state for fast reads.
-- ─────────────────────────────────────────────────────────────────────────────

create table public.profiles (
  id                  uuid             primary key references auth.users(id) on delete cascade,
  email               text             not null unique,
  full_name           text,
  avatar_url          text,
  role                public.user_role not null default 'partner',
  sponsor_id          uuid             references public.profiles(id) on delete set null,
  leadership_unlocked boolean          not null default false,
  is_active           boolean          not null default true,
  created_at          timestamptz      not null default now(),
  updated_at          timestamptz      not null default now()
);

create index idx_profiles_sponsor_id on public.profiles(sponsor_id);
create index idx_profiles_role       on public.profiles(role);

create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

alter table public.profiles enable row level security;


-- ─────────────────────────────────────────────────────────────────────────────
-- INVITATIONS
-- Token-based invite system. One token = one registration slot.
-- used must be true iff used_by is set.
-- ─────────────────────────────────────────────────────────────────────────────

create table public.invitations (
  id          uuid        primary key default gen_random_uuid(),
  token       text        not null unique,
  created_by  uuid        not null references public.profiles(id) on delete cascade,
  used_by     uuid        references public.profiles(id) on delete set null,
  used        boolean     not null default false,
  expires_at  timestamptz not null,
  created_at  timestamptz not null default now(),

  constraint chk_invitation_consistency check (
    (used = false and used_by is null)
    or
    (used = true  and used_by is not null)
  )
);

create index idx_invitations_created_by on public.invitations(created_by);
create index idx_invitations_used       on public.invitations(used);
create index idx_invitations_expires_at on public.invitations(expires_at);

alter table public.invitations enable row level security;


-- ─────────────────────────────────────────────────────────────────────────────
-- CATEGORIES
-- Covers academy (foundation + library) and leadership.
-- index_label = display number e.g. "01", "02".
-- cover_gradient = tailwind fallback when image is absent.
-- ─────────────────────────────────────────────────────────────────────────────

create table public.categories (
  id              uuid                 primary key default gen_random_uuid(),
  name            text                 not null,
  slug            text                 not null unique,
  type            public.category_type not null,
  tagline         text,
  description     text,
  index_label     text,
  cover_gradient  text,
  cover_image_url text,
  hero_image_url  text,
  sort_order      integer              not null default 0,
  is_active       boolean              not null default true,
  created_at      timestamptz          not null default now()
);

create index idx_categories_type       on public.categories(type);
create index idx_categories_sort_order on public.categories(type, sort_order);

alter table public.categories enable row level security;


-- ─────────────────────────────────────────────────────────────────────────────
-- LESSONS
-- slug is unique within its category (not globally).
-- duration_seconds enables precise progress math; display formatting is in-app.
-- cover_gradient = tailwind fallback when thumbnail absent.
-- ─────────────────────────────────────────────────────────────────────────────

create table public.lessons (
  id               uuid        primary key default gen_random_uuid(),
  category_id      uuid        not null references public.categories(id) on delete cascade,
  title            text        not null,
  slug             text        not null,
  description      text,
  video_url        text,
  thumbnail_url    text,
  cover_gradient   text,
  duration_seconds integer     check (duration_seconds is null or duration_seconds > 0),
  sort_order       integer     not null default 0,
  is_published     boolean     not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),

  unique(category_id, slug)
);

create index idx_lessons_category_id   on public.lessons(category_id);
create index idx_lessons_is_published  on public.lessons(is_published);
create index idx_lessons_category_sort on public.lessons(category_id, sort_order);

create trigger trg_lessons_updated_at
  before update on public.lessons
  for each row execute function public.handle_updated_at();

alter table public.lessons enable row level security;


-- ─────────────────────────────────────────────────────────────────────────────
-- LESSON PROGRESS
-- One row per (user, lesson). updated_at tracks last video interaction.
-- completed_at must be set when completed = true (enforced by constraint).
-- ─────────────────────────────────────────────────────────────────────────────

create table public.lesson_progress (
  id               uuid        primary key default gen_random_uuid(),
  user_id          uuid        not null references public.profiles(id) on delete cascade,
  lesson_id        uuid        not null references public.lessons(id) on delete cascade,
  progress_percent integer     not null default 0
                               check (progress_percent between 0 and 100),
  completed        boolean     not null default false,
  completed_at     timestamptz,
  updated_at       timestamptz not null default now(),

  unique(user_id, lesson_id),
  constraint chk_completed_at check (
    completed = false or completed_at is not null
  )
);

create index idx_lesson_progress_user      on public.lesson_progress(user_id);
create index idx_lesson_progress_lesson    on public.lesson_progress(lesson_id);
create index idx_lesson_progress_user_done on public.lesson_progress(user_id, completed);

create trigger trg_lesson_progress_updated_at
  before update on public.lesson_progress
  for each row execute function public.handle_updated_at();

alter table public.lesson_progress enable row level security;


-- ─────────────────────────────────────────────────────────────────────────────
-- LESSON FILES
-- Downloadable attachments attached to a lesson (PDFs, PPTX, etc.).
-- ─────────────────────────────────────────────────────────────────────────────

create table public.lesson_files (
  id          uuid        primary key default gen_random_uuid(),
  lesson_id   uuid        not null references public.lessons(id) on delete cascade,
  title       text        not null,
  file_url    text        not null,
  sort_order  integer     not null default 0,
  created_at  timestamptz not null default now()
);

create index idx_lesson_files_lesson_id on public.lesson_files(lesson_id);

alter table public.lesson_files enable row level security;


-- ─────────────────────────────────────────────────────────────────────────────
-- RESOURCES
-- Standalone downloadable materials (not tied to a specific lesson).
-- category is a free-text grouping key (e.g. "produktinformationen").
-- ─────────────────────────────────────────────────────────────────────────────

create table public.resources (
  id          uuid        primary key default gen_random_uuid(),
  title       text        not null,
  description text,
  category    text,
  file_url    text        not null,
  created_at  timestamptz not null default now()
);

create index idx_resources_category on public.resources(category);

alter table public.resources enable row level security;


-- ─────────────────────────────────────────────────────────────────────────────
-- LEADERSHIP UNLOCKS
-- Permanent audit record of when a partner earned Leadership access.
-- profiles.leadership_unlocked is the fast-read cache; this is the source of truth.
-- ─────────────────────────────────────────────────────────────────────────────

create table public.leadership_unlocks (
  user_id     uuid        primary key references public.profiles(id) on delete cascade,
  unlocked    boolean     not null default false,
  unlocked_at timestamptz,

  constraint chk_unlocked_at check (
    unlocked = false or unlocked_at is not null
  )
);

alter table public.leadership_unlocks enable row level security;


-- ─────────────────────────────────────────────────────────────────────────────
-- ADMIN SETTINGS
-- Key/value store for runtime configuration (no deploys needed for tuning).
-- ─────────────────────────────────────────────────────────────────────────────

create table public.admin_settings (
  key        text        primary key,
  value      text        not null,
  updated_at timestamptz not null default now()
);

insert into public.admin_settings (key, value) values
  ('leadership_required_percent', '100');

create trigger trg_admin_settings_updated_at
  before update on public.admin_settings
  for each row execute function public.handle_updated_at();

alter table public.admin_settings enable row level security;
