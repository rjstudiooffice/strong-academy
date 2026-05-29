import { getProfile, profileInitials } from "@/lib/supabase/profile"
import { getOverallProgress, getFoundationCategoryProgress } from "@/lib/supabase/progress"
import { LogoutButton } from "@/components/features/LogoutButton"
import { PersonalInfoSection } from "./_info-section"

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function ProfilPage() {
  const profile = await getProfile()

  const name        = profile?.full_name ?? "–"
  const initials    = profile ? profileInitials(profile) : "?"
  const email       = profile?.email ?? "–"
  const memberSince = profile
    ? new Date(profile.created_at).toLocaleDateString("de-DE", { month: "long", year: "numeric" })
    : "–"

  const [overall, catProgress] = profile
    ? await Promise.all([
        getOverallProgress(profile.id),
        getFoundationCategoryProgress(profile.id),
      ])
    : [{ completed: 0, total: 0, pct: 0 }, [] as { slug: string; completed: number; total: number; pct: number }[]]

  // Foundation slugs — used only for count and name display
  const FOUNDATION_COUNT = 3
  const FOUNDATION_NAMES: Record<string, string> = {
    produktwissen: "Produktwissen",
    teamaufbau:    "Teamaufbau & Führung",
    kommunikation: "Kommunikation & Kundenaufbau",
  }
  const activeCategories = catProgress.filter((c) => c.pct > 0)

  const overallPct   = overall.pct
  const doneLessons  = overall.completed
  const totalLessons = overall.total

  return (
    <div className="space-y-10 pt-2 max-w-2xl">

      {/* Hero */}
      <section className="bg-[#F5F0E8] rounded-2xl border border-[#E8E2D9] px-8 py-8">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-[#5B2D8E] flex items-center justify-center shrink-0">
            <span className="text-white text-lg font-semibold tracking-wide">{initials}</span>
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-[1.6rem] font-semibold text-[#1A1714] tracking-tight leading-tight">
              {name}
            </h1>
            <p className="mt-1 text-[13px] text-[#9E9188]">
              Mitglied seit {memberSince}
            </p>

            <div className="mt-5 flex items-center gap-4 sm:gap-6 flex-wrap">
              <div>
                <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-1">
                  Fortschritt
                </p>
                <p className="text-[1.4rem] font-semibold text-[#5B2D8E] leading-none tracking-tight">
                  {overallPct}%
                </p>
              </div>
              <div className="w-px h-8 bg-[#E8E2D9]" />
              <div>
                <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-1">
                  Lektionen
                </p>
                <p className="text-[1.4rem] font-semibold text-[#1A1714] leading-none tracking-tight">
                  {doneLessons}
                  <span className="text-[0.9rem] text-[#B8AFA7] font-normal ml-1">/ {totalLessons}</span>
                </p>
              </div>
              {activeCategories.length > 0 && (
                <>
                  <div className="w-px h-8 bg-[#E8E2D9]" />
                  <div>
                    <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-1">
                      Bereiche
                    </p>
                    <p className="text-[1.4rem] font-semibold text-[#1A1714] leading-none tracking-tight">
                      {activeCategories.length}
                      <span className="text-[0.9rem] text-[#B8AFA7] font-normal ml-1">/ {FOUNDATION_COUNT}</span>
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Persönliche Informationen */}
      <section>
        <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-4">
          Persönliche Informationen
        </p>
        <PersonalInfoSection
          initialName={name}
          email={email}
          initialAvatarUrl={profile?.avatar_url ?? null}
        />
      </section>

      {/* Lernfortschritt */}
      {activeCategories.length > 0 && (
        <section>
          <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-4">
            Lernfortschritt
          </p>
          <div className="bg-[#F5F0E8] rounded-2xl border border-[#E8E2D9] px-6 py-6">
            <div className="space-y-5">
              {activeCategories.map((cat) => {
                const name = FOUNDATION_NAMES[cat.slug] ?? cat.slug
                return (
                  <div key={cat.slug}>
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-[13px] text-[#6B5E52]">{name}</span>
                      <span className="text-[11px] text-[#C4B9B0] tabular-nums">{cat.pct}%</span>
                    </div>
                    <div className="h-[2px] w-full rounded-full bg-[#E3DDD5] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#5B2D8E]/35 transition-all duration-700"
                        style={{ width: `${cat.pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Einstellungen */}
      <section>
        <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-4">
          Einstellungen
        </p>
        <div className="bg-[#F5F0E8] rounded-2xl border border-[#E8E2D9] px-6">
          <LogoutButton />
        </div>
      </section>

    </div>
  )
}
