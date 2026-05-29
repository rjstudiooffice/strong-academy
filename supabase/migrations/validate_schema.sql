-- ─────────────────────────────────────────────────────────────────────────────
-- Strong Academy — Schema Validation
-- Run after migrations to confirm tables, triggers and enums are in place.
-- Safe to run multiple times — read-only.
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── 1. Alle erwarteten Tabellen vorhanden? ───────────────────────────────────

select
  t.table_name,
  case when t.table_name is not null then '✓' else '✗' end as status
from (
  values
    ('profiles'),
    ('invitations'),
    ('categories'),
    ('lessons'),
    ('lesson_progress'),
    ('lesson_files'),
    ('resources'),
    ('leadership_unlocks'),
    ('admin_settings')
) as expected(table_name)
left join information_schema.tables t
  on t.table_name = expected.table_name
  and t.table_schema = 'public'
order by expected.table_name;


-- ─── 2. Enum-Typen vorhanden? ─────────────────────────────────────────────────

select
  typname as enum_name,
  string_agg(enumlabel, ', ' order by enumsortorder) as values
from pg_type
join pg_enum on pg_type.oid = pg_enum.enumtypid
where typname in ('user_role', 'category_type')
group by typname;


-- ─── 3. Trigger vorhanden? ────────────────────────────────────────────────────

select
  trigger_name,
  event_object_schema || '.' || event_object_table as "table",
  action_timing,
  event_manipulation
from information_schema.triggers
where trigger_name in (
  'on_auth_user_created',
  'trg_profiles_updated_at',
  'trg_lessons_updated_at',
  'trg_lesson_progress_updated_at',
  'trg_admin_settings_updated_at'
)
order by trigger_name;


-- ─── 4. RLS aktiviert? ────────────────────────────────────────────────────────

select
  schemaname,
  tablename,
  rowsecurity as rls_enabled
from pg_tables
where schemaname = 'public'
order by tablename;


-- ─── 5. profiles.is_active vorhanden? ────────────────────────────────────────

select column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'public'
  and table_name = 'profiles'
order by ordinal_position;


-- ─── 6. admin_settings Seed-Wert gesetzt? ────────────────────────────────────

select key, value from public.admin_settings;
