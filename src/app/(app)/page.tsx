import { ArrowRight, Play } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { getCategories, progressPct, getOverallProgress, getNextLesson } from "@/lib/data/academy"
import { getCurrentUser } from "@/lib/data/user"
import { getInviteLink } from "@/lib/data/team"
import { CurrentDate } from "@/components/features/CurrentDate"
import { InviteButton } from "@/components/features/InviteButton"

// User-specific state — will come from Supabase later
const recentItems = [
  { category: "Produktwissen",      title: "Mineralien & Mikronährstoffe",   href: "/academy/produktwissen/mineralien-mikronährstoffe" },
  { category: "Produktwissen",      title: "Was ist Strong OG?",             href: "/academy/produktwissen/was-ist-strong-og" },
  { category: "Kommunikation",      title: "Demnächst verfügbar",            href: "/academy/kommunikation" },
]

export default function HomePage() {
  const user          = getCurrentUser()
  const inviteLink    = getInviteLink(user.id)
  const categories    = getCategories()
  const overall       = getOverallProgress()
  const nextLesson    = getNextLesson()
  const activeProgress = categories
    .map((c) => ({ name: c.name, pct: progressPct(c) }))
    .filter((c) => c.pct > 0)
    .sort((a, b) => b.pct - a.pct)
  return (
    <div className="space-y-12">

      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-[#F5F0E8] border border-[#E8E2D9]">
        {/* Desktop: Invite button top-right, absolute */}
        <div className="hidden sm:block absolute top-5 right-5 z-20">
          <InviteButton inviteLink={inviteLink} />
        </div>

        <div className="px-6 py-8 sm:px-10 sm:py-12 max-w-xl relative z-10">
          <p className="text-xs text-[#B8AFA7] font-medium tracking-widest uppercase mb-4">
            <CurrentDate />
          </p>
          <h1 className="text-[1.7rem] sm:text-[2rem] font-semibold text-[#1A1714] leading-tight tracking-tight">
            Willkommen zurück,{" "}
            <span className="text-[#5B2D8E]">{user.firstName}.</span>
          </h1>
          <p className="mt-4 text-[#8C7E6F] text-[14px] sm:text-[15px] leading-relaxed max-w-sm">
            Wissen, das dein Leben verändert. Entdecke Inhalte, die dich und dein Business auf das nächste Level bringen.
          </p>

          {/* Mobile: both buttons side by side, below description */}
          <div className="mt-6 flex items-center gap-3 flex-wrap">
            <Link
              href="/academy"
              className="inline-flex items-center gap-2.5 bg-[#5B2D8E] text-white text-sm font-medium px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl hover:bg-[#4A2478] transition-colors"
            >
              Weiterlernen <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
            </Link>
            {/* Mobile only — desktop version is absolute top-right */}
            <div className="sm:hidden">
              <InviteButton inviteLink={inviteLink} />
            </div>
          </div>
        </div>
        <div className="absolute inset-y-0 right-0 w-2/5 bg-gradient-to-l from-[#EDE8DF]/70 to-transparent pointer-events-none" />
      </section>

      {/* Progress */}
      <section className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-5">

        {/* Gesamtfortschritt */}
        <div className="bg-[#F5F0E8] rounded-2xl p-7 border border-[#E8E2D9] flex flex-col justify-between min-h-[160px]">
          <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest">
            Gesamter Fortschritt
          </p>
          <div>
            <span className="text-[3rem] font-semibold text-[#5B2D8E] tracking-tight leading-none">{overall.pct}%</span>
            <div className="mt-4 h-[2px] w-full rounded-full bg-[#E3DDD5] overflow-hidden">
              <div className="h-full rounded-full bg-[#5B2D8E]/35 transition-all duration-700" style={{ width: `${overall.pct}%` }} />
            </div>
            <p className="mt-3 text-[13px] text-[#B8AFA7]">{overall.done} von {overall.total} Lektionen abgeschlossen.</p>
          </div>
        </div>

        {/* Kategorie-Fortschritt */}
        <div className="bg-[#F5F0E8] rounded-2xl p-7 border border-[#E8E2D9]">
          <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-6">
            Fortschritt nach Kategorie
          </p>
          <div className="space-y-5">
            {activeProgress.map((cat) => (
              <div key={cat.name}>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-[13px] text-[#6B5E52]">{cat.name}</span>
                  <span className="text-[11px] text-[#C4B9B0] tabular-nums">{cat.pct}%</span>
                </div>
                <div className="h-[2px] w-full rounded-full bg-[#E3DDD5] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#5B2D8E]/30 transition-all duration-700"
                    style={{ width: `${cat.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nächste Lektion */}
      {nextLesson && (
        <section>
          <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-4">
            Nächste Lektion
          </p>
          <Link
            href={`/academy/${nextLesson.category.slug}/${nextLesson.lesson.slug}`}
            className="group bg-[#F5F0E8] hover:bg-[#EDE8DF] rounded-2xl border border-[#E8E2D9] overflow-hidden flex flex-col sm:flex-row transition-colors block"
          >
            <div className={`relative w-full sm:w-52 h-40 sm:h-auto bg-gradient-to-br ${nextLesson.lesson.cover} flex items-center justify-center shrink-0 overflow-hidden`}>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_20%,_rgba(255,252,245,0.15)_0%,_transparent_70%)]" />
              <div className="w-11 h-11 rounded-full bg-white/85 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform relative">
                <Play className="w-4 h-4 text-[#5B2D8E] ml-0.5" fill="currentColor" strokeWidth={0} />
              </div>
            </div>
            <div className="p-7 flex flex-col justify-center gap-1">
              <p className="text-[10px] font-semibold text-[#5B2D8E] uppercase tracking-widest">
                {nextLesson.category.tagline}
              </p>
              <h3 className="text-[17px] font-semibold text-[#1A1714] leading-snug mt-1">
                {nextLesson.lesson.title}
              </h3>
              <p className="text-[13px] text-[#9E9188] mt-0.5">
                {nextLesson.lesson.duration} · Lektion {nextLesson.index + 1} von {nextLesson.category.lessons.length}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#5B2D8E]">
                {nextLesson.isResume ? "Fortsetzen" : "Starten"}
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
              </span>
            </div>
          </Link>
        </section>
      )}

      {/* Zuletzt angesehen */}
      <section>
        <div className="flex items-baseline justify-between mb-4">
          <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest">
            Zuletzt angesehen
          </p>
          <Link href="/academy" className="text-[12px] text-[#5B2D8E] hover:text-[#4A2478] font-medium transition-colors">
            Alle anzeigen
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {recentItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group bg-[#F5F0E8] hover:bg-[#EDE8DF] border border-[#E8E2D9] rounded-2xl px-5 py-5 flex items-center justify-between transition-colors"
            >
              <div className="min-w-0 pr-3">
                <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-1.5">
                  {item.category}
                </p>
                <p className="text-[14px] font-medium text-[#1A1714] leading-snug">{item.title}</p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#C4B9B0] shrink-0 group-hover:text-[#5B2D8E] group-hover:translate-x-0.5 transition-all" strokeWidth={2} />
            </Link>
          ))}
        </div>
      </section>

      {/* Kategorien */}
      <section>
        <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-4">
          Kategorien
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {categories.map((cat) => {
            const pct = progressPct(cat)
            return (
              <Link
                key={cat.slug}
                href={`/academy/${cat.slug}`}
                className="group bg-[#F5F0E8] hover:bg-[#EDE8DF] border border-[#E8E2D9] rounded-2xl p-6 transition-all hover:shadow-sm flex flex-col justify-between min-h-[140px]"
              >
                <div className="flex items-start justify-between">
                  <p className="text-[15px] font-semibold text-[#1A1714] leading-snug pr-4 hyphens-auto">{cat.name}</p>
                  <span className="text-[11px] font-medium text-[#C4B9B0] tabular-nums shrink-0 mt-0.5">{cat.index}</span>
                </div>
                <div className="mt-auto pt-5">
                  <Progress value={pct} className="h-[2px] bg-[#E3DDD5] mb-2.5" />
                  <p className="text-[12px] text-[#B8AFA7] tabular-nums">
                    {pct > 0 ? `${pct}% abgeschlossen` : "Noch nicht begonnen"}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

    </div>
  )
}
