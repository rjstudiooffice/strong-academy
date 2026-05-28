import { ChevronRight, LogOut } from "lucide-react"
import {
  getFoundationCategories,
  getOverallProgress,
  progressPct,
} from "@/lib/data/academy"
import { getCurrentUser, userFullName, userInitials } from "@/lib/data/user"

// ─── Sub-components ──────────────────────────────────────────────────────────

function InfoRow({
  label,
  value,
  action,
}: {
  label: string
  value: string
  action?: { label: string }
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-4 border-b border-[#EDE8DF] last:border-0">
      <div className="flex items-baseline gap-5 sm:gap-8 min-w-0 flex-1">
        <span className="text-[11px] sm:text-[12px] font-medium text-[#B8AFA7] uppercase tracking-widest w-16 sm:w-24 shrink-0">
          {label}
        </span>
        <span className="text-[14px] text-[#1A1714] truncate min-w-0">{value}</span>
      </div>
      {action && (
        <button className="text-[12px] text-[#5B2D8E] hover:text-[#4A2478] font-medium transition-colors shrink-0 ml-1">
          {action.label}
        </button>
      )}
    </div>
  )
}

function SettingsRow({
  label,
  value,
  cta,
  danger,
}: {
  label: string
  value?: string
  cta: string
  danger?: boolean
}) {
  return (
    <button className="w-full flex items-center justify-between gap-3 py-4 border-b border-[#EDE8DF] last:border-0 group text-left">
      <div className="flex items-baseline gap-5 sm:gap-8 min-w-0 flex-1">
        <span className="text-[11px] sm:text-[12px] font-medium text-[#B8AFA7] uppercase tracking-widest w-16 sm:w-24 shrink-0">
          {label}
        </span>
        {value && (
          <span className="text-[14px] text-[#6B5E52] truncate min-w-0">{value}</span>
        )}
      </div>
      <span className={`flex items-center gap-1 text-[12px] font-medium transition-colors ${
        danger
          ? "text-[#A06050] group-hover:text-[#8A4A3C]"
          : "text-[#5B2D8E] group-hover:text-[#4A2478]"
      }`}>
        {cta}
        {!danger && <ChevronRight className="w-3 h-3" strokeWidth={2.5} />}
        {danger && <LogOut className="w-3 h-3" strokeWidth={2} />}
      </span>
    </button>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ProfilPage() {
  const user       = getCurrentUser()
  const name       = userFullName(user)
  const initials   = userInitials(user)

  const { pct: overallPct, done: doneLessons, total: totalLessons } = getOverallProgress()
  const foundation       = getFoundationCategories()
  const activeCategories = foundation.filter((c) => progressPct(c) > 0)

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
              Mitglied seit {user.memberSince}
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
                      <span className="text-[0.9rem] text-[#B8AFA7] font-normal ml-1">/ {foundation.length}</span>
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
        <div className="bg-[#F5F0E8] rounded-2xl border border-[#E8E2D9] px-6">
          <InfoRow label="Name"   value={name}       action={{ label: "Bearbeiten" }} />
          <InfoRow label="E-Mail" value={user.email} action={{ label: "Ändern" }} />
        </div>
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
                const pct = progressPct(cat)
                return (
                  <div key={cat.slug}>
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-[13px] text-[#6B5E52]">{cat.name}</span>
                      <span className="text-[11px] text-[#C4B9B0] tabular-nums">{pct}%</span>
                    </div>
                    <div className="h-[2px] w-full rounded-full bg-[#E3DDD5] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#5B2D8E]/35 transition-all duration-700"
                        style={{ width: `${pct}%` }}
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
          <SettingsRow label="Sprache"  value={user.language} cta="Ändern" />
          <SettingsRow label="Passwort" value="••••••••"       cta="Ändern" />
          <SettingsRow label="Konto"    cta="Abmelden"         danger />
        </div>
      </section>

    </div>
  )
}
