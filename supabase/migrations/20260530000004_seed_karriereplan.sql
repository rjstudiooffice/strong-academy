-- ─────────────────────────────────────────────────────────────────────────────
-- Strong Academy — Add Karriereplan Category
-- Migration: 20260530000004_seed_karriereplan
--
-- Karriereplan was in the static data but missing from the DB seed.
-- ─────────────────────────────────────────────────────────────────────────────

insert into public.categories (
  name, slug, type, tagline, description,
  index_label, cover_gradient, cover_image_url, hero_image_url,
  sort_order, is_active
)
values (
  'Karriereplan',
  'karriereplan',
  'library',
  'Karriere & Aufstieg',
  'Verstehe, wie dein Zinzino-Karriereplan aufgebaut ist — welche Meilensteine es gibt, was sie bedeuten und wie du deinen nächsten Schritt gezielt angehen kannst.',
  '09',
  'from-[#8ABBB0] to-[#68998E]',
  '/karriereplan_category_card.png',
  '/karriereplan_hero.png',
  9,
  true
)
on conflict (slug) do nothing;
