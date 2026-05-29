// Pure types and helpers — no server imports, safe for client components.

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
