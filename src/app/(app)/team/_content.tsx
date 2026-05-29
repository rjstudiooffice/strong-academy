"use client"

import { useState, useMemo } from "react"
import { Search } from "lucide-react"
import { MEMBER_AVATAR_COLORS } from "@/lib/data/team"
import { InviteButton } from "@/components/features/InviteButton"
import { removePartner } from "@/lib/supabase/actions"

export type TeamProfile = {
  id: string
  full_name: string
  email: string
  avatar_url: string | null
  created_at: string
}

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "?"
}

function avatarColor(index: number): string {
  return MEMBER_AVATAR_COLORS[index % MEMBER_AVATAR_COLORS.length]
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("de-DE", { month: "long", year: "numeric" })
}

function partnerLabel(count: number): string {
  return count === 1 ? "1 Direkter Partner" : `${count} Direkte Partner`
}

// ─── Member card ──────────────────────────────────────────────────────────────

function MemberCard({
  member,
  index,
  onRemove,
}: {
  member: TeamProfile
  index: number
  onRemove: (id: string) => void
}) {
  const [confirming, setConfirming] = useState(false)
  const [removing,   setRemoving]   = useState(false)

  async function handleConfirm() {
    setRemoving(true)
    const result = await removePartner(member.id)
    if (result.error) {
      setRemoving(false)
      setConfirming(false)
    } else {
      onRemove(member.id)
    }
  }

  if (confirming) {
    return (
      <div className="bg-[#F5F0E8] border border-[#E8DDD8] rounded-2xl px-6 py-5">
        <div className="flex items-start gap-4">
          <div className={`w-11 h-11 rounded-xl ${avatarColor(index)} flex items-center justify-center shrink-0 opacity-40`}>
            <span className="text-white text-[13px] font-semibold">{initials(member.full_name)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-semibold text-[#1A1714] mb-1">
              {member.full_name} entfernen?
            </p>
            <p className="text-[13px] text-[#9E9188] leading-relaxed">
              Die Teamverbindung wird aufgehoben. {member.full_name.split(" ")[0]} behält vollen Zugang zur Academy.
            </p>
            <div className="mt-4 flex items-center gap-4">
              <button
                onClick={() => setConfirming(false)}
                disabled={removing}
                className="text-[13px] font-medium text-[#6B5E52] hover:text-[#1A1714] transition-colors disabled:opacity-40"
              >
                Abbrechen
              </button>
              <button
                onClick={handleConfirm}
                disabled={removing}
                className="text-[13px] font-medium text-[#A06050] hover:text-[#8A4A3C] transition-colors disabled:opacity-40"
              >
                {removing ? "Wird entfernt …" : "Ja, entfernen"}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#F5F0E8] border border-[#E8E2D9] rounded-2xl px-6 py-5">
      <div className="flex items-center gap-4">

        {/* Avatar */}
        <div className={`w-11 h-11 rounded-xl ${avatarColor(index)} flex items-center justify-center shrink-0 overflow-hidden`}>
          {member.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={member.avatar_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-white text-[13px] font-semibold">{initials(member.full_name)}</span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-semibold text-[#1A1714] truncate leading-snug">
            {member.full_name}
          </p>
          <p className="text-[12px] text-[#9E9188] truncate mt-0.5">
            {member.email}
          </p>
          <p className="text-[11px] text-[#C4B9B0] mt-1">
            Partner seit {formatDate(member.created_at)}
          </p>
        </div>

      </div>

      {/* Remove */}
      <div className="mt-4 pt-3 border-t border-[#EDE8DF] flex justify-end">
        <button
          onClick={() => setConfirming(true)}
          className="text-[11px] text-[#C4B9B0] hover:text-[#9E9188] transition-colors"
        >
          Entfernen
        </button>
      </div>
    </div>
  )
}

// ─── Page content ─────────────────────────────────────────────────────────────

export function TeamContent({ members: initialMembers }: { members: TeamProfile[] }) {
  const [members, setMembers] = useState(initialMembers)
  const [query,   setQuery]   = useState("")

  function handleRemove(id: string) {
    setMembers((prev) => prev.filter((m) => m.id !== id))
  }

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return members
    return members.filter(
      (m) =>
        m.full_name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q)
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
          {partnerLabel(members.length)}
        </h1>
      </section>

      {/* Search — only when more than 2 members */}
      {members.length > 2 && (
        <section>
          <div className="relative max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C4B9B0]" strokeWidth={1.75} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Name oder E-Mail suchen …"
              className="w-full pl-11 pr-5 py-3.5 text-[14px] bg-[#F5F0E8] border border-[#E8E2D9] rounded-xl text-[#1A1714] placeholder:text-[#C4B9B0] focus:outline-none focus:ring-2 focus:ring-[#5B2D8E]/12 focus:border-[#5B2D8E]/25 transition-all"
            />
          </div>
        </section>
      )}

      {/* List */}
      <section>
        {members.length === 0 ? (
          <div className="bg-[#F5F0E8] rounded-2xl border border-[#E8E2D9] px-8 py-12 text-center">
            <p className="text-[15px] font-medium text-[#1A1714] mb-2">
              Du hast aktuell noch keine Teammitglieder eingeladen.
            </p>
            <p className="text-[13px] text-[#B8AFA7] leading-relaxed max-w-xs mx-auto mb-6">
              Erstelle einen persönlichen Einladungslink und teile ihn mit deinen direkten Partnern.
            </p>
            <div className="flex justify-center">
              <InviteButton />
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-[#F5F0E8] rounded-2xl border border-[#E8E2D9] px-8 py-10 text-center">
            <p className="text-[14px] text-[#B8AFA7]">Keine Ergebnisse für „{query}"</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((member, i) => (
              <MemberCard
                key={member.id}
                member={member}
                index={i}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}
      </section>

    </div>
  )
}
