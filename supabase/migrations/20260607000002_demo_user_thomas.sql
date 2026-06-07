-- ─────────────────────────────────────────────────────────────────────────────
-- Strong Academy — Demo-User für Showcase (Thomas Drohmann)
-- Migration: 20260607000002_demo_user_thomas
--
-- ENTFERNEN:
--   DELETE FROM auth.users WHERE email = 'thomas@demo.local';
-- ─────────────────────────────────────────────────────────────────────────────

DO $$
DECLARE
  demo_uid UUID := '00000000-dead-beef-0000-000000000002';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'thomas@demo.local') THEN

    INSERT INTO auth.users (
      id, instance_id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_user_meta_data, raw_app_meta_data,
      is_super_admin, confirmation_token, recovery_token,
      email_change_token_new, email_change
    ) VALUES (
      demo_uid,
      '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'thomas@demo.local',
      crypt('StrongAcademy2026!', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"full_name": "Thomas Drohmann"}'::jsonb,
      '{"provider": "email", "providers": ["email"]}'::jsonb,
      false, '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data,
      provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), demo_uid,
      'thomas@demo.local',
      jsonb_build_object('sub', demo_uid::text, 'email', 'thomas@demo.local'),
      'email', NOW(), NOW(), NOW()
    );

    UPDATE public.profiles
    SET leadership_unlocked = true
    WHERE id = demo_uid;

  END IF;
END;
$$;
