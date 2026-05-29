-- ─────────────────────────────────────────────────────────────────────────────
-- Strong Academy — Remove Partner RLS Policy
-- Migration: 20260529000005_remove_partner_rls
-- Allows sponsors to set sponsor_id = NULL on their direct partners.
-- ─────────────────────────────────────────────────────────────────────────────

-- Sponsor can update a partner's profile, but only to clear the sponsor_id.
-- using:     can only touch rows where I am currently the sponsor
-- with check: after update, sponsor_id must be NULL (can only sever, not reassign)
create policy "profiles_remove_partner"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = sponsor_id)
  with check (sponsor_id is null);
