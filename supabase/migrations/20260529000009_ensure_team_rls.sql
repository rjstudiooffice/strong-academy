-- ─────────────────────────────────────────────────────────────────────────────
-- Strong Academy — Ensure Team RLS Policy
-- Migration: 20260529000009_ensure_team_rls
--
-- Idempotent: creates profiles_select_sponsored only if it doesn't exist.
-- This policy was in migration 04, but may not have been applied to the
-- live instance — this migration guarantees it is present.
-- ─────────────────────────────────────────────────────────────────────────────

do $outer$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename  = 'profiles'
      and policyname = 'profiles_select_sponsored'
  ) then
    create policy "profiles_select_sponsored"
      on public.profiles
      for select
      to authenticated
      using (auth.uid() = sponsor_id);
  end if;
end;
$outer$;
