-- ─────────────────────────────────────────────────────────────────────────────
-- Strong Academy — Seed Categories + First Lesson
-- Migration: 20260529000007_seed_categories
-- Idempotent: ON CONFLICT DO NOTHING / DO UPDATE
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── Foundation categories ───────────────────────────────────────────────────

insert into public.categories (name, slug, type, tagline, sort_order, is_active)
values
  ('Produktwissen',              'produktwissen',  'foundation', 'Strong OG',              1, true),
  ('Teamaufbau & Führung',       'teamaufbau',     'foundation', 'Leadership',             2, true),
  ('Kommunikation & Kundenaufbau', 'kommunikation', 'foundation', 'Gespräche & Beziehungen', 3, true)
on conflict (slug) do nothing;

-- ─── Library categories ──────────────────────────────────────────────────────

insert into public.categories (name, slug, type, tagline, sort_order, is_active)
values
  ('Gesundheitsgrundlagen',  'gesundheitsgrundlagen',   'library', 'Wissenschaft & Körper',   4, true),
  ('Persönliche Entwicklung', 'persoenliche-entwicklung', 'library', 'Mindset & Wachstum',     5, true),
  ('Digitale Werkzeuge',     'digitale-werkzeuge',      'library', 'Tools & Effizienz',       6, true),
  ('Social Media',           'social-media',            'library', 'Sichtbarkeit & Content',  7, true),
  ('Gewerbe & Steuern',      'gewerbe-steuern',         'library', 'Rechtliches & Finanzen',  8, true)
on conflict (slug) do nothing;

-- ─── Leadership categories ───────────────────────────────────────────────────

insert into public.categories (name, slug, type, tagline, sort_order, is_active)
values
  ('Leadership & Kultur',    'leadership-kultur',     'leadership', 'Grundlagen',           1, true),
  ('Vision & Strategie',     'vision-strategie',      'leadership', 'Langfristiges Denken', 2, true),
  ('Multiplikation',         'multiplikation',        'leadership', 'Systeme & Wachstum',   3, true),
  ('Leadership Psychology',  'leadership-psychology', 'leadership', 'Menschen & Dynamiken', 4, true)
on conflict (slug) do nothing;

-- ─── First lesson: Produktwissen / Was ist Strong OG? ────────────────────────

insert into public.lessons (category_id, title, slug, description, duration_seconds, sort_order, is_published)
select
  c.id,
  'Was ist Strong OG?',
  'was-ist-strong-og',
  'Eine Einführung: Strong OG als hochkonzentriertes, flüssiges Vitalstoffpräparat — was es enthält, wie es hergestellt wird und was es von klassischen Kapselpräparaten unterscheidet.',
  300,
  1,
  true
from public.categories c
where c.slug = 'produktwissen'
on conflict (category_id, slug) do nothing;
