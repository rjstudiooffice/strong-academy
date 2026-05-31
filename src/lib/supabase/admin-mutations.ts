"use server"

// Admin mutations — service role client (bypasses RLS).
// All actions verify the caller is an admin before executing.

import { createAdminClient } from "./admin"
import { createClient } from "./server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

// ─── Auth guard ───────────────────────────────────────────────────────────────

async function requireAdmin(): Promise<string> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Nicht angemeldet.")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") throw new Error("Kein Admin-Zugriff.")

  return user.id
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function createCategory(formData: FormData): Promise<void> {
  await requireAdmin()
  const admin = createAdminClient()

  const type = formData.get("type") as string
  const payload = {
    name:            formData.get("name") as string,
    slug:            formData.get("slug") as string,
    type,
    area_slug:       type === "foundation" ? "academy" : type === "leadership" ? "leadership" : "library",
    video_prefix:    formData.get("video_prefix") as string || null,
    tagline:         formData.get("tagline") as string || null,
    description:     formData.get("description") as string || null,
    index_label:     formData.get("index_label") as string || null,
    cover_gradient:  formData.get("cover_gradient") as string || null,
    cover_image_url: formData.get("cover_image_url") as string || null,
    hero_image_url:  formData.get("hero_image_url") as string || null,
    sort_order:      parseInt(formData.get("sort_order") as string) || 0,
    is_active:       formData.get("is_active") === "true",
  }

  const { error } = await admin.from("categories").insert(payload)
  if (error) throw new Error(error.message)

  revalidatePath("/admin/kategorien")
  revalidatePath("/academy")
  revalidatePath("/leadership")
  redirect("/admin/kategorien")
}

export async function updateCategory(id: string, formData: FormData): Promise<void> {
  await requireAdmin()
  const admin = createAdminClient()

  const payload = {
    name:            formData.get("name") as string,
    slug:            formData.get("slug") as string,
    video_prefix:    formData.get("video_prefix") as string || null,
    tagline:         formData.get("tagline") as string || null,
    description:     formData.get("description") as string || null,
    index_label:     formData.get("index_label") as string || null,
    cover_gradient:  formData.get("cover_gradient") as string || null,
    cover_image_url: formData.get("cover_image_url") as string || null,
    hero_image_url:  formData.get("hero_image_url") as string || null,
    sort_order:      parseInt(formData.get("sort_order") as string) || 0,
    is_active:       formData.get("is_active") === "true",
  }

  const { error } = await admin.from("categories").update(payload).eq("id", id)
  if (error) throw new Error(error.message)

  revalidatePath("/admin/kategorien")
  revalidatePath("/academy")
  revalidatePath("/leadership")
  redirect("/admin/kategorien")
}

export async function deleteCategory(formData: FormData): Promise<void> {
  await requireAdmin()
  const admin = createAdminClient()
  const id = formData.get("id") as string

  const { error } = await admin.from("categories").delete().eq("id", id)
  if (error) throw new Error(error.message)

  revalidatePath("/admin/kategorien")
  revalidatePath("/academy")
  revalidatePath("/leadership")
  redirect("/admin/kategorien")
}

// ─── Lessons ─────────────────────────────────────────────────────────────────

export async function createLesson(formData: FormData): Promise<void> {
  await requireAdmin()
  const admin = createAdminClient()

  const payload = {
    category_id:      formData.get("category_id") as string,
    title:            formData.get("title") as string,
    slug:             formData.get("slug") as string,
    description:      formData.get("description") as string || null,
    video_id:         formData.get("video_id") as string || null,
    video_url:        formData.get("video_url") as string || null,
    thumbnail_url:    formData.get("thumbnail_url") as string || null,
    cover_gradient:   formData.get("cover_gradient") as string || null,
    duration_seconds: parseInt(formData.get("duration_seconds") as string) || null,
    sort_order:       parseInt(formData.get("sort_order") as string) || 0,
    is_published:     formData.get("is_published") === "true",
  }

  const { error } = await admin.from("lessons").insert(payload)
  if (error) throw new Error(error.message)

  revalidatePath("/admin/lektionen")
  revalidatePath("/academy")
  redirect("/admin/lektionen")
}

