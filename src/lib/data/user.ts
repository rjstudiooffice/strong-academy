// Legacy types — kept for team.ts and other mock data still in use.
// New code uses Profile from @/lib/supabase/profile.

export type UserRole = "partner" | "admin"

export type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  role: UserRole
  language: string
  memberSince: string
  avatarUrl?: string
}

export function userFullName(u: User): string {
  return `${u.firstName} ${u.lastName}`
}

export function userInitials(u: User): string {
  return `${u.firstName[0]}${u.lastName[0]}`.toUpperCase()
}

export function isAdmin(u: User): boolean {
  return u.role === "admin"
}
