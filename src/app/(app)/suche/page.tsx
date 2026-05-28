"use client"

import { useState, useMemo, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Search, ArrowRight, BookOpen, FolderOpen, FileText } from "lucide-react"
import { getCategories, lessonCount } from "@/lib/data/academy"
import { getAllResources, getHandouts } from "@/lib/data/resources"

// ─── Search index (built once) ───────────────────────────────────────────────

type ResultType = "category" | "lesson" | "resource"

type SearchResult = {
  type: ResultType
  title: string
  description: string
  meta: string
  href: string
}

function buildIndex(): SearchResult[] {
  const items: SearchResult[] = []

  for (const cat of getCategories()) {
    items.push({
      type: "category",
      title: cat.name,
      description: cat.description,
      meta: `${lessonCount(cat)} Lektionen`,
      href: `/academy/${cat.slug}`,
    })
    for (const [i, lesson] of cat.lessons.entries()) {
      items.push({
        type: "lesson",
        title: lesson.title,
        description: lesson.description,
        meta: `${cat.name} · Lektion ${i + 1}`,
        href: `/academy/${cat.slug}/${lesson.slug}`,
      })
    }
  }

  for (const r of getAllResources()) {
    items.push({
      type: "resource",
      title: r.title,
      description: r.description,
      meta: r.fileType + (r.fileSize ? ` · ${r.fileSize}` : ""),
      href: "#",
    })
  }

  for (const h of getHandouts()) {
    items.push({
      type: "resource",
      title: h.title,
      description: h.description,
      meta: "Handout" + (h.fileSize ? ` · ${h.fileSize}` : ""),
      href: h.relatedLesson ?? "#",
    })
  }

  return items
}

const INDEX = buildIndex()

function search(query: string): SearchResult[] {
  const q = query.toLowerCase().trim()
  if (q.length < 2) return []
  return INDEX.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.meta.toLowerCase().includes(q)
  )
}

// ─── Result type config ──────────────────────────────────────────────────────

const TYPE_CONFIG: Record<ResultType, { label: string; icon: React.ElementType }> = {
  category: { label: "Kategorien",  icon: FolderOpen },
  lesson:   { label: "Lektionen",   icon: BookOpen   },
  resource: { label: "Ressourcen",  icon: FileText   },
}

const TYPE_ORDER: ResultType[] = ["category", "lesson", "resource"]

// ─── Components ──────────────────────────────────────────────────────────────

function ResultCard({ result }: { result: SearchResult }) {
  const { icon: Icon } = TYPE_CONFIG[result.type]
  return (
    <Link
      href={result.href}
      className="group flex items-start gap-4 bg-[#F5F0E8] hover:bg-[#EDE8DF] border border-[#E8E2D9] rounded-2xl px-5 py-4 transition-all"
    >
      <div className="w-8 h-8 rounded-lg bg-[#EDE8DF] group-hover:bg-[#E3DDD5] flex items-center justify-center shrink-0 mt-0.5 transition-colors">
        <Icon className="w-3.5 h-3.5 text-[#9E9188]" strokeWidth={1.75} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-[#1A1714] leading-snug">{result.title}</p>
        <p className="mt-1 text-[12px] text-[#9E9188] leading-relaxed line-clamp-2">{result.description}</p>
        <p className="mt-1.5 text-[11px] text-[#B8AFA7]">{result.meta}</p>
      </div>
      <ArrowRight
        className="w-3.5 h-3.5 text-[#C4B9B0] group-hover:text-[#5B2D8E] group-hover:translate-x-0.5 transition-all shrink-0 mt-1"
        strokeWidth={2}
      />
    </Link>
  )
}

// ─── Inner page (uses useSearchParams) ───────────────────────────────────────

function SearchPageInner() {
  const params = useSearchParams()
  const initial = params.get("q") ?? ""
  const [query, setQuery] = useState(initial)

  // Sync if URL param changes
  useEffect(() => { setQuery(params.get("q") ?? "") }, [params])

  const results = useMemo(() => search(query), [query])

  const grouped = useMemo(() => {
    const map = new Map<ResultType, SearchResult[]>()
    for (const r of results) {
      if (!map.has(r.type)) map.set(r.type, [])
      map.get(r.type)!.push(r)
    }
    return map
  }, [results])

  const hasQuery  = query.trim().length >= 2
  const hasResult = results.length > 0

  return (
    <div className="space-y-10 pt-2 max-w-2xl">

      {/* Hero */}
      <section>
        <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-5">Suche</p>
        <h1 className="text-[1.65rem] sm:text-[2rem] font-semibold text-[#1A1714] tracking-tight leading-tight">
          Was möchtest du<br />wissen?
        </h1>
      </section>

      {/* Search Input */}
      <section>
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C4B9B0] pointer-events-none"
            strokeWidth={1.75}
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Lektion, Kategorie oder Ressource suchen …"
            autoFocus
            className="w-full pl-11 pr-5 py-3.5 text-[14px] bg-[#F5F0E8] border border-[#E8E2D9] rounded-xl text-[#1A1714] placeholder:text-[#C4B9B0] focus:outline-none focus:ring-2 focus:ring-[#5B2D8E]/12 focus:border-[#5B2D8E]/25 transition-all"
          />
        </div>
      </section>

      {/* Empty: no query yet */}
      {!hasQuery && (
        <section>
          <div className="bg-[#F5F0E8] rounded-2xl border border-[#E8E2D9] px-8 py-12 text-center">
            <p className="text-[14px] text-[#B8AFA7] leading-relaxed">
              Gib einen Begriff ein, um Lektionen,<br />Kategorien und Ressourcen zu finden.
            </p>
          </div>
        </section>
      )}

      {/* Empty: query but no results */}
      {hasQuery && !hasResult && (
        <section>
          <div className="bg-[#F5F0E8] rounded-2xl border border-[#E8E2D9] px-8 py-12 text-center">
            <p className="text-[14px] text-[#1A1714] font-medium mb-2">
              Keine Ergebnisse für „{query}"
            </p>
            <p className="text-[13px] text-[#B8AFA7]">
              Versuche einen anderen Begriff oder browse durch die Academy.
            </p>
            <Link
              href="/academy"
              className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#5B2D8E] hover:text-[#4A2478] transition-colors"
            >
              Zur Academy <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
            </Link>
          </div>
        </section>
      )}

      {/* Results grouped by type */}
      {hasQuery && hasResult && (
        <div className="space-y-10">
          {TYPE_ORDER.map((type) => {
            const items = grouped.get(type)
            if (!items?.length) return null
            const { label } = TYPE_CONFIG[type]
            return (
              <section key={type}>
                <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-4">
                  {label} — {items.length}
                </p>
                <div className="space-y-2">
                  {items.map((r) => <ResultCard key={r.href + r.title} result={r} />)}
                </div>
              </section>
            )
          })}
        </div>
      )}

    </div>
  )
}

// Suspense boundary needed for useSearchParams
export default function SuchePage() {
  return (
    <Suspense>
      <SearchPageInner />
    </Suspense>
  )
}
