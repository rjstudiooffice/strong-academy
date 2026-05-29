-- ─────────────────────────────────────────────────────────────────────────────
-- Strong Academy — Area Slug + Video Prefix
-- Migration: 20260530000005_area_slug_video_prefix
--
-- area_slug: derived from type (academy / leadership / library)
--   Lets the lesson form know which top-level area a category belongs to
--   without re-deriving it from type everywhere.
--
-- video_prefix: explicit naming prefix for future Bunny Stream filtering.
--   When the admin picks a category, the Bunny integration will do:
--     api.listVideos().filter(v => v.title.startsWith(category.video_prefix))
--   No guessing, no name parsing required.
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.categories
  add column if not exists area_slug    text,
  add column if not exists video_prefix text;

-- ─── area_slug: derived from type ────────────────────────────────────────────

update public.categories set area_slug = 'academy'    where type = 'foundation';
update public.categories set area_slug = 'leadership'  where type = 'leadership';
update public.categories set area_slug = 'library'     where type = 'library';

-- ─── video_prefix: Academy foundation categories ──────────────────────────────

update public.categories set video_prefix = 'academy_produktwissen_'  where slug = 'produktwissen';
update public.categories set video_prefix = 'academy_teamaufbau_'     where slug = 'teamaufbau';
update public.categories set video_prefix = 'academy_kommunikation_'  where slug = 'kommunikation';

-- ─── video_prefix: Leadership categories ─────────────────────────────────────

update public.categories set video_prefix = 'leadership_kultur_'          where slug = 'leadership-kultur';
update public.categories set video_prefix = 'leadership_vision_'          where slug = 'vision-strategie';
update public.categories set video_prefix = 'leadership_multiplikation_'  where slug = 'multiplikation';
update public.categories set video_prefix = 'leadership_psychology_'      where slug = 'leadership-psychology';

-- Library categories intentionally have no video_prefix (null) — unaffected by this refactor.

-- ─── Index for future Bunny filtering queries ─────────────────────────────────
-- When filtering: WHERE video_prefix = 'academy_produktwissen_'
create index if not exists idx_categories_area_slug    on public.categories(area_slug);
create index if not exists idx_categories_video_prefix on public.categories(video_prefix);
