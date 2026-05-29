// DB read layer for public-facing app pages.
// All queries respect RLS: is_active=true, is_published=true.

import { createClient } from "./server"

// ─── Types ───────────────────────────────────────────────────────────────────

export type ContentLessonFile = {
  id: string
  title: string
  file_url: string
  sort_order: number
}

export type ContentLesson = {
  id: string
  slug: string
  title: string
  description: string | null
  video_url: string | null
  thumbnail_url: string | null
  cover_gradient: string | null
  duration_seconds: number | null
  sort_order: number
  lesson_files: ContentLessonFile[]
}

export type ContentCategory = {
  id: string
  slug: string
  name: string
  type: "foundation" | "library" | "leadership"
  tagline: string | null
  description: string | null
  index_label: string | null
  cover_gradient: string | null
  cover_image_url: string | null
  hero_image_url: string | null
  sort_order: number
  lesson_count: number
}

export type ContentCategoryWithLessons = ContentCategory & {
  lessons: ContentLesson[]
}

export type LessonNavContext = {
  category: ContentCategory
  lesson: ContentLesson
  index: number
  prev: ContentLesson | null
  next: ContentLesson | null
  allLessons: ContentLesson[]
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function formatDuration(seconds: number | null): string {
  if (!seconds) return "k.A."
  const min = Math.round(seconds / 60)
  return `${min} Min.`
}

// ─── Academy (Foundation + Library) ──────────────────────────────────────────

export async function getAcademyCategories(): Promise<ContentCategory[]> {
  const supabase = await createClient()

  const { data: cats } = await supabase
    .from("categories")
    .select("id, slug, name, type, tagline, description, index_label, cover_gradient, cover_image_url, hero_image_url, sort_order")
    .in("type", ["foundation", "library"])
    .eq("is_active", true)
    .order("sort_order")

  if (!cats || cats.length === 0) return []

  const catIds = cats.map((c) => c.id)

  const { data: counts } = await supabase
    .from("lessons")
    .select("category_id")
    .in("category_id", catIds)
    .eq("is_published", true)

  const countMap: Record<string, number> = {}
  for (const row of counts ?? []) {
    countMap[row.category_id] = (countMap[row.category_id] ?? 0) + 1
  }

  return cats.map((c) => ({
    ...c,
    type: c.type as "foundation" | "library" | "leadership",
    lesson_count: countMap[c.id] ?? 0,
  }))
}

// ─── Single category + its lessons ───────────────────────────────────────────

export async function getCategoryWithLessons(
  slug: string
): Promise<ContentCategoryWithLessons | null> {
  const supabase = await createClient()

  const { data: cat } = await supabase
    .from("categories")
    .select("id, slug, name, type, tagline, description, index_label, cover_gradient, cover_image_url, hero_image_url, sort_order")
    .eq("slug", slug)
    .eq("is_active", true)
    .single()

  if (!cat) return null

  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, slug, title, description, video_url, thumbnail_url, cover_gradient, duration_seconds, sort_order")
    .eq("category_id", cat.id)
    .eq("is_published", true)
    .order("sort_order")

  const lessonList = lessons ?? []

  // Batch-fetch lesson files for all lessons
  const lessonIds = lessonList.map((l) => l.id)
  const { data: files } =
    lessonIds.length > 0
      ? await supabase
          .from("lesson_files")
          .select("id, lesson_id, title, file_url, sort_order")
          .in("lesson_id", lessonIds)
          .order("sort_order")
      : { data: [] }

  const filesMap: Record<string, ContentLessonFile[]> = {}
  for (const f of files ?? []) {
    if (!filesMap[f.lesson_id]) filesMap[f.lesson_id] = []
    filesMap[f.lesson_id].push({ id: f.id, title: f.title, file_url: f.file_url, sort_order: f.sort_order })
  }

  const { data: lessonCountRow } = await supabase
    .from("lessons")
    .select("id", { count: "exact", head: true })
    .eq("category_id", cat.id)
    .eq("is_published", true)

  return {
    ...cat,
    type: cat.type as "foundation" | "library" | "leadership",
    lesson_count: lessonList.length,
    lessons: lessonList.map((l) => ({
      ...l,
      lesson_files: filesMap[l.id] ?? [],
    })),
  }
}

// ─── Lesson navigation context ────────────────────────────────────────────────

export async function getLessonNavContext(
  categorySlug: string,
  lessonSlug: string
): Promise<LessonNavContext | null> {
  const cat = await getCategoryWithLessons(categorySlug)
  if (!cat) return null

  const idx = cat.lessons.findIndex((l) => l.slug === lessonSlug)
  if (idx === -1) return null

  return {
    category: cat,
    lesson:   cat.lessons[idx],
    index:    idx,
    prev:     idx > 0 ? cat.lessons[idx - 1] : null,
    next:     idx < cat.lessons.length - 1 ? cat.lessons[idx + 1] : null,
    allLessons: cat.lessons,
  }
}

// ─── Leadership categories ────────────────────────────────────────────────────

export async function getLeadershipCategories(): Promise<ContentCategory[]> {
  const supabase = await createClient()

  const { data: cats } = await supabase
    .from("categories")
    .select("id, slug, name, type, tagline, description, index_label, cover_gradient, cover_image_url, hero_image_url, sort_order")
    .eq("type", "leadership")
    .eq("is_active", true)
    .order("sort_order")

  if (!cats || cats.length === 0) return []

  const catIds = cats.map((c) => c.id)
  const { data: counts } = await supabase
    .from("lessons")
    .select("category_id")
    .in("category_id", catIds)
    .eq("is_published", true)

  const countMap: Record<string, number> = {}
  for (const row of counts ?? []) {
    countMap[row.category_id] = (countMap[row.category_id] ?? 0) + 1
  }

  return cats.map((c) => ({
    ...c,
    type: "leadership" as const,
    lesson_count: countMap[c.id] ?? 0,
  }))
}

// ─── Resources ────────────────────────────────────────────────────────────────

export type ContentResource = {
  id: string
  title: string
  description: string | null
  category: string | null
  file_url: string
  file_type: string | null
  file_size: string | null
  sort_order: number
}

export async function getResources(): Promise<ContentResource[]> {
  const supabase = await createClient()

  const { data } = await supabase
    .from("resources")
    .select("id, title, description, category, file_url, file_type, file_size, sort_order")
    .eq("is_active", true)
    .order("sort_order")

  return (data ?? []) as ContentResource[]
}
