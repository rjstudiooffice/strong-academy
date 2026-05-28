// ─── Types ───────────────────────────────────────────────────────────────────

export type ResourceType = "PDF" | "PPTX" | "JPEG"

export type ResourceCategory = {
  id: string
  label: string
  description: string
}

export type Resource = {
  id: string
  title: string
  description: string
  fileType: ResourceType
  fileSize?: string
  category: string   // matches ResourceCategory.id
}

// ─── Categories ──────────────────────────────────────────────────────────────

export const RESOURCE_CATEGORIES: ResourceCategory[] = [
  {
    id: "produktinformationen",
    label: "Produktinformationen",
    description: "Fachliche Unterlagen zu Strong OG — für dein Wissen und deine Gespräche.",
  },
  {
    id: "infomaterial-kunden",
    label: "Infomaterial für Kunden",
    description: "Professionell aufbereitete Unterlagen für Kundengespräche und persönliche Weitergabe.",
  },
  {
    id: "gesundheitskonzept",
    label: "Gesundheitskonzept",
    description: "Vorlagen, Fragebögen und strukturierte Unterlagen für die individuelle Gesundheitsberatung deiner Kunden.",
  },
]

// ─── Resources ───────────────────────────────────────────────────────────────

const RESOURCES: Resource[] = [
  {
    id: "produktuebersicht-strong-og",
    title: "Produktübersicht Strong OG",
    description:
      "Vollständige Übersicht der Inhaltsstoffe, Mineralien und Mikronährstoffe — wissenschaftlich aufbereitet.",
    fileType: "PDF",
    fileSize: "2.4 MB",
    category: "produktinformationen",
  },
]

// ─── Handouts ────────────────────────────────────────────────────────────────

export type Handout = {
  id: string
  title: string
  description: string
  relatedLesson?: string   // optional link to an academy lesson
  fileSize?: string
}

const HANDOUTS: Handout[] = [
  {
    id: "zusammenfassung-strong-og",
    title: "Zusammenfassung: Was ist Strong OG?",
    description: "Kompakte Lernzusammenfassung zur ersten Lektion.",
    relatedLesson: "/academy/produktwissen/was-ist-strong-og",
    fileSize: "420 KB",
  },
]

// ─── Queries ─────────────────────────────────────────────────────────────────

export function getResourcesByCategory(categoryId: string): Resource[] {
  return RESOURCES.filter((r) => r.category === categoryId)
}

export function getAllResources(): Resource[] {
  return RESOURCES
}

export function getHandouts(): Handout[] {
  return HANDOUTS
}
