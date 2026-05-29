-- ─────────────────────────────────────────────────────────────────────────────
-- Strong Academy — RLS Policies
-- Migration: 20260529000002_rls_policies
-- Run in Supabase Dashboard → SQL Editor
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── PROFILES ────────────────────────────────────────────────────────────────

create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ─── CATEGORIES + LESSONS + LESSON FILES ─────────────────────────────────────
-- All authenticated users can read published content

create policy "categories_select_authenticated"
  on public.categories
  for select
  to authenticated
  using (is_active = true);

create policy "lessons_select_authenticated"
  on public.lessons
  for select
  to authenticated
  using (is_published = true);

create policy "lesson_files_select_authenticated"
  on public.lesson_files
  for select
  to authenticated
  using (true);

-- ─── RESOURCES ───────────────────────────────────────────────────────────────

create policy "resources_select_authenticated"
  on public.resources
  for select
  to authenticated
  using (true);

-- ─── LESSON PROGRESS ─────────────────────────────────────────────────────────

create policy "lesson_progress_select_own"
  on public.lesson_progress
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "lesson_progress_insert_own"
  on public.lesson_progress
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "lesson_progress_update_own"
  on public.lesson_progress
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─── LEADERSHIP UNLOCKS ──────────────────────────────────────────────────────

create policy "leadership_unlocks_select_own"
  on public.leadership_unlocks
  for select
  to authenticated
  using (auth.uid() = user_id);

-- ─── ADMIN SETTINGS ──────────────────────────────────────────────────────────
-- All authenticated users can read settings (needed for leadership threshold etc.)

create policy "admin_settings_select_authenticated"
  on public.admin_settings
  for select
  to authenticated
  using (true);
