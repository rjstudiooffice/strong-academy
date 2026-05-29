import { ArrowRight } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import Link from "next/link"
import { getAcademyCategories } from "@/lib/supabase/content"
import { CurrentDate } from "@/components/features/CurrentDate"
import { InviteButton } from "@/components/features/InviteButton"
import { getProfile, profileFirstName } from "@/lib/supabase/profile"
import { getOverallProgress, getFoundationCategoryProgress } from "@/lib/supabase/progress"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const [profile, categories] = await Promise.all([getProfile(), getAcademyCategories()])
  const firstName  = profile ? profileFirstName(profile) : ""

  const [overall, foundationProgress] = profile
    ? await Promise.all([
        getOverallProgress(profile.id),
        getFoundationCategoryProgress(profile.id),
      ])
    : [
        { completed: 0, total: 0, pct: 0 },
        [] as { slug: string; completed: number; total: number; pct: number }[],
      ]

  const nameBySlug = Object.fromEntries(categories.map((c) => [c.slug, c.name]))

  // Map slug → pct for the category grid
  const progressBySlug = Object.fromEntries(foundationProgress.map((c) => [c.slug, c.pct]))

  // Only show categories with actual progress in the per-category panel
  const activeProgress = foundationProgress
    .filter((c) => c.pct > 0)
    .map((c) => ({ name: nameBySlug[c.slug] ?? c.slug, pct: c.pct }))
    .sort((a, b) => b.pct - a.pct)

  return (
    <div className="space-y-12">

      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-[#F5F0E8] border border-[#E8E2D9]">
        <div className="absolute inset-0">
          <Image
            src="/startseite_hero.png"
            alt=""
            fill
            className="object-cover object-right"
            sizes="(max-width: 768px) 100vw, calc(100vw - 280px)"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F5F0E8] via-[#F5F0E8]/90 sm:via-[#F5F0E8]/75 to-transparent" />
        </div>

        <div className="hidden sm:block absolute top-5 right-5 z-20">
          <InviteButton />
        </div>

        <div className="px-6 py-8 sm:px-10 sm:py-12 max-w-xl relative z-10">
          <p className="text-xs text-[#B8AFA7] font-medium tracking-widest uppercase mb-4">
            <CurrentDate />
          </p>
          <h1 className="text-[1.7rem] sm:text-[2rem] font-semibold text-[#1A1714] leading-tight tracking-tight">
            Willkommen zurück,{" "}
            <span className="text-[#5B2D8E]">{firstName}.</span>
          </h1>
          <p className="mt-4 text-[#8C7E6F] text-[14px] sm:text-[15px] leading-relaxed max-w-sm">
            Wissen, das dein Leben verändert. Entdecke Inhalte, die dich und dein Business auf das nächste Level bringen.
          </p>

          <div className="mt-6 flex items-center gap-3 flex-wrap">
            <Link
              href="/academy"
              className="inline-flex items-center gap-2.5 bg-[#5B2D8E] text-white text-sm font-medium px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl hover:bg-[#4A2478] transition-colors"
            >
              Weiterlernen <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
            </Link>
            <div className="sm:hidden">
              <InviteButton />
            </div>
          </div>
        </div>
      </section>

      {/* Progress */}
      <section className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-5">

        {/* Gesamtfortschritt */}
        <div className="bg-[#F5F0E8] rounded-2xl p-7 border border-[#E8E2D9] flex flex-col justify-between min-h-[160px]">
          <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest">
            Gesamter Fortschritt
          </p>
          <div>
            <span className="text-[3rem] font-semibold text-[#5B2D8E] tracking-tight leading-none">
              {overall.pct}%
            </span>
            <div className="mt-4 h-[2px] w-full rounded-full bg-[#E3DDD5] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#5B2D8E]/35 transition-all duration-700"
                style={{ width: `${overall.pct}%` }}
              />
            </div>
            <p className="mt-3 text-[13px] text-[#B8AFA7]">
              {overall.completed} von {overall.total} Lektionen abgeschlossen.
            </p>
          </div>
        </div>

        {/* Kategorie-Fortschritt */}
        <div className="bg-[#F5F0E8] rounded-2xl p-7 border border-[#E8E2D9]">
          <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-6">
            Fortschritt nach Kategorie
          </p>
          {activeProgress.length === 0 ? (
            <p className="text-[13px] text-[#C4B9B0]">Noch keine Lektionen begonnen.</p>
          ) : (
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
          )}
        </div>
      </section>

      {/* Kategorien */}
      <section>
        <div className="flex items-baseline justify-between mb-4">
          <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest">
            Kategorien
          </p>
          <Link href="/academy" className="text-[12px] text-[#5B2D8E] hover:text-[#4A2478] font-medium transition-colors">
            Alle anzeigen
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {categories.map((cat) => {
            const pct        = progressBySlug[cat.slug] ?? 0
            const foundation = cat.type === "foundation"
            return (
              <Link
                key={cat.slug}
                href={`/academy/${cat.slug}`}
                className="group bg-[#F5F0E8] hover:bg-[#EDE8DF] border border-[#E8E2D9] rounded-2xl p-6 transition-all hover:shadow-sm flex flex-col justify-between min-h-[140px]"
              >
                <div className="flex items-start justify-between">
                  <p className="text-[15px] font-semibold text-[#1A1714] leading-snug pr-4 hyphens-auto">
                    {cat.name}
                  </p>
                  {foundation && (
                    <span className="text-[11px] font-medium text-[#C4B9B0] tabular-nums shrink-0 mt-0.5">
                      {cat.index_label}
                    </span>
                  )}
                </div>
                <div className="mt-auto pt-5">
                  {foundation ? (
                    <>
                      <Progress value={pct} className="h-[2px] bg-[#E3DDD5] mb-2.5" />
                      <p className="text-[12px] text-[#B8AFA7] tabular-nums">
                        {pct > 0 ? `${pct}% abgeschlossen` : "Noch nicht begonnen"}
                      </p>
                    </>
                  ) : (
                    <p className="text-[12px] text-[#C4B9B0]">Entdecken</p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </section>

    </div>
  )
}
