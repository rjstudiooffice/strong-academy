// ─── Type ────────────────────────────────────────────────────────────────────
// Matches what Supabase auth + profiles table will return.
// Replace getCurrentUser() with an async Supabase call when auth is wired up.

export type UserRole = "partner" | "admin"

export type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  role: UserRole
  language: string
  memberSince: string   // display string — will be formatted from profiles.created_at
  avatarUrl?: string
}

// ─── Computed helpers ────────────────────────────────────────────────────────

export function userFullName(u: User): string {
  return `${u.firstName} ${u.lastName}`
}

export function userInitials(u: User): string {
  return `${u.firstName[0]}${u.lastName[0]}`.toUpperCase()
}

// ─── Mock data — swap this for a Supabase profiles query ─────────────────────

const MOCK_USER: User = {
  id:           "mock-user-1",
  firstName:    "Anna",
  lastName:     "Müller",
  email:        "anna.mueller@example.com",
  role:         "partner",
  language:     "Deutsch",
  memberSince:  "Mai 2024",
}

// TODO: replace with async getCurrentUser() once Supabase auth is integrated.
// Pattern: const { data: { user } } = await supabase.auth.getUser()
//          + const { data: profile } = await supabase.from("profiles").select().eq("id", user.id).single()
export function getCurrentUser(): User {
  return MOCK_USER
}
