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
  coverImage?: string   // category card image
  heroImage?: string    // category detail banner
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
    coverImage: "/leadership_culture_category_card.png",
    heroImage: "/leadership_culture_hero.png",
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
    coverImage: "/vision_strategy_category_card.png",
    heroImage: "/vision_strategy_hero.png",
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
    coverImage: "/multiplication_category_card.png",
    heroImage: "/multiplication_hero.png",
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
    coverImage: "/leadership_psychology_category_card.png",
    heroImage: "/leadership_psychology_hero.png",
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

// Leadership unlock is now DB-backed via profiles.leadership_unlocked.
// These helpers remain for future use when the unlock logic is wired to DB.
export function isLeadershipUnlocked(): boolean {
  return false
}

export function getProgressToUnlock(currentPct = 0): { current: number; needed: number; remaining: number; pct: number } {
  const needed = UNLOCK_THRESHOLD
  return {
    current:   currentPct,
    needed,
    remaining: Math.max(0, needed - currentPct),
    pct:       Math.min(100, Math.round((currentPct / needed) * 100)),
  }
}

export type LeadershipLesson = LeadershipCategory["lessons"][number]

export type LeadershipLessonContext = {
  category: LeadershipCategory
  lesson: LeadershipLesson
  index: number
  prev: LeadershipLesson | null
  next: LeadershipLesson | null
}

export function getLeadershipLessonContext(categorySlug: string, lessonSlug: string): LeadershipLessonContext | undefined {
  const category = CATEGORIES.find((c) => c.slug === categorySlug)
  if (!category) return undefined
  const index = category.lessons.findIndex((l) => l.slug === lessonSlug)
  if (index === -1) return undefined
  return {
    category,
    lesson: category.lessons[index],
    index,
    prev: index > 0 ? category.lessons[index - 1] : null,
    next: index < category.lessons.length - 1 ? category.lessons[index + 1] : null,
  }
}

export function getAllLeadershipLessonParams(): { slug: string; lessonSlug: string }[] {
  return CATEGORIES.flatMap((cat) =>
    cat.lessons.map((l) => ({ slug: cat.slug, lessonSlug: l.slug }))
  )
}
