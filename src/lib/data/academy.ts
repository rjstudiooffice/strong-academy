// ─── Types ───────────────────────────────────────────────────────────────────
// Content configuration — UI metadata only.
// Progress (completed, pct) comes from DB via lib/supabase/progress.ts.

export type LessonAttachmentType = "PDF" | "PPTX" | "DOCX"

export type LessonAttachment = {
  title: string
  fileType: LessonAttachmentType
  fileSize?: string
  href?: string
}

export type Lesson = {
  slug: string
  title: string
  description: string
  duration: string
  cover: string
  attachments?: LessonAttachment[]
}

export type Category = {
  slug: string
  index: string
  name: string
  tagline: string
  description: string
  cover: string
  coverImage?: string
  heroImage?: string
  lessons: Lesson[]
}

export type LessonContext = {
  category: Category
  lesson: Lesson
  index: number
  prev: Lesson | null
  next: Lesson | null
}

// ─── Foundation / Library split ──────────────────────────────────────────────

const FOUNDATION_SLUGS = new Set(["produktwissen", "teamaufbau", "kommunikation"])

export function isFoundation(cat: Category): boolean {
  return FOUNDATION_SLUGS.has(cat.slug)
}

export function getFoundationCategories(): Category[] {
  return CATEGORIES.filter(isFoundation)
}

export function getLibraryCategories(): Category[] {
  return CATEGORIES.filter((c) => !isFoundation(c))
}

export function lessonCount(cat: Category): number {
  return cat.lessons.length
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
    coverImage: "/produktwissen_category_card.png",
    heroImage: "/produktwissen_hero.png",
    lessons: [
      {
        slug:        "was-ist-strong-og",
        title:       "Was ist Strong OG?",
        description: "Eine Einführung: Strong OG als hochkonzentriertes, flüssiges Vitalstoffpräparat — was es enthält, wie es hergestellt wird und was es von klassischen Kapselpräparaten unterscheidet.",
        duration:    "5 Min.",
        cover:       "from-[#A8C094] to-[#7E9E6A]",
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
    coverImage: "/teamaufbau_fuehrung_category_card.png",
    heroImage: "/teamaufbau_fuehrung_hero.png",
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
    coverImage: "/kommunikation_kundenaufbau_category_card.png",
    heroImage: "/kommunikation_kundenaufbau_hero.png",
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
    coverImage: "/gesundheitsgrundlagen_category_card.png",
    heroImage: "/gesundheitsgrundlagen_hero.png",
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
    coverImage: "/persoenliche_entwicklung_category_card.png",
    heroImage: "/persoenliche_entwicklung_hero.png",
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
    coverImage: "/digitale_werkzeuge_category_card.png",
    heroImage: "/digitale_werkzeuge_hero.png",
    lessons: [],
  },
  {
    slug: "social-media",
    index: "07",
    name: "Social Media",
    tagline: "Sichtbarkeit & Content",
    description:
      "Digitale Sichtbarkeit aufbauen — mit Authentizität, Klarheit und einem ruhigen strategischen Ansatz für moderne Online-Kommunikation.",
    cover: "from-[#C4A0A8] to-[#A67E88]",
    coverImage: "/social_media_category_card.png",
    heroImage: "/social_media_hero.png",
    lessons: [],
  },
  {
    slug: "gewerbe-steuern",
    index: "08",
    name: "Gewerbe & Steuern",
    tagline: "Rechtliches & Finanzen",
    description:
      "Rechtliche und steuerliche Grundlagen für deinen Erfolg als selbstständiger Partner — verständlich erklärt, praxisnah aufbereitet.",
    cover: "from-[#BCAA86] to-[#9A8860]",
    coverImage: "/gewerbe_steuern_category_card.png",
    heroImage: "/gewerbe_steuern_hero.png",
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
