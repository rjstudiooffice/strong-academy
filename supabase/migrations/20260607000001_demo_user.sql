-- ─────────────────────────────────────────────────────────────────────────────
-- Strong Academy — Demo-User für Showcase (Hannes Sommer)
-- Migration: 20260607000001_demo_user
--
-- Erstellt einen Demo-Account für Showcase-Zwecke.
-- Kein Admin-Zugriff · Leadership freigeschaltet · Kein Einladungsprozess.
--
-- ENTFERNEN: Diese Migration rückgängig machen mit:
--   DELETE FROM auth.users WHERE email = 'hannes@demo.local';
--   (Cascade löscht Profile, Identities automatisch)
-- ─────────────────────────────────────────────────────────────────────────────

DO $$
DECLARE
  demo_uid UUID := '00000000-dead-beef-0000-000000000001';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'hannes@demo.local') THEN

    -- Auth-User anlegen (email bereits bestätigt, kein E-Mail-Versand)
    INSERT INTO auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_user_meta_data,
      raw_app_meta_data,
      is_super_admin,
      confirmation_token,
      recovery_token,
      email_change_token_new,
      email_change
    ) VALUES (
      demo_uid,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'hannes@demo.local',
      crypt('StrongAcademy2026!', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      '{"full_name": "Hannes Sommer"}'::jsonb,
      '{"provider": "email", "providers": ["email"]}'::jsonb,
      false,
      '',
      '',
      '',
      ''
    );

    -- Identity für E-Mail-Login (GoTrue-Pflicht)
    INSERT INTO auth.identities (
      id,
      user_id,
      provider_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      demo_uid,
      'hannes@demo.local',
      jsonb_build_object('sub', demo_uid::text, 'email', 'hannes@demo.local'),
      'email',
      NOW(),
      NOW(),
      NOW()
    );

    -- Trigger hat profiles-Zeile erzeugt; Leadership sofort freischalten
    UPDATE public.profiles
    SET leadership_unlocked = true
    WHERE id = demo_uid;

  END IF;
END;
$$;
