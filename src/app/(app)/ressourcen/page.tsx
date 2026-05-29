import Link from "next/link"
import { ArrowUpRight, FileText } from "lucide-react"
import { getResources, type ContentResource } from "@/lib/supabase/content"

export const dynamic = "force-dynamic"

const RESOURCE_CATEGORIES = [
  {
    id:          "produktinformationen",
    label:       "Produktinformationen",
    description: "Fachliche Unterlagen zu Strong OG — für dein Wissen und deine Gespräche.",
  },
  {
    id:          "infomaterial-kunden",
    label:       "Infomaterial für Kunden",
    description: "Professionell aufbereitete Unterlagen für Kundengespräche und persönliche Weitergabe.",
  },
  {
    id:          "gesundheitskonzept",
    label:       "Gesundheitskonzept",
    description: "Vorlagen, Fragebögen und strukturierte Unterlagen für die individuelle Gesundheitsberatung deiner Kunden.",
  },
]

const FILE_COLORS: Record<string, string> = {
  PDF:  "bg-[#F0EBF8] text-[#5B2D8E]",
  PPTX: "bg-[#EDF3F0] text-[#3A7A5C]",
  JPEG: "bg-[#F5EFE8] text-[#8A6040]",
  PNG:  "bg-[#F5EFE8] text-[#8A6040]",
  DOCX: "bg-[#F5EFE8] text-[#8A6040]",
}

function ResourceCard({ resource }: { resource: ContentResource }) {
  const fileType = resource.file_type ?? "PDF"
  return (
    <a
      href={resource.file_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-[#F5F0E8] hover:bg-[#EDE8DF] border border-[#E8E2D9] rounded-2xl p-6 flex flex-col transition-all hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <span className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-md tracking-wider ${FILE_COLORS[fileType] ?? FILE_COLORS.PDF}`}>
          {fileType}
        </span>
        {resource.file_size && (
          <span className="text-[11px] text-[#C4B9B0] tabular-nums shrink-0">{resource.file_size}</span>
        )}
      </div>

      <div className="flex-1">
        <h3 className="text-[15px] font-semibold text-[#1A1714] leading-snug">
          {resource.title}
        </h3>
        {resource.description && (
          <p className="mt-2 text-[13px] text-[#9E9188] leading-relaxed">
            {resource.description}
          </p>
        )}
      </div>

      <div className="mt-5 pt-4 border-t border-[#EDE8DF]">
        <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#5B2D8E] group-hover:gap-2 transition-all">
          Ansehen
          <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2} />
        </span>
      </div>
    </a>
  )
}

function EmptyState() {
  return (
    <div className="bg-[#F5F0E8] rounded-2xl border border-[#E8E2D9] px-8 py-12 text-center">
      <div className="w-10 h-10 rounded-xl bg-[#EDE8DF] flex items-center justify-center mx-auto mb-4">
        <FileText className="w-4 h-4 text-[#C4B9B0]" strokeWidth={1.5} />
      </div>
      <p className="text-[14px] text-[#B8AFA7]">Unterlagen folgen in Kürze.</p>
    </div>
  )
}

export default async function RessourcenPage() {
  const allResources = await getResources()

  return (
    <div className="space-y-14">

      <section className="pt-2">
        <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-5">
          Ressourcen
        </p>
        <h1 className="text-[1.85rem] sm:text-[2.25rem] font-semibold text-[#1A1714] tracking-tight leading-[1.2] max-w-lg">
          Unterlagen für dein<br />tägliches Business.
        </h1>
        <p className="mt-5 text-[15px] text-[#8C7E6F] leading-relaxed max-w-md">
          Sorgfältig aufbereitete Materialien — zum Lernen, Nachschlagen und Weitergeben.
        </p>
      </section>

      {RESOURCE_CATEGORIES.map((cat) => {
        const items = allResources.filter((r) => r.category === cat.id)
        return (
          <section key={cat.id}>
            <div className="mb-6">
              <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-1">
                {cat.label}
              </p>
              <p className="text-[13px] text-[#9E9188]">{cat.description}</p>
            </div>

            {items.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            )}
          </section>
        )
      })}

      {/* Uncategorized resources */}
      {allResources.filter((r) => !RESOURCE_CATEGORIES.find((c) => c.id === r.category)).length > 0 && (
        <section>
          <div className="mb-6">
            <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-1">
              Weitere Unterlagen
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allResources
              .filter((r) => !RESOURCE_CATEGORIES.find((c) => c.id === r.category))
              .map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
          </div>
        </section>
      )}

    </div>
  )
}
