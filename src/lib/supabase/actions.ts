"use server"

import { createClient } from "./server"
import { redirect } from "next/navigation"
import { validateToken, markInvitationUsed, setSponsor, setConsent } from "./invitations"

export type AuthState = { error: string } | null

export async function login(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email    = formData.get("email") as string
  const password = formData.get("password") as string

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return { error: error.message }

  redirect("/")
}

export async function register(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const firstName = formData.get("firstName") as string
  const lastName  = formData.get("lastName") as string
  const email     = formData.get("email") as string
  const password  = formData.get("password") as string
  const token           = formData.get("token") as string
  const privacyAccepted = formData.get("privacy_accepted") === "on"
  const termsAccepted   = formData.get("terms_accepted")   === "on"

  if (!privacyAccepted || !termsAccepted) {
    return { error: "Bitte akzeptiere die Datenschutzerklärung und die Nutzungsbedingungen." }
  }

  // Re-validate at submission time — prevents forged requests and race conditions
  const invitation = await validateToken(token)
  if (!invitation.valid) return { error: invitation.reason }

  const supabase = await createClient()
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // sponsor_id is read by the DB trigger — sets it atomically with profile creation
      data: { full_name: `${firstName} ${lastName}`.trim(), sponsor_id: invitation.sponsorId },
    },
  })

  if (signUpError) return { error: signUpError.message }

  if (!signUpData.session) {
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) return { error: "Konto erstellt. Bitte bestätige deine E-Mail und melde dich dann an." }
  }

  const userId = signUpData.user!.id

  // Set sponsor and mark invitation as used in parallel via admin client (bypasses RLS)
  await Promise.all([
    setSponsor(userId, invitation.sponsorId),
    markInvitationUsed(token, userId),
    setConsent(userId),
  ])

  redirect("/")
}

export async function createInvitation(): Promise<{ token: string } | { error: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Nicht angemeldet." }

  const token     = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

  const { error } = await supabase
    .from("invitations")
    .insert({ token, created_by: user.id, expires_at: expiresAt })

  if (error) return { error: error.message }
  return { token }
}

// Foundation slugs that must all be at 100% to unlock Leadership
const LEADERSHIP_REQUIRED_SLUGS = ["produktwissen", "teamaufbau", "kommunikation"]

async function checkAndUnlockLeadership(userId: string): Promise<void> {
  const supabase = await createClient()

  // Get all foundation categories with the required slugs
  const { data: cats } = await supabase
    .from("categories")
    .select("id, slug")
    .in("slug", LEADERSHIP_REQUIRED_SLUGS)
    .eq("type", "foundation")
    .eq("is_active", true)

  if (!cats || cats.length < LEADERSHIP_REQUIRED_SLUGS.length) return

  const catIds = cats.map((c) => c.id)

  // Get all published lessons in these categories
  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, category_id")
    .in("category_id", catIds)
    .eq("is_published", true)

  if (!lessons || lessons.length === 0) return

  // Check if all lessons are completed for the user
  const lessonIds = lessons.map((l) => l.id)
  const { count: completedCount } = await supabase
    .from("lesson_progress")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .in("lesson_id", lessonIds)
    .eq("completed", true)

  if ((completedCount ?? 0) < lessonIds.length) return

  // All lessons in all 3 required foundation categories completed — unlock Leadership
  const { createAdminClient } = await import("./admin")
  const admin = createAdminClient()
  const now   = new Date().toISOString()

  await Promise.all([
    admin.from("profiles").update({ leadership_unlocked: true }).eq("id", userId),
    admin.from("leadership_unlocks").upsert(
      { user_id: userId, unlocked: true, unlocked_at: now },
      { onConflict: "user_id" }
    ),
  ])
}

export async function saveProgress(
  lessonId: string,
  progressPercent: number
): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const clamped   = Math.min(100, Math.max(0, progressPercent))
  const completed = clamped >= 100
  const now       = new Date().toISOString()

  await supabase
    .from("lesson_progress")
    .upsert(
      {
        user_id:          user.id,
        lesson_id:        lessonId,
        progress_percent: clamped,
        completed,
        completed_at:     completed ? now : null,
        updated_at:       now,
      },
      { onConflict: "user_id,lesson_id" }
    )

  // Check Leadership unlock whenever a lesson is completed
  if (completed) {
    await checkAndUnlockLeadership(user.id)
  }
}

export async function removePartner(partnerId: string): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Nicht angemeldet." }

  const { error } = await supabase
    .from("profiles")
    .update({ sponsor_id: null })
    .eq("id", partnerId)
    .eq("sponsor_id", user.id)

  if (error) return { error: error.message }
  return {}
}

export async function updateProfile(data: {
  fullName: string
  avatarUrl: string | null
}): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Nicht angemeldet." }

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: data.fullName, avatar_url: data.avatarUrl })
    .eq("id", user.id)

  if (error) return { error: error.message }
  return {}
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
