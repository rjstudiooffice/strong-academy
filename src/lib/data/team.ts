// ─── Types ───────────────────────────────────────────────────────────────────

export type TeamMember = {
  id: string
  firstName: string
  lastName: string
  joinedAt: string       // display string — will be formatted from profiles.created_at
  lastActive: string     // display string — will be computed from last_seen
  overallPct: number
  completedLessons: number
  categoryPcts: { slug: string; name: string; pct: number }[]
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function memberInitials(m: TeamMember): string {
  return `${m.firstName[0]}${m.lastName[0]}`.toUpperCase()
}

export function memberFullName(m: TeamMember): string {
  return `${m.firstName} ${m.lastName}`
}

// Avatar colors — one per member slot, warm and calm
const AVATAR_COLORS = [
  "bg-[#7A9C68]",   // sage
  "bg-[#A88070]",   // terracotta
  "bg-[#6A90A6]",   // blue-grey
  "bg-[#9880B4]",   // lavender
  "bg-[#AA8C5C]",   // sand
]

export function memberAvatarColor(index: number): string {
  return AVATAR_COLORS[index % AVATAR_COLORS.length]
}

// ─── Mock data — will come from Supabase team/profiles query ─────────────────
// TODO: replace with:
// supabase.from("team_members").select("*, profiles(*)").eq("invited_by", userId)

const MOCK_TEAM: TeamMember[] = [
  {
    id: "tm-1",
    firstName: "Thomas",
    lastName: "Wagner",
    joinedAt: "Februar 2024",
    lastActive: "gestern",
    overallPct: 45,
    completedLessons: 4,
    categoryPcts: [
      { slug: "produktwissen",      name: "Produktwissen",      pct: 80 },
      { slug: "kommunikation",      name: "Kommunikation",      pct: 40 },
      { slug: "gesundheitsgrundlagen", name: "Gesundheitsgrundlagen", pct: 20 },
    ],
  },
  {
    id: "tm-2",
    firstName: "Maria",
    lastName: "Schneider",
    joinedAt: "März 2024",
    lastActive: "vor 3 Tagen",
    overallPct: 30,
    completedLessons: 2,
    categoryPcts: [
      { slug: "produktwissen",      name: "Produktwissen",      pct: 60 },
      { slug: "persoenliche-entwicklung", name: "Pers. Entwicklung", pct: 15 },
    ],
  },
  {
    id: "tm-3",
    firstName: "Felix",
    lastName: "Braun",
    joinedAt: "April 2024",
    lastActive: "heute",
    overallPct: 15,
    completedLessons: 1,
    categoryPcts: [
      { slug: "produktwissen",      name: "Produktwissen",      pct: 25 },
    ],
  },
]

export function getTeamMembers(): TeamMember[] {
  return MOCK_TEAM
}

export function hasTeamMembers(): boolean {
  return MOCK_TEAM.length > 0
}

// Invite link — will be generated from user ID + short token in Supabase
// Returns the path — InviteButton prepends window.location.origin for the full shareable URL.
// In production: will use the real Supabase-generated token instead of userId.
export function getInviteLink(userId: string): string {
  return `/einladung?ref=${userId}`
}
