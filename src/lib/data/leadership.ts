import { getOverallProgress } from "./academy"

// ─── Config ──────────────────────────────────────────────────────────────────

export const UNLOCK_THRESHOLD = 75   // % overall progress required

// ─── Types ───────────────────────────────────────────────────────────────────

export type LeadershipCategory = {
  slug: string
  index: string
  name: string
  tagline: string
  description: string
  cover: string
  plannedLessons: number
  lessons: {
    slug: string
    title: string
    description: string
    duration: string
    cover: string
  }[]
}

// ─── Data ────────────────────────────────────────────────────────────────────

const CATEGORIES: LeadershipCategory[] = [
  {
    slug: "leadership-kultur",
    index: "01",
    name: "Leadership & Kultur",
    tagline: "Grundlagen",
    description:
      "Was Führung wirklich bedeutet — Haltung, Verantwortung und die Kultur, die du in deinem Team erschaffst.",
    cover: "from-[#7A8C6A] to-[#5A6A4A]",
    plannedLessons: 0,
    lessons: [],
  },
  {
    slug: "vision-strategie",
    index: "02",
    name: "Vision & Strategie",
    tagline: "Langfristiges Denken",
    description:
      "Wie du eine klare Vision entwickelst und daraus eine Strategie baust, die dein Team trägt und bewegt.",
    cover: "from-[#8A7A9A] to-[#6A5A7A]",
    plannedLessons: 0,
    lessons: [],
  },
  {
    slug: "multiplikation",
    index: "03",
    name: "Multiplikation",
    tagline: "Systeme & Wachstum",
    description:
      "Strukturen aufbauen, die ohne dich funktionieren — nachhaltiges Wachstum durch Menschen, nicht nur durch Aktivität.",
    cover: "from-[#9A8070] to-[#7A6050]",
    plannedLessons: 0,
    lessons: [],
  },
  {
    slug: "leadership-psychology",
    index: "04",
    name: "Leadership Psychology",
    tagline: "Menschen & Dynamiken",
    description:
      "Die psychologischen Grundlagen von Teamdynamiken, Motivation und dem, was Menschen wirklich bewegt.",
    cover: "from-[#8A9AA8] to-[#6A7A88]",
    plannedLessons: 0,
    lessons: [],
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getLeadershipCategories(): LeadershipCategory[] {
  return CATEGORIES
}

export function getLeadershipCategoryBySlug(slug: string): LeadershipCategory | undefined {
  return CATEGORIES.find((c) => c.slug === slug)
}

export function isLeadershipUnlocked(): boolean {
  return getOverallProgress().pct >= UNLOCK_THRESHOLD
}

export function getProgressToUnlock(): { current: number; needed: number; remaining: number; pct: number } {
  const current = getOverallProgress().pct
  const needed  = UNLOCK_THRESHOLD
  return {
    current,
    needed,
    remaining: Math.max(0, needed - current),
    pct: Math.min(100, Math.round((current / needed) * 100)),
  }
}
