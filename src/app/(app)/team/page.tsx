"use client"

import { useState, useMemo } from "react"
import { Search } from "lucide-react"
import {
  getTeamMembers,
  memberFullName,
  memberInitials,
  memberAvatarColor,
} from "@/lib/data/team"

export default function TeamPage() {
  const members = getTeamMembers()
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return members
    return members.filter((m) =>
      memberFullName(m).toLowerCase().includes(q)
    )
  }, [members, query])

  return (
    <div className="space-y-10 pt-2 max-w-2xl">

      {/* Hero */}
      <section>
        <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-5">
          Mein Team
        </p>
        <h1 className="text-[1.65rem] sm:text-[2rem] font-semibold text-[#1A1714] tracking-tight leading-tight">
          {members.length === 1 ? "1 Partner" : `${members.length} Partner`}
        </h1>
        <p className="mt-3 text-[15px] text-[#8C7E6F] leading-relaxed">
          Dein Team auf einen Blick — Fortschritt, Aktivität und Lernstand.
        </p>
      </section>

      {/* Search */}
      <section>
        <div className="relative max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C4B9B0]" strokeWidth={1.75} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name suchen …"
            className="w-full pl-11 pr-5 py-3.5 text-[14px] bg-[#F5F0E8] border border-[#E8E2D9] rounded-xl text-[#1A1714] placeholder:text-[#C4B9B0] focus:outline-none focus:ring-2 focus:ring-[#5B2D8E]/12 focus:border-[#5B2D8E]/25 transition-all"
          />
        </div>
      </section>

      {/* Member list */}
      <section>
        {filtered.length === 0 ? (
          <div className="bg-[#F5F0E8] rounded-2xl border border-[#E8E2D9] px-8 py-10 text-center">
            <p className="text-[14px] text-[#B8AFA7]">Keine Ergebnisse für „{query}"</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((member, i) => {
              const avatarBg = memberAvatarColor(i)
              return (
                <div
                  key={member.id}
                  className="bg-[#F5F0E8] border border-[#E8E2D9] rounded-2xl px-6 py-5"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-xl ${avatarBg} flex items-center justify-center shrink-0`}>
                      <span className="text-white text-[13px] font-semibold">
                        {memberInitials(member)}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-3 flex-wrap">
                        <p className="text-[15px] font-semibold text-[#1A1714]">
                          {memberFullName(member)}
                        </p>
                        <p className="text-[11px] text-[#C4B9B0] shrink-0">
                          Aktiv {member.lastActive}
                        </p>
                      </div>

                      <p className="mt-0.5 text-[12px] text-[#B8AFA7]">
                        Partner seit {member.joinedAt} · {member.completedLessons} Lektionen abgeschlossen
                      </p>

                      {/* Overall progress */}
                      <div className="mt-4 flex items-center gap-3">
                        <div className="flex-1 h-[2px] rounded-full bg-[#E3DDD5] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#5B2D8E]/35 transition-all duration-700"
                            style={{ width: `${member.overallPct}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-[#B8AFA7] tabular-nums shrink-0 w-8 text-right">
                          {member.overallPct}%
                        </span>
                      </div>

                      {/* Category breakdown */}
                      {member.categoryPcts.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {member.categoryPcts.map((cat) => (
                            <div
                              key={cat.slug}
                              className="flex items-center gap-1.5 bg-[#EDE8DF] rounded-lg px-2.5 py-1"
                            >
                              <div className="w-1 h-1 rounded-full bg-[#5B2D8E]/40 shrink-0" />
                              <span className="text-[11px] text-[#6B5E52]">{cat.name}</span>
                              <span className="text-[11px] text-[#B8AFA7] tabular-nums">{cat.pct}%</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

    </div>
  )
}
