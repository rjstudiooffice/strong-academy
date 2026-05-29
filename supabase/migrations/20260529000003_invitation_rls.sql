-- ─────────────────────────────────────────────────────────────────────────────
-- Strong Academy — Invitation RLS Policies
-- Migration: 20260529000003_invitation_rls
-- Token validation + marking used runs via service role (bypasses RLS).
-- ─────────────────────────────────────────────────────────────────────────────

-- Authenticated users can create invitations for themselves
create policy "invitations_insert_own"
  on public.invitations
  for insert
  to authenticated
  with check (auth.uid() = created_by);

-- Authenticated users can view their own created invitations
create policy "invitations_select_own"
  on public.invitations
  for select
  to authenticated
  using (auth.uid() = created_by);
