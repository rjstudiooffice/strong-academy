-- ─────────────────────────────────────────────────────────────────────────────
-- Strong Academy — Category Metadata Seed + Admin RLS
-- Migration: 20260530000001_category_metadata_and_admin_rls
--
-- 1. Seeds cover_gradient, description, index_label, hero_image_url,
--    cover_image_url for all existing categories from static config.
-- 2. Adds admin write policies for categories, lessons, lesson_files, resources.
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── Helper: is_admin() ──────────────────────────────────────────────────────

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  )
$$;

-- ─── Foundation category metadata ────────────────────────────────────────────

update public.categories set
  description    = 'Strong OG ist eine hochwertige flüssige Vitalstoffversorgung auf Zellebene — mit ausgewählten Mineralien, Mikronährstoffen und optimierter Bioverfügbarkeit für langfristige körperliche Balance.',
  index_label    = '01',
  cover_gradient = 'from-[#9EB88C] to-[#7A9C68]',
  cover_image_url = '/produktwissen_category_card.png',
  hero_image_url  = '/produktwissen_hero.png'
where slug = 'produktwissen';

update public.categories set
  description    = 'Dein Team aufbauen, begleiten und als Führungspersönlichkeit wachsen — von den ersten Strukturen bis zu einer nachhaltigen Teamkultur.',
  index_label    = '02',
  cover_gradient = 'from-[#8FAABB] to-[#6A90A6]',
  cover_image_url = '/teamaufbau_fuehrung_category_card.png',
  hero_image_url  = '/teamaufbau_fuehrung_hero.png'
where slug = 'teamaufbau';

update public.categories set
  description    = 'Gespräche führen, Menschen begeistern und langfristige Kundenbeziehungen aufbauen — authentisch, ohne Druck, auf Augenhöhe.',
  index_label    = '03',
  cover_gradient = 'from-[#C8A89E] to-[#A88070]',
  cover_image_url = '/kommunikation_kundenaufbau_category_card.png',
  hero_image_url  = '/kommunikation_kundenaufbau_hero.png'
where slug = 'kommunikation';

-- ─── Library category metadata ────────────────────────────────────────────────

update public.categories set
  description    = 'Die wissenschaftlichen Grundlagen einer gesunden Lebensweise — Mikronährstoffe, Zellbiologie und die Zusammenhänge, die du kennen solltest.',
  index_label    = '04',
  cover_gradient = 'from-[#CCAC80] to-[#AA8C5C]',
  cover_image_url = '/gesundheitsgrundlagen_category_card.png',
  hero_image_url  = '/gesundheitsgrundlagen_hero.png'
where slug = 'gesundheitsgrundlagen';

update public.categories set
  description    = 'Mindset, Motivation und persönliche Exzellenz kultivieren — die innere Grundlage für nachhaltigen äußeren Erfolg.',
  index_label    = '05',
  cover_gradient = 'from-[#BCAACE] to-[#9880B4]',
  cover_image_url = '/persoenliche_entwicklung_category_card.png',
  hero_image_url  = '/persoenliche_entwicklung_hero.png'
where slug = 'persoenliche-entwicklung';

update public.categories set
  description    = 'Die richtigen digitalen Werkzeuge kennen und einsetzen — effizienter arbeiten, besser kommunizieren, smarter skalieren.',
  index_label    = '06',
  cover_gradient = 'from-[#A6B8C6] to-[#7898AE]',
  cover_image_url = '/digitale_werkzeuge_category_card.png',
  hero_image_url  = '/digitale_werkzeuge_hero.png'
where slug = 'digitale-werkzeuge';

update public.categories set
  description    = 'Digitale Sichtbarkeit aufbauen — mit Authentizität, Klarheit und einem ruhigen strategischen Ansatz für moderne Online-Kommunikation.',
  index_label    = '07',
  cover_gradient = 'from-[#C4A0A8] to-[#A67E88]',
  cover_image_url = '/social_media_category_card.png',
  hero_image_url  = '/social_media_hero.png'
where slug = 'social-media';

update public.categories set
  description    = 'Rechtliche und steuerliche Grundlagen für deinen Erfolg als selbstständiger Partner — verständlich erklärt, praxisnah aufbereitet.',
  index_label    = '08',
  cover_gradient = 'from-[#BCAA86] to-[#9A8860]',
  cover_image_url = '/gewerbe_steuern_category_card.png',
  hero_image_url  = '/gewerbe_steuern_hero.png'
where slug = 'gewerbe-steuern';

-- ─── Leadership category metadata ─────────────────────────────────────────────

update public.categories set
  description    = 'Was Führung wirklich bedeutet — Haltung, Verantwortung und die Kultur, die du in deinem Team erschaffst.',
  index_label    = '01',
  cover_gradient = 'from-[#7A8C6A] to-[#5A6A4A]',
  cover_image_url = '/leadership_culture_category_card.png',
  hero_image_url  = '/leadership_culture_hero.png'
where slug = 'leadership-kultur';

update public.categories set
  description    = 'Wie du eine klare Vision entwickelst und daraus eine Strategie baust, die dein Team trägt und bewegt.',
  index_label    = '02',
  cover_gradient = 'from-[#8A7A9A] to-[#6A5A7A]',
  cover_image_url = '/vision_strategy_category_card.png',
  hero_image_url  = '/vision_strategy_hero.png'
where slug = 'vision-strategie';

update public.categories set
  description    = 'Strukturen aufbauen, die ohne dich funktionieren — nachhaltiges Wachstum durch Menschen, nicht nur durch Aktivität.',
  index_label    = '03',
  cover_gradient = 'from-[#9A8070] to-[#7A6050]',
  cover_image_url = '/multiplication_category_card.png',
  hero_image_url  = '/multiplication_hero.png'
where slug = 'multiplikation';

update public.categories set
  description    = 'Die psychologischen Grundlagen von Teamdynamiken, Motivation und dem, was Menschen wirklich bewegt.',
  index_label    = '04',
  cover_gradient = 'from-[#8A9AA8] to-[#6A7A88]',
  cover_image_url = '/leadership_psychology_category_card.png',
  hero_image_url  = '/leadership_psychology_hero.png'
where slug = 'leadership-psychology';

-- ─── Lesson metadata ──────────────────────────────────────────────────────────

update public.lessons set
  cover_gradient = 'from-[#A8C094] to-[#7E9E6A]'
where slug = 'was-ist-strong-og';

-- ─── Admin RLS policies ──────────────────────────────────────────────────────

-- Categories: admin can do everything
create policy "categories_admin_all"
  on public.categories
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Lessons: admin can do everything
create policy "lessons_admin_all"
  on public.lessons
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Lesson files: admin can do everything
create policy "lesson_files_admin_all"
  on public.lesson_files
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Resources: admin can do everything
create policy "resources_admin_all"
  on public.resources
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Profiles: admin can read all + update role and is_active
create policy "profiles_admin_select"
  on public.profiles
  for select
  to authenticated
  using (public.is_admin());

create policy "profiles_admin_update"
  on public.profiles
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Admin settings: admin can update
create policy "admin_settings_admin_update"
  on public.admin_settings
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Leadership unlocks: admin can read all
create policy "leadership_unlocks_admin_select"
  on public.leadership_unlocks
  for select
  to authenticated
  using (public.is_admin());