export async function updateLesson(id: string, formData: FormData): Promise<void> {
  await requireAdmin()
  const admin = createAdminClient()

  const payload = {
    category_id:      formData.get("category_id") as string,
    title:            formData.get("title") as string,
    slug:             formData.get("slug") as string,
    description:      formData.get("description") as string || null,
    video_id:         formData.get("video_id") as string || null,
    video_url:        formData.get("video_url") as string || null,
    thumbnail_url:    formData.get("thumbnail_url") as string || null,
    cover_gradient:   formData.get("cover_gradient") as string || null,
    duration_seconds: parseInt(formData.get("duration_seconds") as string) || null,
    sort_order:       parseInt(formData.get("sort_order") as string) || 0,
    is_published:     formData.get("is_published") === "true",
  }

  const { error } = await admin.from("lessons").update(payload).eq("id", id)
  if (error) throw new Error(error.message)

  revalidatePath("/admin/lektionen")
  revalidatePath("/academy")
  redirect("/admin/lektionen")
}

export async function deleteLesson(formData: FormData): Promise<void> {
  await requireAdmin()
  const admin = createAdminClient()
  const id = formData.get("id") as string

  const { error } = await admin.from("lessons").delete().eq("id", id)
  if (error) throw new Error(error.message)

  revalidatePath("/admin/lektionen")
  revalidatePath("/academy")
  redirect("/admin/lektionen")
}

// ─── Lesson files ─────────────────────────────────────────────────────────────

export async function createLessonFile(lessonId: string, formData: FormData): Promise<void> {
  await requireAdmin()
  const admin = createAdminClient()

  const payload = {
    lesson_id:  lessonId,
    title:      formData.get("title") as string,
    file_url:   formData.get("file_url") as string,
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
  }

  const { error } = await admin.from("lesson_files").insert(payload)
  if (error) throw new Error(error.message)

  revalidatePath(`/admin/lektionen/${lessonId}`)
}

export async function deleteLessonFile(formData: FormData): Promise<void> {
  await requireAdmin()
  const admin = createAdminClient()
  const id = formData.get("id") as string
  const lessonId = formData.get("lesson_id") as string

  const { error } = await admin.from("lesson_files").delete().eq("id", id)
  if (error) throw new Error(error.message)

  revalidatePath(`/admin/lektionen/${lessonId}`)
}

// ─── Resources ────────────────────────────────────────────────────────────────

export async function createResource(formData: FormData): Promise<void> {
  await requireAdmin()
  const admin = createAdminClient()

  const payload = {
    title:       formData.get("title") as string,
    description: formData.get("description") as string || null,
    category:    formData.get("category") as string || null,
    file_url:    formData.get("file_url") as string,
    file_type:   formData.get("file_type") as string || null,
    file_size:   formData.get("file_size") as string || null,
    sort_order:  parseInt(formData.get("sort_order") as string) || 0,
    is_active:   true,
  }

  const { error } = await admin.from("resources").insert(payload)
  if (error) throw new Error(error.message)

  revalidatePath("/admin/ressourcen")
  revalidatePath("/ressourcen")
  redirect("/admin/ressourcen")
}

export async function updateResource(id: string, formData: FormData): Promise<void> {
  await requireAdmin()
  const admin = createAdminClient()

  const payload = {
    title:       formData.get("title") as string,
    description: formData.get("description") as string || null,
    category:    formData.get("category") as string || null,
    file_url:    formData.get("file_url") as string,
    file_type:   formData.get("file_type") as string || null,
    file_size:   formData.get("file_size") as string || null,
    sort_order:  parseInt(formData.get("sort_order") as string) || 0,
    is_active:   formData.get("is_active") === "true",
  }

  const { error } = await admin.from("resources").update(payload).eq("id", id)
  if (error) throw new Error(error.message)

  revalidatePath("/admin/ressourcen")
  revalidatePath("/ressourcen")
  redirect("/admin/ressourcen")
}

