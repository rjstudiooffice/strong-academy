-- ─────────────────────────────────────────────────────────────────────────────
-- Strong Academy — Team RLS Policy
-- Migration: 20260529000004_team_rls
-- Allows users to see profiles where they are set as sponsor.
-- ─────────────────────────────────────────────────────────────────────────────

create policy "profiles_select_sponsored"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = sponsor_id);
