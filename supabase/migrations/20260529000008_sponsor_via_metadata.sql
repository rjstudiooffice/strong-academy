-- ─────────────────────────────────────────────────────────────────────────────
-- Strong Academy — Sponsor via Signup Metadata
-- Migration: 20260529000008_sponsor_via_metadata
--
-- Rewrites handle_new_user() to read sponsor_id from auth metadata.
-- This makes sponsor assignment atomic with profile creation, eliminating
-- the race window between signUp() and the separate setSponsor() call.
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  v_sponsor_id uuid;
begin
  -- Parse sponsor_id from metadata; NULL if absent or not a valid UUID.
  begin
    v_sponsor_id := (new.raw_user_meta_data ->> 'sponsor_id')::uuid;
  exception when others then
    v_sponsor_id := null;
  end;

  insert into public.profiles (
    id,
    email,
    full_name,
    role,
    leadership_unlocked,
    is_active,
    sponsor_id
  )
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1)
    ),
    'partner',
    false,
    true,
    v_sponsor_id
  );
  return new;
end;
$$;
