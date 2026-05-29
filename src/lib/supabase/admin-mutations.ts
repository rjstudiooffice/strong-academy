"use server"

// Admin mutations — service role client (bypasses RLS).
// All actions verify the caller is an admin before executing.

import { createAdminClient } from "./admin"
import { createClient } from "./server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

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

  const payload = {
    name:            formData.get("name") as string,
    slug:            formData.get("slug") as string,
    type:            formData.get("type") as string,
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
    category_id:     formData.get("category_id") as string,
    title:           formData.get("title") as string,
    slug:            formData.get("slug") as string,
    description:     formData.get("description") as string || null,
    video_url:       formData.get("video_url") as string || null,
    thumbnail_url:   formData.get("thumbnail_url") as string || null,
    cover_gradient:  formData.get("cover_gradient") as string || null,
    duration_seconds: parseInt(formData.get("duration_seconds") as string) || null,
    sort_order:      parseInt(formData.get("sort_order") as string) || 0,
    is_published:    formData.get("is_published") === "true",
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
    category_id:     formData.get("category_id") as string,
    title:           formData.get("title") as string,
    slug:            formData.get("slug") as string,
    description:     formData.get("description") as string || null,
    video_url:       formData.get("video_url") as string || null,
    thumbnail_url:   formData.get("thumbnail_url") as string || null,
    cover_gradient:  formData.get("cover_gradient") as string || null,
    duration_seconds: parseInt(formData.get("duration_seconds") as string) || null,
    sort_order:      parseInt(formData.get("sort_order") as string) || 0,
    is_published:    formData.get("is_published") === "true",
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
