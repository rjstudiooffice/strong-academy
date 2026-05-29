-- ─────────────────────────────────────────────────────────────────────────────
-- Strong Academy — Lesson Video ID
-- Migration: 20260530000006_lesson_video_id
--
-- Adds video_id (Bunny Stream GUID) to lessons.
-- video_url continues to store the full embed URL (constructed server-side).
-- duration_seconds is populated from Bunny API when a video is selected.
-- No other columns needed: title/thumbnail come from Bunny API on demand.
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.lessons
  add column if not exists video_id text;

comment on column public.lessons.video_id is
  'Bunny Stream video GUID. video_url is derived: iframe.mediadelivery.net/embed/{libraryId}/{video_id}';
