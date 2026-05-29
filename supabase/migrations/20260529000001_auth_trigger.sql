-- ─────────────────────────────────────────────────────────────────────────────
-- Strong Academy — Auth → Profiles Trigger
-- Migration: 20260529000001_auth_trigger
--
-- Fires after every INSERT on auth.users.
-- Creates the matching public.profiles row automatically.
-- sponsor_id stays NULL here — set during invitation flow (future step).
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.handle_new_user()
returns trigger
language plpgsql
-- security definer: function runs as owner (postgres), not as the signing-up user.
-- set search_path = '': prevents search_path injection; all refs must be schema-qualified.
security definer set search_path = ''
as $$
begin
  insert into public.profiles (
    id,
    email,
    full_name,
    role,
    leadership_unlocked,
    is_active
  )
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1)   -- fallback: use email prefix until user sets name
    ),
    'partner',
    false,
    true
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
