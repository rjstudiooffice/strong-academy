import { Search } from "lucide-react"
import Link from "next/link"
import {
  getFoundationCategories,
  getLibraryCategories,
  lessonCount,
  progressPct,
} from "@/lib/data/academy"
import { MediaCover } from "@/components/features/MediaCover"

export default function AcademyPage() {
  const foundation = getFoundationCategories()
  const library    = getLibraryCategories()

  return (
    <div className="space-y-16">

      {/* Hero */}
      <section className="pt-2">
        <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-5">
          Strong Academy
        </p>
        <h1 className="text-[1.85rem] sm:text-[2.25rem] font-semibold text-[#1A1714] tracking-tight leading-[1.2] max-w-lg">
          Wissen, das dein<br />Business verändert.
        </h1>
      </section>

      {/* ── Foundation Academy ─────────────────────────────────────────────── */}
      <section>
        <div className="mb-6">
          <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-1">
            Foundation Academy
          </p>
          <p className="text-[13px] text-[#9E9188]">
            Deine strukturierte Basisausbildung — aufeinander aufbauend.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {foundation.map((cat) => {
            const pct = progressPct(cat)
            return (
              <Link
                key={cat.slug}
                href={`/academy/${cat.slug}`}
                className="group rounded-2xl overflow-hidden border border-[#E8E2D9] hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col"
              >
                <MediaCover gradient={cat.cover} imageSrc={cat.coverImage} index={cat.index} className="h-44 shrink-0" />
                <div className="bg-[#F5F0E8] px-6 py-5 flex flex-col flex-1">
                  <div className="flex-1">
                    <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-2">
                      {lessonCount(cat) > 0 ? `${lessonCount(cat)} ${lessonCount(cat) === 1 ? "Lektion" : "Lektionen"}` : "Folgt"}
                    </p>
                    <h3 className="text-[16px] font-semibold text-[#1A1714] leading-snug hyphens-auto">
                      {cat.name}
                    </h3>
                    <p className="mt-2 text-[13px] text-[#9E9188] leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-[#EDE8DF]">
                    {pct > 0 ? (
                      <>
                        <div className="h-[2px] w-full rounded-full bg-[#E3DDD5] overflow-hidden">
                          <div className="h-full rounded-full bg-[#5B2D8E]/35 transition-all duration-700" style={{ width: `${pct}%` }} />
                        </div>
                        <p className="mt-2 text-[11px] text-[#B8AFA7] tabular-nums">{pct}% abgeschlossen</p>
                      </>
                    ) : (
                      <p className="text-[11px] text-[#C4B9B0]">Noch nicht begonnen</p>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ── Wissensbibliothek ──────────────────────────────────────────────── */}
      <section>
        <div className="mb-7">
          <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-1">
            Wissensbibliothek
          </p>
        </div>

        {/* Dezente Suche */}
        <form action="/suche" method="get" className="mb-7 max-w-sm">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#C4B9B0] pointer-events-none" strokeWidth={1.75} />
            <input
              type="search"
              name="q"
              placeholder="Thema suchen …"
              className="w-full pl-10 pr-4 py-2.5 text-[13px] bg-[#F5F0E8] border border-[#E8E2D9] rounded-xl text-[#1A1714] placeholder:text-[#C4B9B0] focus:outline-none focus:ring-2 focus:ring-[#5B2D8E]/12 focus:border-[#5B2D8E]/25 transition-all"
            />
          </div>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {library.map((cat) => (
            <Link
              key={cat.slug}
              href={`/academy/${cat.slug}`}
              className="group rounded-2xl overflow-hidden border border-[#E8E2D9] hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col"
            >
              <MediaCover gradient={cat.cover} imageSrc={cat.coverImage} className="h-40 shrink-0" />
              <div className="bg-[#F5F0E8] px-6 py-5 flex flex-col flex-1">
                <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-2">
                  {cat.tagline}
                </p>
                <h3 className="text-[16px] font-semibold text-[#1A1714] leading-snug hyphens-auto">
                  {cat.name}
                </h3>
                <p className="mt-2 text-[13px] text-[#9E9188] leading-relaxed">
                  {cat.description}
                </p>
                <p className="mt-4 text-[12px] text-[#C4B9B0]">
                  Inhalte folgen
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  )
}
