import { createClient } from "./server"

export type Profile = {
  id: string
  email: string
  full_name: string
  avatar_url: string | null
  role: "admin" | "partner"
  leadership_unlocked: boolean
  created_at: string
}

export function profileInitials(p: Profile): string {
  return p.full_name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "?"
}

export function profileFirstName(p: Profile): string {
  return p.full_name.split(" ")[0] || p.email.split("@")[0]
}

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Requires RLS policy "profiles_select_own" — see migration 20260529000002
  const { data: row } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, role, leadership_unlocked, created_at")
    .eq("id", user.id)
    .single()

  const full_name =
    row?.full_name ??
    (user.user_metadata?.full_name as string | undefined) ??
    user.email?.split("@")[0] ??
    "Unbekannt"

  return {
    id:                  user.id,
    email:               user.email ?? "",
    full_name,
    avatar_url:          row?.avatar_url ?? null,
    role:                (row?.role ?? "partner") as "admin" | "partner",
    leadership_unlocked: row?.leadership_unlocked ?? false,
    created_at:          row?.created_at ?? user.created_at,
  }
}
