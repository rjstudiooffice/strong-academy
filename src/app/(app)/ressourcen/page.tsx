import Link from "next/link"
import { ArrowUpRight, FileText, Presentation } from "lucide-react"
import {
  RESOURCE_CATEGORIES,
  getResourcesByCategory,
  getHandouts,
  type Resource,
  type Handout,
} from "@/lib/data/resources"

// ─── Sub-components ──────────────────────────────────────────────────────────

function FileTypeBadge({ type }: { type: Resource["fileType"] }) {
  const colors: Record<string, string> = {
    PDF:  "bg-[#F0EBF8] text-[#5B2D8E]",
    PPTX: "bg-[#EDF3F0] text-[#3A7A5C]",
    JPEG: "bg-[#F5EFE8] text-[#8A6040]",
  }
  return (
    <span className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-md tracking-wider ${colors[type] ?? colors.PDF}`}>
      {type}
    </span>
  )
}

function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <div className="group bg-[#F5F0E8] hover:bg-[#EDE8DF] border border-[#E8E2D9] rounded-2xl p-6 flex flex-col transition-all hover:shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-4">
        <FileTypeBadge type={resource.fileType} />
        {resource.fileSize && (
          <span className="text-[11px] text-[#C4B9B0] tabular-nums shrink-0">{resource.fileSize}</span>
        )}
      </div>

      <div className="flex-1">
        <h3 className="text-[15px] font-semibold text-[#1A1714] leading-snug">
          {resource.title}
        </h3>
        <p className="mt-2 text-[13px] text-[#9E9188] leading-relaxed">
          {resource.description}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-[#EDE8DF]">
        <button className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#5B2D8E] hover:text-[#4A2478] transition-colors group-hover:gap-2">
          Ansehen
          <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}

function HandoutRow({ handout }: { handout: Handout }) {
  const inner = (
    <div className="group flex items-start justify-between gap-4 bg-[#F5F0E8] hover:bg-[#EDE8DF] border border-[#E8E2D9] rounded-xl px-5 py-4 transition-all cursor-pointer">
      <div className="flex items-start gap-3 min-w-0">
        <FileText className="w-4 h-4 text-[#C4B9B0] mt-0.5 shrink-0" strokeWidth={1.5} />
        <div className="min-w-0">
          <p className="text-[14px] font-medium text-[#1A1714] leading-snug">
            {handout.title}
          </p>
          <p className="mt-1 text-[12px] text-[#9E9188] leading-relaxed">
            {handout.description}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {handout.fileSize && (
          <span className="text-[11px] text-[#C4B9B0] tabular-nums hidden sm:block">{handout.fileSize}</span>
        )}
        <ArrowUpRight className="w-3.5 h-3.5 text-[#C4B9B0] group-hover:text-[#5B2D8E] transition-colors" strokeWidth={2} />
      </div>
    </div>
  )

  return handout.relatedLesson ? (
    <Link href={handout.relatedLesson}>{inner}</Link>
  ) : (
    <>{inner}</>
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

// ─── Page ────────────────────────────────────────────────────────────────────

export default function RessourcenPage() {
  const handouts = getHandouts()

  return (
    <div className="space-y-14">

      {/* Hero */}
      <section className="pt-2">
        <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-5">
          Ressourcen
        </p>
        <h1 className="text-[2.25rem] font-semibold text-[#1A1714] tracking-tight leading-[1.2] max-w-lg">
          Unterlagen für dein<br />tägliches Business.
        </h1>
        <p className="mt-5 text-[15px] text-[#8C7E6F] leading-relaxed max-w-md">
          Sorgfältig aufbereitete Materialien — zum Lernen, Nachschlagen und Weitergeben.
        </p>
      </section>

      {/* Resource Categories */}
      {RESOURCE_CATEGORIES.map((cat) => {
        const items = getResourcesByCategory(cat.id)
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

      {/* Handouts */}
      <section>
        <div className="mb-6">
          <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-1">
            Handouts & Zusammenfassungen
          </p>
          <p className="text-[13px] text-[#9E9188]">
            Kompakte Lernunterlagen — passend zu den Akademie-Lektionen.
          </p>
        </div>

        {handouts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-2">
            {handouts.map((h) => (
              <HandoutRow key={h.id} handout={h} />
            ))}
          </div>
        )}
      </section>

    </div>
  )
}
