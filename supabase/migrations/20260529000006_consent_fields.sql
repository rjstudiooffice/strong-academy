-- ─────────────────────────────────────────────────────────────────────────────
-- Strong Academy — Consent Fields
-- Migration: 20260529000006_consent_fields
-- Adds privacy and terms acceptance timestamps to profiles.
-- Existing users get NULL — handled separately in the UI (Aufgabe 6).
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.profiles
  add column if not exists privacy_accepted_at timestamptz,
  add column if not exists terms_accepted_at   timestamptz;
