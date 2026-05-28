import { Search } from "lucide-react"
import Link from "next/link"
import { getCategories, lessonCount, progressPct } from "@/lib/data/academy"
import { MediaCover } from "@/components/features/MediaCover"

export default function AcademyPage() {
  const categories = getCategories()
  const totalLessons = categories.reduce((s, c) => s + lessonCount(c), 0)

  return (
    <div className="space-y-12">

      {/* Hero */}
      <section className="pt-2">
        <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-5">
          Strong Academy
        </p>
        <h1 className="text-[2.25rem] font-semibold text-[#1A1714] tracking-tight leading-[1.2] max-w-lg">
          Wissen, das dein<br />Business verändert.
        </h1>
        <p className="mt-5 text-[15px] text-[#8C7E6F] leading-relaxed">
          {categories.length} Kategorien{totalLessons > 0 ? ` · ${totalLessons} ${totalLessons === 1 ? "Lektion" : "Lektionen"}` : ""}
        </p>
      </section>

      {/* Search */}
      <section>
        <div className="relative max-w-lg">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C4B9B0]"
            strokeWidth={1.75}
          />
          <input
            type="text"
            placeholder="Thema oder Stichwort suchen …"
            className="w-full pl-11 pr-5 py-3.5 text-[14px] bg-[#F5F0E8] border border-[#E8E2D9] rounded-xl text-[#1A1714] placeholder:text-[#C4B9B0] focus:outline-none focus:ring-2 focus:ring-[#5B2D8E]/12 focus:border-[#5B2D8E]/25 transition-all"
          />
        </div>
      </section>

      {/* Category Grid */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const pct = progressPct(cat)
            return (
              <Link
                key={cat.slug}
                href={`/academy/${cat.slug}`}
                className="group rounded-2xl overflow-hidden border border-[#E8E2D9] hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col"
              >
                {/* Cover */}
                <MediaCover
                  gradient={cat.cover}
                  index={cat.index}
                  className="h-44 shrink-0"
                />

                {/* Content */}
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

                  {/* Progress */}
                  <div className="mt-5 pt-4 border-t border-[#EDE8DF]">
                    {pct > 0 ? (
                      <>
                        <div className="h-[2px] w-full rounded-full bg-[#E3DDD5] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#5B2D8E]/35 transition-all duration-700"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <p className="mt-2 text-[11px] text-[#B8AFA7] tabular-nums">
                          {pct}% abgeschlossen
                        </p>
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

    </div>
  )
}
