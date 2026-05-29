// Admin read functions — use service role client (bypasses RLS).
// Server-side only. Never import in client components.

import { createAdminClient } from "./admin"

// ─── Types ───────────────────────────────────────────────────────────────────

export type AdminCategory = {
  id: string
  slug: string
  name: string
  type: "foundation" | "library" | "leadership"
  area_slug: string | null      // 'academy' | 'leadership' | 'library'
  video_prefix: string | null   // e.g. 'academy_produktwissen_' — used for Bunny filtering
  tagline: string | null
  description: string | null
  index_label: string | null
  cover_gradient: string | null
  cover_image_url: string | null
  hero_image_url: string | null
  sort_order: number
  is_active: boolean
  lesson_count: number
  created_at: string
}

export type AdminLesson = {
  id: string
  category_id: string
  category_name: string
  category_slug: string
  slug: string
  title: string
  description: string | null
  video_url: string | null
  thumbnail_url: string | null
  cover_gradient: string | null
  duration_seconds: number | null
  sort_order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export type AdminLessonFile = {
  id: string
  lesson_id: string
  title: string
  file_url: string
  sort_order: number
  created_at: string
}

export type AdminResource = {
  id: string
  title: string
  description: string | null
  category: string | null
  file_url: string
  file_type: string | null
  file_size: string | null
  sort_order: number
  is_active: boolean
  created_at: string
}

export type AdminUser = {
  id: string
  email: string
  full_name: string | null
  role: "admin" | "partner"
  is_active: boolean
  leadership_unlocked: boolean
  created_at: string
}

// ─── Stats (dashboard) ────────────────────────────────────────────────────────

export async function getAdminStats() {
  const admin = createAdminClient()

  const [
    { count: userCount },
    { count: categoryCount },
    { count: lessonCount },
    { count: resourceCount },
  ] = await Promise.all([
    admin.from("profiles").select("id", { count: "exact", head: true }),
    admin.from("categories").select("id", { count: "exact", head: true }),
    admin.from("lessons").select("id", { count: "exact", head: true }),
    admin.from("resources").select("id", { count: "exact", head: true }),
  ])

  return {
    users:     userCount ?? 0,
    categories: categoryCount ?? 0,
    lessons:   lessonCount ?? 0,
    resources: resourceCount ?? 0,
  }
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function getAdminCategories(): Promise<AdminCategory[]> {
  const admin = createAdminClient()

  const { data: cats } = await admin
    .from("categories")
    .select("id, slug, name, type, area_slug, video_prefix, tagline, description, index_label, cover_gradient, cover_image_url, hero_image_url, sort_order, is_active, created_at")
    .order("type")
    .order("sort_order")

  if (!cats || cats.length === 0) return []

  const catIds = cats.map((c) => c.id)
  const { data: counts } = await admin
    .from("lessons")
    .select("category_id")
    .in("category_id", catIds)

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

export async function getAdminCategoryById(id: string): Promise<AdminCategory | null> {
  const admin = createAdminClient()

  const { data } = await admin
    .from("categories")
    .select("id, slug, name, type, area_slug, video_prefix, tagline, description, index_label, cover_gradient, cover_image_url, hero_image_url, sort_order, is_active, created_at")
    .eq("id", id)
    .single()

  if (!data) return null

  const { count } = await admin
    .from("lessons")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id)

  return { ...data, type: data.type as "foundation" | "library" | "leadership", lesson_count: count ?? 0 }
}

// ─── Lessons ─────────────────────────────────────────────────────────────────

export async function getAdminLessons(): Promise<AdminLesson[]> {
  const admin = createAdminClient()

  const { data } = await admin
    .from("lessons")
    .select(`
      id, category_id, slug, title, description, video_url, thumbnail_url,
      cover_gradient, duration_seconds, sort_order, is_published, created_at, updated_at,
      categories!inner(name, slug)
    `)
    .order("categories(sort_order)")
    .order("sort_order")

  return (data ?? []).map((l: any) => ({
    ...l,
    category_name: l.categories?.name ?? "",
    category_slug: l.categories?.slug ?? "",
    categories: undefined,
  }))
}

export async function getAdminLessonById(id: string): Promise<AdminLesson | null> {
  const admin = createAdminClient()

  const { data } = await admin
    .from("lessons")
    .select(`
      id, category_id, slug, title, description, video_url, thumbnail_url,
      cover_gradient, duration_seconds, sort_order, is_published, created_at, updated_at,
      categories!inner(name, slug)
    `)
    .eq("id", id)
    .single()

  if (!data) return null

  return {
    ...(data as any),
    category_name: (data as any).categories?.name ?? "",
    category_slug: (data as any).categories?.slug ?? "",
    categories: undefined,
  }
}

export async function getAdminLessonFiles(lessonId: string): Promise<AdminLessonFile[]> {
  const admin = createAdminClient()

  const { data } = await admin
    .from("lesson_files")
    .select("id, lesson_id, title, file_url, sort_order, created_at")
    .eq("lesson_id", lessonId)
    .order("sort_order")

  return (data ?? []) as AdminLessonFile[]
}

// ─── Resources ────────────────────────────────────────────────────────────────

export async function getAdminResources(): Promise<AdminResource[]> {
  const admin = createAdminClient()

  const { data } = await admin
    .from("resources")
    .select("id, title, description, category, file_url, file_type, file_size, sort_order, is_active, created_at")
    .order("sort_order")

  return (data ?? []) as AdminResource[]
}

export async function getAdminResourceById(id: string): Promise<AdminResource | null> {
  const admin = createAdminClient()

  const { data } = await admin
    .from("resources")
    .select("id, title, description, category, file_url, file_type, file_size, sort_order, is_active, created_at")
    .eq("id", id)
    .single()

  return data as AdminResource | null
}

// ─── Users ────────────────────────────────────────────────────────────────────

export type AdminUserDetail = AdminUser & {
  sponsor_id: string | null
}

// ─── Invitations ─────────────────────────────────────────────────────────────

export type AdminInvitation = {
  id:         string
  token:      string
  created_by: string
  creator_name: string | null
  creator_email: string
  use_count:  number
  is_active:  boolean
  expires_at: string
  created_at: string
}

export async function getAdminInvitations(): Promise<AdminInvitation[]> {
  const admin = createAdminClient()

  const { data } = await admin
    .from("invitations")
    .select("id, token, created_by, use_count, is_active, expires_at, created_at, profiles!invitations_created_by_fkey(full_name, email)")
    .order("created_at", { ascending: false })

  return (data ?? []).map((row: any) => ({
    id:            row.id,
    token:         row.token,
    created_by:    row.created_by,
    creator_name:  row.profiles?.full_name ?? null,
    creator_email: row.profiles?.email ?? "",
    use_count:     row.use_count ?? 0,
    is_active:     row.is_active ?? true,
    expires_at:    row.expires_at,
    created_at:    row.created_at,
  }))
}

export async function getAdminUserById(id: string): Promise<AdminUserDetail | null> {
  const admin = createAdminClient()

  const { data } = await admin
    .from("profiles")
    .select("id, email, full_name, role, is_active, leadership_unlocked, created_at, sponsor_id")
    .eq("id", id)
    .single()

  return data as AdminUserDetail | null
}

export async function getAdminUsers(search?: string): Promise<AdminUser[]> {
  const admin = createAdminClient()

  let query = admin
    .from("profiles")
    .select("id, email, full_name, role, is_active, leadership_unlocked, created_at")
    .order("created_at", { ascending: false })

  if (search) {
    query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`)
  }

  const { data } = await query

  return (data ?? []) as AdminUser[]
}