export async function deleteResource(formData: FormData): Promise<void> {
  await requireAdmin()
  const admin = createAdminClient()
  const id = formData.get("id") as string

  const { error } = await admin.from("resources").delete().eq("id", id)
  if (error) throw new Error(error.message)

  revalidatePath("/admin/ressourcen")
  revalidatePath("/ressourcen")
  redirect("/admin/ressourcen")
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function toggleUserActive(formData: FormData): Promise<void> {
  await requireAdmin()
  const admin = createAdminClient()

  const id        = formData.get("id") as string
  const isActive  = formData.get("is_active") === "true"

  const { error } = await admin
    .from("profiles")
    .update({ is_active: !isActive })
    .eq("id", id)

  if (error) throw new Error(error.message)

  revalidatePath("/admin/benutzer")
}

export async function toggleLeadershipUnlock(formData: FormData): Promise<void> {
  await requireAdmin()
  const admin = createAdminClient()

  const id = formData.get("id") as string
  const current = formData.get("leadership_unlocked") === "true"
  const next = !current

  const { error } = await admin
    .from("profiles")
    .update({ leadership_unlocked: next })
    .eq("id", id)

  if (error) throw new Error(error.message)

  if (next) {
    await admin
      .from("leadership_unlocks")
      .upsert({ user_id: id, unlocked: true, unlocked_at: new Date().toISOString() }, { onConflict: "user_id" })
  }

  revalidatePath("/admin/benutzer")
}

// ─── Invitations ─────────────────────────────────────────────────────────────

export async function toggleInvitationActive(formData: FormData): Promise<void> {
  await requireAdmin()
  const admin  = createAdminClient()
  const id       = formData.get("id") as string
  const isActive = formData.get("is_active") === "true"

  await admin.from("invitations").update({ is_active: !isActive }).eq("id", id)
  revalidatePath("/admin/einladungen")
}

export async function deleteInvitation(formData: FormData): Promise<void> {
  await requireAdmin()
  const admin = createAdminClient()
  const id    = formData.get("id") as string

  await admin.from("invitations").delete().eq("id", id)
  revalidatePath("/admin/einladungen")
}

export async function extendInvitation(formData: FormData): Promise<void> {
  await requireAdmin()
  const admin   = createAdminClient()
  const id      = formData.get("id") as string
  const expiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()

  await admin.from("invitations").update({ expires_at: expiresAt, is_active: true }).eq("id", id)
  revalidatePath("/admin/einladungen")
}

export async function changeUserSponsor(formData: FormData): Promise<void> {
  await requireAdmin()
  const admin = createAdminClient()

  const id        = formData.get("id") as string
  const sponsorId = formData.get("sponsor_id") as string | null

  const { error } = await admin
    .from("profiles")
    .update({ sponsor_id: sponsorId || null })
    .eq("id", id)

  if (error) throw new Error(error.message)

  revalidatePath("/admin/benutzer")
  revalidatePath(`/admin/benutzer/${id}`)
}

export async function changeUserRole(formData: FormData): Promise<void> {
  await requireAdmin()
  const admin = createAdminClient()

  const id   = formData.get("id") as string
  const role = formData.get("role") as "admin" | "partner"

  const { error } = await admin
    .from("profiles")
    .update({ role })
    .eq("id", id)

  if (error) throw new Error(error.message)

  revalidatePath("/admin/benutzer")
}

// ─── Reorder ─────────────────────────────────────────────────────────────────

export async function reorderCategoryUp(formData: FormData): Promise<void> {
  await requireAdmin()
  const admin = createAdminClient()
  const id = formData.get("id") as string

  const { data: cur } = await admin
    .from("categories").select("id, sort_order, type").eq("id", id).single()
  if (!cur) return

  const { data: prev } = await admin
    .from("categories").select("id, sort_order")
    .eq("type", cur.type).lt("sort_order", cur.sort_order)
    .order("sort_order", { ascending: false }).limit(1).single()
  if (!prev) return

  await Promise.all([
    admin.from("categories").update({ sort_order: prev.sort_order }).eq("id", cur.id),
    admin.from("categories").update({ sort_order: cur.sort_order  }).eq("id", prev.id),
  ])

  revalidatePath("/admin/kategorien")
  revalidatePath("/academy")
  revalidatePath("/leadership")
}

export async function reorderCategoryDown(formData: FormData): Promise<void> {
  await requireAdmin()
  const admin = createAdminClient()
  const id = formData.get("id") as string

  const { data: cur } = await admin
    .from("categories").select("id, sort_order, type").eq("id", id).single()
  if (!cur) return

  const { data: nxt } = await admin
    .from("categories").select("id, sort_order")
    .eq("type", cur.type).gt("sort_order", cur.sort_order)
    .order("sort_order", { ascending: true }).limit(1).single()
  if (!nxt) return

  await Promise.all([
    admin.from("categories").update({ sort_order: nxt.sort_order }).eq("id", cur.id),
    admin.from("categories").update({ sort_order: cur.sort_order }).eq("id", nxt.id),
  ])

  revalidatePath("/admin/kategorien")
  revalidatePath("/academy")
  revalidatePath("/leadership")
}

export async function toggleLessonPublished(formData: FormData): Promise<void> {
  await requireAdmin()
  const admin       = createAdminClient()
  const id          = formData.get("id") as string
  const isPublished = formData.get("is_published") === "true"

  await admin.from("lessons").update({ is_published: !isPublished }).eq("id", id)

  revalidatePath("/admin/lektionen")
  revalidatePath("/academy")
  revalidatePath("/leadership")
}

export async function reorderLessonUp(formData: FormData): Promise<void> {
  await requireAdmin()
  const admin = createAdminClient()
  const id = formData.get("id") as string

  const { data: cur } = await admin
    .from("lessons").select("id, sort_order, category_id").eq("id", id).single()
  if (!cur) return

  const { data: prev } = await admin
    .from("lessons").select("id, sort_order")
    .eq("category_id", cur.category_id).lt("sort_order", cur.sort_order)
    .order("sort_order", { ascending: false }).limit(1).single()
  if (!prev) return

  await Promise.all([
    admin.from("lessons").update({ sort_order: prev.sort_order }).eq("id", cur.id),
    admin.from("lessons").update({ sort_order: cur.sort_order  }).eq("id", prev.id),
  ])

  revalidatePath("/admin/lektionen")
  revalidatePath("/academy")
}

export async function reorderLessonDown(formData: FormData): Promise<void> {
  await requireAdmin()
  const admin = createAdminClient()
  const id = formData.get("id") as string

  const { data: cur } = await admin
    .from("lessons").select("id, sort_order, category_id").eq("id", id).single()
  if (!cur) return

  const { data: nxt } = await admin
    .from("lessons").select("id, sort_order")
    .eq("category_id", cur.category_id).gt("sort_order", cur.sort_order)
    .order("sort_order", { ascending: true }).limit(1).single()
  if (!nxt) return

  await Promise.all([
    admin.from("lessons").update({ sort_order: nxt.sort_order }).eq("id", cur.id),
    admin.from("lessons").update({ sort_order: cur.sort_order }).eq("id", nxt.id),
  ])

  revalidatePath("/admin/lektionen")
  revalidatePath("/academy")
}

// ─── Password reset ───────────────────────────────────────────────────────────

export async function generatePasswordResetLink(
  email: string
): Promise<{ link?: string; error?: string }> {
  await requireAdmin()

  const headersList = await headers()
  const host = headersList.get("host") ?? "localhost:3000"
  const protocol = host.includes("localhost") ? "http" : "https"
  const redirectTo = `${protocol}://${host}/auth/callback?next=/passwort-neu`

  const admin = createAdminClient()
  const { data, error } = await admin.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo },
  })

  if (error || !data?.properties?.action_link) {
    return { error: error?.message ?? "Link konnte nicht generiert werden." }
  }

  return { link: data.properties.action_link }
}
