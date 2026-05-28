// ─── Types ───────────────────────────────────────────────────────────────────

export type LessonStatus = "done" | "progress" | "open"

export type Lesson = {
  slug: string
  title: string
  description: string
  duration: string
  status: LessonStatus
  pct?: number      // only relevant when status === "progress"
  cover: string     // tailwind gradient classes
}

export type Category = {
  slug: string
  index: string
  name: string
  tagline: string
  description: string
  cover: string     // tailwind gradient classes
  plannedLessons: number  // shown for stub categories (lessons.length === 0)
  lessons: Lesson[]
}

export type LessonContext = {
  category: Category
  lesson: Lesson
  index: number
  prev: Lesson | null
  next: Lesson | null
}

// ─── Computed helpers ────────────────────────────────────────────────────────

export function lessonCount(cat: Category): number {
  return cat.lessons.length > 0 ? cat.lessons.length : cat.plannedLessons
}

export function completedCount(cat: Category): number {
  return cat.lessons.filter((l) => l.status === "done").length
}

export function progressPct(cat: Category): number {
  if (cat.lessons.length === 0) return 0
  return Math.round((completedCount(cat) / cat.lessons.length) * 100)
}

// ─── Data ────────────────────────────────────────────────────────────────────

const CATEGORIES: Category[] = [
  {
    slug: "produktwissen",
    index: "01",
    name: "Produktwissen",
    tagline: "Strong OG",
    description:
      "Strong OG ist eine hochwertige flüssige Vitalstoffversorgung auf Zellebene — mit ausgewählten Mineralien, Mikronährstoffen und optimierter Bioverfügbarkeit für langfristige körperliche Balance.",
    cover: "from-[#9EB88C] to-[#7A9C68]",
    plannedLessons: 1,
    lessons: [
      {
        slug: "was-ist-strong-og",
        title: "Was ist Strong OG?",
        description:
          "Eine Einführung: Strong OG als hochkonzentriertes, flüssiges Vitalstoffpräparat — was es enthält, wie es hergestellt wird und was es von klassischen Kapselpräparaten unterscheidet.",
        duration: "5 Min.",
        status: "done",
        cover: "from-[#A8C094] to-[#7E9E6A]",
      },
    ],
  },
  {
    slug: "teamaufbau",
    index: "02",
    name: "Teamaufbau & Führung",
    tagline: "Leadership",
    description:
      "Dein Team aufbauen, begleiten und als Führungspersönlichkeit wachsen — von den ersten Strukturen bis zu einer nachhaltigen Teamkultur.",
    cover: "from-[#8FAABB] to-[#6A90A6]",
    plannedLessons: 0,
    lessons: [],
  },
  {
    slug: "kommunikation",
    index: "03",
    name: "Kommunikation & Kundenaufbau",
    tagline: "Gespräche & Beziehungen",
    description:
      "Gespräche führen, Menschen begeistern und langfristige Kundenbeziehungen aufbauen — authentisch, ohne Druck, auf Augenhöhe.",
    cover: "from-[#C8A89E] to-[#A88070]",
    plannedLessons: 0,
    lessons: [],
  },
  {
    slug: "gesundheitsgrundlagen",
    index: "04",
    name: "Gesundheitsgrundlagen",
    tagline: "Wissenschaft & Körper",
    description:
      "Die wissenschaftlichen Grundlagen einer gesunden Lebensweise — Mikronährstoffe, Zellbiologie und die Zusammenhänge, die du kennen solltest.",
    cover: "from-[#CCAC80] to-[#AA8C5C]",
    plannedLessons: 0,
    lessons: [],
  },
  {
    slug: "persoenliche-entwicklung",
    index: "05",
    name: "Persönliche Entwicklung",
    tagline: "Mindset & Wachstum",
    description:
      "Mindset, Motivation und persönliche Exzellenz kultivieren — die innere Grundlage für nachhaltigen äußeren Erfolg.",
    cover: "from-[#BCAACE] to-[#9880B4]",
    plannedLessons: 0,
    lessons: [],
  },
  {
    slug: "digitale-werkzeuge",
    index: "06",
    name: "Digitale Werkzeuge",
    tagline: "Tools & Effizienz",
    description:
      "Die richtigen digitalen Werkzeuge kennen und einsetzen — effizienter arbeiten, besser kommunizieren, smarter skalieren.",
    cover: "from-[#A6B8C6] to-[#7898AE]",
    plannedLessons: 0,
    lessons: [],
  },
  {
    slug: "gewerbe-steuern",
    index: "07",
    name: "Gewerbe & Steuern",
    tagline: "Rechtliches & Finanzen",
    description:
      "Rechtliche und steuerliche Grundlagen für deinen Erfolg als selbstständiger Partner — verständlich erklärt, praxisnah aufbereitet.",
    cover: "from-[#BCAA86] to-[#9A8860]",
    plannedLessons: 0,
    lessons: [],
  },
]

// ─── Queries ─────────────────────────────────────────────────────────────────

export function getCategories(): Category[] {
  return CATEGORIES
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug)
}

export function getLessonContext(categorySlug: string, lessonSlug: string): LessonContext | undefined {
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

export function getAllLessonParams(): { slug: string; lessonSlug: string }[] {
  return CATEGORIES.flatMap((cat) =>
    cat.lessons.map((l) => ({ slug: cat.slug, lessonSlug: l.slug }))
  )
}

export type OverallProgress = { pct: number; done: number; total: number }

export function getOverallProgress(): OverallProgress {
  const total = CATEGORIES.reduce((s, c) => s + lessonCount(c), 0)
  const done  = CATEGORIES.reduce((s, c) => s + completedCount(c), 0)
  return { pct: total > 0 ? Math.round((done / total) * 100) : 0, done, total }
}

export type NextLessonResult = {
  category: Category
  lesson: Lesson
  index: number
  isResume: boolean   // true = in-progress, false = new
}

export function getNextLesson(): NextLessonResult | null {
  // Prefer first in-progress lesson across all categories
  for (const category of CATEGORIES) {
    const idx = category.lessons.findIndex((l) => l.status === "progress")
    if (idx !== -1) return { category, lesson: category.lessons[idx], index: idx, isResume: true }
  }
  // Fall back to first open lesson
  for (const category of CATEGORIES) {
    const idx = category.lessons.findIndex((l) => l.status === "open")
    if (idx !== -1) return { category, lesson: category.lessons[idx], index: idx, isResume: false }
  }
  return null
}
