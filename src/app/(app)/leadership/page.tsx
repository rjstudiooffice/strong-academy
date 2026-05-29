import { Lock } from "lucide-react"
import Link from "next/link"
import { getProfile } from "@/lib/supabase/profile"
import { getLeadershipCategories, formatDuration, type ContentCategory } from "@/lib/supabase/content"
import { getFoundationCategoryProgress } from "@/lib/supabase/progress"
import { MediaCover } from "@/components/features/MediaCover"

export const dynamic = "force-dynamic"

// ─── Foundation slugs required at 100% for Leadership unlock ─────────────────

const REQUIRED_FOUNDATIONS = [
  { slug: "produktwissen",  label: "Produktwissen" },
  { slug: "teamaufbau",     label: "Teamaufbau & Führung" },
  { slug: "kommunikation",  label: "Kommunikation & Kundenaufbau" },
]

// ─── Locked State ────────────────────────────────────────────────────────────

function LeadershipLocked({
  foundationProgress,
}: {
  foundationProgress: { slug: string; pct: number }[]
}) {
  const progressMap = Object.fromEntries(foundationProgress.map((f) => [f.slug, f.pct]))

  return (
    <div className="space-y-12 pt-2">

      <section>
        <p className="text-[10px] font-semibold text-[#6B6050] uppercase tracking-widest mb-5">
          Leadership
        </p>
        <h1 className="text-[1.85rem] sm:text-[2.25rem] font-semibold text-[#EDE8DF] tracking-tight leading-[1.2] max-w-lg">
          Die nächste Stufe<br />deiner Entwicklung.
        </h1>
        <p className="mt-5 text-[15px] text-[#9E9080] leading-relaxed max-w-xl">
          Leadership ist mehr als Führung — es ist Haltung, Verantwortung und die Fähigkeit, echte Strukturen aufzubauen, die langfristig tragen.
        </p>
      </section>

      {/* Lock indicator */}
      <section>
        <div className="bg-[#242019] rounded-2xl border border-[#38322A] p-6 sm:p-7">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#2C2820] flex items-center justify-center shrink-0 mt-0.5">
              <Lock className="w-4 h-4 text-[#6B6050]" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-[#EDE8DF] mb-1">
                Foundation Academy abschließen
              </p>
              <p className="text-[13px] text-[#9E9080] leading-relaxed">
                Schließe alle drei Foundation-Bereiche ab, um Leadership freizuschalten.
              </p>
            </div>
          </div>

          <div className="space-y-3.5">
            {REQUIRED_FOUNDATIONS.map(({ slug, label }) => {
              const pct = progressMap[slug] ?? 0
              const done = pct >= 100
              return (
                <div key={slug}>
                  <div className="flex items-center justify-between text-[12px] mb-1.5">
                    <span className={done ? "text-[#8BC49A]" : "text-[#9E9080]"}>{label}</span>
                    <span className={`tabular-nums ${done ? "text-[#8BC49A]" : "text-[#6B6050]"}`}>
                      {done ? "✓ 100%" : `${pct}%`}
                    </span>
                  </div>
                  <div className="h-[3px] w-full rounded-full bg-[#38322A] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${done ? "bg-[#8BC49A]" : "bg-[#8B5BC4]/70"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section>
        <p className="text-[13px] text-[#6B6050] mb-4">
          Schließe die Academy-Inhalte ab, um Leadership freizuschalten.
        </p>
        <Link
          href="/academy"
          className="inline-flex items-center gap-2 text-[13px] font-medium text-[#9B72CC] hover:text-[#B08ADE] transition-colors"
        >
          Zur Academy →
        </Link>
      </section>

    </div>
  )
}

// ─── Unlocked State ──────────────────────────────────────────────────────────

function LeadershipUnlocked({ categories }: { categories: ContentCategory[] }) {
  return (
    <div className="space-y-12 pt-2">

      <section>
        <p className="text-[10px] font-semibold text-[#6B6050] uppercase tracking-widest mb-5">
          Leadership
        </p>
        <h1 className="text-[1.85rem] sm:text-[2.25rem] font-semibold text-[#EDE8DF] tracking-tight leading-[1.2] max-w-lg">
          Die nächste Stufe<br />deiner Entwicklung.
        </h1>
        <p className="mt-5 text-[15px] text-[#9E9080] leading-relaxed max-w-xl">
          Vertiefe dein Wissen über Führung, Multiplikation und die Strukturen, die langfristiges Wachstum ermöglichen.
        </p>
      </section>

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/leadership/${cat.slug}`}
              className="group rounded-2xl overflow-hidden border border-[#38322A] hover:border-[#4A4438] hover:shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-0.5 flex flex-col"
            >
              <MediaCover
                gradient={cat.cover_gradient ?? "from-[#4A4440] to-[#2C2820]"}
                imageSrc={cat.cover_image_url ?? undefined}
                darkTint
                index={cat.index_label ?? undefined}
                className="h-44 shrink-0"
              />
              <div className="bg-[#242019] group-hover:bg-[#2C2820] px-6 py-5 flex flex-col flex-1 transition-colors">
                <p className="text-[10px] font-semibold text-[#6B6050] uppercase tracking-widest mb-2">
                  {cat.lesson_count > 0 ? `${cat.lesson_count} Lektionen` : "Folgt"}
                </p>
                <h3 className="text-[16px] font-semibold text-[#EDE8DF] leading-snug">{cat.name}</h3>
                <p className="mt-2 text-[13px] text-[#9E9080] leading-relaxed">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function LeadershipPage() {
  const profile = await getProfile()
  const unlocked = profile?.leadership_unlocked ?? false

  if (unlocked) {
    const categories = await getLeadershipCategories()
    return <LeadershipUnlocked categories={categories} />
  }

  const foundationProgressRows = profile
    ? await getFoundationCategoryProgress(profile.id)
    : []

  const foundationProgress = REQUIRED_FOUNDATIONS.map(({ slug }) => ({
    slug,
    pct: foundationProgressRows.find((r) => r.slug === slug)?.pct ?? 0,
  }))

  return <LeadershipLocked foundationProgress={foundationProgress} />
}
