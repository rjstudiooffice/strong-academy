import { createClient } from "./server"

export type LessonProgress = {
  id: string
  slug: string
  title: string
  duration_seconds: number | null
  sort_order: number
  progress_percent: number
  completed: boolean
}

export type ProgressSummary = {
  completed: number
  total: number
  pct: number
}

// ─── Single lesson lookup ─────────────────────────────────────────────────────

// Returns lesson DB id and progress for one lesson
export async function getLessonWithProgress(
  userId: string,
  categorySlug: string,
  lessonSlug: string
): Promise<{ id: string; progress_percent: number; completed: boolean } | null> {
  const supabase = await createClient()

  const { data: category } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .single()

  if (!category) return null

  const { data: lesson } = await supabase
    .from("lessons")
    .select("id")
    .eq("category_id", category.id)
    .eq("slug", lessonSlug)
    .eq("is_published", true)
    .single()

  if (!lesson) return null

  const { data: progress } = await supabase
    .from("lesson_progress")
    .select("progress_percent, completed")
    .eq("user_id", userId)
    .eq("lesson_id", lesson.id)
    .single()

  return {
    id: lesson.id,
    progress_percent: progress?.progress_percent ?? 0,
    completed: progress?.completed ?? false,
  }
}

// ─── All lessons in a category with progress ─────────────────────────────────

export async function getLessonsWithProgress(
  userId: string,
  categorySlug: string
): Promise<LessonProgress[]> {
  const supabase = await createClient()

  const { data: category } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .single()

  if (!category) return []

  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, slug, title, duration_seconds, sort_order")
    .eq("category_id", category.id)
    .eq("is_published", true)
    .order("sort_order")

  if (!lessons || lessons.length === 0) return []

  const lessonIds = lessons.map((l) => l.id)

  const { data: progressRows } = await supabase
    .from("lesson_progress")
    .select("lesson_id, progress_percent, completed")
    .eq("user_id", userId)
    .in("lesson_id", lessonIds)

  const progressMap: Record<string, { progress_percent: number; completed: boolean }> =
    Object.fromEntries((progressRows ?? []).map((p) => [p.lesson_id, p]))

  return lessons.map((l) => ({
    id:               l.id,
    slug:             l.slug,
    title:            l.title,
    duration_seconds: l.duration_seconds,
    sort_order:       l.sort_order,
    progress_percent: progressMap[l.id]?.progress_percent ?? 0,
    completed:        progressMap[l.id]?.completed ?? false,
  }))
}

// ─── Category summary ─────────────────────────────────────────────────────────

export async function getCategoryProgress(
  userId: string,
  categorySlug: string
): Promise<ProgressSummary> {
  const lessons = await getLessonsWithProgress(userId, categorySlug)
  const completed = lessons.filter((l) => l.completed).length
  const total     = lessons.length
  return { completed, total, pct: total > 0 ? Math.round((completed / total) * 100) : 0 }
}

// ─── Overall progress across all foundation categories ────────────────────────

export async function getOverallProgress(userId: string): Promise<ProgressSummary> {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from("categories")
    .select("id")
    .eq("type", "foundation")
    .eq("is_active", true)

  if (!categories || categories.length === 0) return { completed: 0, total: 0, pct: 0 }

  const categoryIds = categories.map((c) => c.id)

  const { data: lessons } = await supabase
    .from("lessons")
    .select("id")
    .in("category_id", categoryIds)
    .eq("is_published", true)

  if (!lessons || lessons.length === 0) return { completed: 0, total: 0, pct: 0 }

  const lessonIds = lessons.map((l) => l.id)

  const { count } = await supabase
    .from("lesson_progress")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .in("lesson_id", lessonIds)
    .eq("completed", true)

  const completed = count ?? 0
  const total     = lessons.length
  return { completed, total, pct: total > 0 ? Math.round((completed / total) * 100) : 0 }
}

// ─── Per-category progress for all foundation categories ─────────────────────

export async function getFoundationCategoryProgress(
  userId: string
): Promise<{ slug: string; completed: number; total: number; pct: number }[]> {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from("categories")
    .select("id, slug")
    .eq("type", "foundation")
    .eq("is_active", true)
    .order("sort_order")

  if (!categories || categories.length === 0) return []

  // Batch: get all lessons for all foundation categories in one query
  const categoryIds = categories.map((c) => c.id)

  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, category_id")
    .in("category_id", categoryIds)
    .eq("is_published", true)

  if (!lessons || lessons.length === 0) {
    return categories.map((c) => ({ slug: c.slug, completed: 0, total: 0, pct: 0 }))
  }

  const lessonIds = lessons.map((l) => l.id)

  const { data: progressRows } = await supabase
    .from("lesson_progress")
    .select("lesson_id")
    .eq("user_id", userId)
    .in("lesson_id", lessonIds)
    .eq("completed", true)

  const completedIds = new Set((progressRows ?? []).map((p) => p.lesson_id))

  return categories.map((cat) => {
    const catLessons = lessons.filter((l) => l.category_id === cat.id)
    const completed  = catLessons.filter((l) => completedIds.has(l.id)).length
    const total      = catLessons.length
    return { slug: cat.slug, completed, total, pct: total > 0 ? Math.round((completed / total) * 100) : 0 }
  })
}
