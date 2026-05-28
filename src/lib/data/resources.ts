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
    id: "flyer-materialien",
    label: "Flyer & Materialien",
    description: "Aufbereitete Materialien für Präsentationen und Kundengespräche.",
  },
]

// ─── Resources ───────────────────────────────────────────────────────────────

const RESOURCES: Resource[] = [
  // Produktinformationen
  {
    id: "produktuebersicht-strong-og",
    title: "Produktübersicht Strong OG",
    description:
      "Vollständige Übersicht der Inhaltsstoffe, Mineralien und Mikronährstoffe — wissenschaftlich aufbereitet.",
    fileType: "PDF",
    fileSize: "2.4 MB",
    category: "produktinformationen",
  },
  {
    id: "wissenschaftliche-grundlagen",
    title: "Wissenschaftliche Grundlagen",
    description:
      "Hintergrundwissen zur zellulären Mikronährstoffversorgung und zur Bedeutung von Bioverfügbarkeit.",
    fileType: "PDF",
    fileSize: "3.1 MB",
    category: "produktinformationen",
  },
  {
    id: "bioverfuegbarkeit-erklaert",
    title: "Bioverfügbarkeit erklärt",
    description:
      "Warum die Darreichungsform entscheidend ist — und was flüssige Vitalstoffversorgung konkret bedeutet.",
    fileType: "PDF",
    fileSize: "1.8 MB",
    category: "produktinformationen",
  },

  // Flyer & Materialien
  {
    id: "produktflyer-strong-og",
    title: "Produktflyer Strong OG",
    description:
      "Kompakter, hochwertig gestalteter Überblick — ideal als Gesprächsgrundlage mit Interessenten.",
    fileType: "PDF",
    fileSize: "890 KB",
    category: "flyer-materialien",
  },
  {
    id: "praesentation-erstgespraech",
    title: "Präsentation Erstgespräch",
    description:
      "Strukturierte Gesprächsunterlage für das erste Kennenlernen — klar, ruhig, überzeugend.",
    fileType: "PPTX",
    fileSize: "5.2 MB",
    category: "flyer-materialien",
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
    description: "Kompakte Lernzusammenfassung der ersten zwei Lektionen.",
    relatedLesson: "/academy/produktwissen/was-ist-strong-og",
    fileSize: "420 KB",
  },
  {
    id: "mineralien-cheatsheet",
    title: "Infoblatt: Mineralien & Mikronährstoffe",
    description: "Schnellübersicht der wichtigsten Wirkstoffe und ihrer Funktion auf Zellebene.",
    relatedLesson: "/academy/produktwissen/mineralien-mikronährstoffe",
    fileSize: "310 KB",
  },
  {
    id: "fragen-antworten",
    title: "Häufige Fragen & Antworten",
    description: "Die meistgestellten Fragen zu Strong OG — prägnant für den schnellen Nachschlag.",
    fileSize: "280 KB",
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
