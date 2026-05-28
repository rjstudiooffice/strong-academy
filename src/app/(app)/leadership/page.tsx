import { Lock } from "lucide-react"
import Link from "next/link"
import {
  getLeadershipCategories,
  getProgressToUnlock,
  isLeadershipUnlocked,
  UNLOCK_THRESHOLD,
} from "@/lib/data/leadership"
import { MediaCover } from "@/components/features/MediaCover"

// ─── Locked State ────────────────────────────────────────────────────────────

function LeadershipLocked() {
  const progress = getProgressToUnlock()

  const topics = [
    "Leadership Psychology & Menschenkenntnis",
    "Vision entwickeln und kommunizieren",
    "Strukturen aufbauen, die ohne dich funktionieren",
    "Kultur, Verantwortung und nachhaltiges Teamwachstum",
  ]

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
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#2C2820] flex items-center justify-center shrink-0 mt-0.5">
              <Lock className="w-4 h-4 text-[#6B6050]" strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-semibold text-[#EDE8DF] mb-1">
                {progress.remaining > 0
                  ? `Noch ${progress.remaining}% bis Leadership`
                  : "Fast freigeschaltet"}
              </p>
              <p className="text-[13px] text-[#9E9080] leading-relaxed">
                Leadership wird bei {UNLOCK_THRESHOLD}% Gesamtfortschritt in der Academy freigeschaltet.
              </p>

              <div className="mt-5 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-[#6B6050]">
                  <span>Dein Fortschritt</span>
                  <span className="tabular-nums">{progress.current}% / {UNLOCK_THRESHOLD}%</span>
                </div>
                <div className="h-[3px] w-full rounded-full bg-[#38322A] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#8B5BC4]/70 transition-all duration-700"
                    style={{ width: `${progress.pct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Topics preview */}
      <section>
        <p className="text-[10px] font-semibold text-[#6B6050] uppercase tracking-widest mb-5">
          Was dich erwartet
        </p>
        <div className="space-y-2.5">
          {topics.map((topic) => (
            <div key={topic} className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5B2D8E]/50 shrink-0 mt-1.5" />
              <p className="text-[14px] text-[#9E9080] leading-relaxed">{topic}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
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

function LeadershipUnlocked() {
  const categories = getLeadershipCategories()

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
                gradient={cat.cover}
                imageSrc={cat.coverImage}
                darkTint
                index={cat.index}
                className="h-44 shrink-0"
              />
              <div className="bg-[#242019] group-hover:bg-[#2C2820] px-6 py-5 flex flex-col flex-1 transition-colors">
                <p className="text-[10px] font-semibold text-[#6B6050] uppercase tracking-widest mb-2">
                  {cat.plannedLessons > 0 ? `${cat.plannedLessons} Lektionen` : "Folgt"}
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

export default function LeadershipPage() {
  const unlocked = isLeadershipUnlocked()
  return unlocked ? <LeadershipUnlocked /> : <LeadershipLocked />
}
