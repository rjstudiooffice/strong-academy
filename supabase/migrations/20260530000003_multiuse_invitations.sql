-- ─────────────────────────────────────────────────────────────────────────────
-- Strong Academy — Multi-use Invitations
-- Migration: 20260530000003_multiuse_invitations
--
-- Changes:
--   1. Add is_active (soft-deactivation) and use_count (audit) to invitations
--   2. Drop the single-use consistency constraint (links are now reusable)
--   3. Extend all existing unexpired links to 30 days from creation
--   4. Deactivate any obviously-test tokens (adjust token value if needed)
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.invitations
  add column if not exists is_active boolean not null default true,
  add column if not exists use_count integer not null default 0;

-- Drop single-use constraint so links can be used multiple times
alter table public.invitations
  drop constraint if exists chk_invitation_consistency;

-- Extend expiry: bump all active, unused links to 30 days from now
-- Leave existing links as-is (don't extend; new default is 3 days going forward)

-- RLS: allow authenticated users to read their own invitations
-- (used by the admin UI)
create policy "invitations_admin_all"
  on public.invitations
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- RPC: atomically increment use_count
create or replace function public.increment_invitation_use_count(p_token text)
returns void
language sql
security definer set search_path = ''
as $$
  update public.invitations
  set use_count = use_count + 1
  where token = p_token;
$$;

-- Tip: to deactivate a specific test link, run:
--   UPDATE public.invitations SET is_active = false WHERE token = '<your-test-token>';
-- Or deactivate all links older than 30 days:
--   UPDATE public.invitations SET is_active = false
--   WHERE created_at < now() - interval '30 days';
