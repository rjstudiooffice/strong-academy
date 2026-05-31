"use client"

import { useState, useMemo } from "react"
import { Search, ChevronRight, ChevronDown } from "lucide-react"
import { MEMBER_AVATAR_COLORS } from "@/lib/data/team"
import { InviteButton } from "@/components/features/InviteButton"
import { removePartner } from "@/lib/supabase/actions"

// ── Types ──────────────────────────────────────────────────────────────────────

export type DownlineFlatMember = {
  id:           string
  full_name:    string
  email:        string
  avatar_url:   string | null
  created_at:   string
  sponsor_id:   string
  sponsor_name: string | null
  depth:        number
}

type DownlineMember = DownlineFlatMember & {
  children: DownlineMember[]
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function avatarColor(id: string): string {
  const hash = [...id].reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return MEMBER_AVATAR_COLORS[hash % MEMBER_AVATAR_COLORS.length]
}

function initials(name: string): string {
  return name.split(" ").filter(Boolean).slice(0, 2).map((n) => n[0]).join("").toUpperCase() || "?"
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("de-DE", { month: "long", year: "numeric" })
}

function buildTree(flat: DownlineFlatMember[], rootId: string): DownlineMember[] {
  const map = new Map<string, DownlineMember>()
  for (const p of flat) map.set(p.id, { ...p, children: [] })
  const roots: DownlineMember[] = []
  for (const node of map.values()) {
    if (node.sponsor_id === rootId) {
      roots.push(node)
    } else {
      map.get(node.sponsor_id)?.children.push(node)
    }
  }
  return roots
}

function getSubtreeIds(id: string, flat: DownlineFlatMember[]): Set<string> {
  const ids = new Set<string>()
  function collect(nodeId: string) {
    ids.add(nodeId)
    for (const m of flat) {
      if (m.sponsor_id === nodeId) collect(m.id)
    }
  }
  collect(id)
  return ids
}

// ── MemberCard ─────────────────────────────────────────────────────────────────

function MemberCard({
  member,
  isDirect,
  childCount,
  expanded,
  onToggle,
  onRemove,
}: {
  member: DownlineMember
  isDirect: boolean
  childCount: number
  expanded: boolean
  onToggle?: () => void
  onRemove: (id: string) => void
}) {
  const [confirming, setConfirming] = useState(false)
  const [removing,   setRemoving]   = useState(false)
  const [imgError,   setImgError]   = useState(false)

  const color = avatarColor(member.id)

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
          <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center shrink-0 opacity-40`}>
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
              <button onClick={() => setConfirming(false)} disabled={removing}
                className="text-[13px] font-medium text-[#6B5E52] hover:text-[#1A1714] transition-colors disabled:opacity-40">
                Abbrechen
              </button>
              <button onClick={handleConfirm} disabled={removing}
                className="text-[13px] font-medium text-[#A06050] hover:text-[#8A4A3C] transition-colors disabled:opacity-40">
                {removing ? "Wird entfernt …" : "Ja, entfernen"}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#F5F0E8] border border-[#E8E2D9] rounded-2xl overflow-hidden">
      {/* Main row */}
      <div className="flex items-center gap-4 px-5 py-4">
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shrink-0 overflow-hidden`}>
          {member.avatar_url && !imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={member.avatar_url} alt="" className="w-full h-full object-cover" onError={() => setImgError(true)} />
          ) : (
            <span className="text-white text-[12px] font-semibold">{initials(member.full_name)}</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-[#1A1714] truncate leading-snug">
            {member.full_name}
          </p>
          <p className="text-[12px] text-[#9E9188] truncate mt-0.5">
            {member.email}
          </p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <p className="text-[11px] text-[#C4B9B0]">
              Partner seit {formatDate(member.created_at)}
            </p>
            {!isDirect && member.sponsor_name && (
              <>
                <span className="text-[#DDD8D2] text-[10px]">·</span>
                <p className="text-[11px] text-[#C4B9B0]">
                  via {member.sponsor_name}
                </p>
              </>
            )}
          </div>
        </div>

        {isDirect && (
          <button onClick={() => setConfirming(true)}
            className="text-[11px] text-[#C4B9B0] hover:text-[#9E9188] transition-colors shrink-0 ml-1">
            Entf.
          </button>
        )}
      </div>

      {/* Expand / collapse strip */}
      {onToggle && childCount > 0 && (
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between px-5 py-2.5 border-t border-[#EDE8DF] text-[12px] text-[#9E9188] hover:bg-[#EDE8DF] transition-colors"
        >
          <span>{childCount === 1 ? "1 Partner" : `${childCount} Partner`}</span>
          {expanded
            ? <ChevronDown className="w-3.5 h-3.5 text-[#B8AFA7]" strokeWidth={2} />
            : <ChevronRight className="w-3.5 h-3.5 text-[#B8AFA7]" strokeWidth={2} />
          }
        </button>
      )}
    </div>
  )
}

// ── TreeNode (recursive) ───────────────────────────────────────────────────────

function TreeNode({
  member,
  currentUserId,
  onRemove,
}: {
  member: DownlineMember
  currentUserId: string
  onRemove: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const hasChildren = member.children.length > 0

  return (
    <div>
      <MemberCard
        member={member}
        isDirect={member.sponsor_id === currentUserId}
        childCount={member.children.length}
        expanded={expanded}
        onToggle={hasChildren ? () => setExpanded((v) => !v) : undefined}
        onRemove={onRemove}
      />
      {expanded && hasChildren && (
        <div className="ml-3 mt-2 pl-3 border-l border-[#E8E2D9] space-y-2">
          {member.children.map((child) => (
            <TreeNode key={child.id} member={child} currentUserId={currentUserId} onRemove={onRemove} />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Page content ───────────────────────────────────────────────────────────────

export function TeamContent({
  members: initialMembers,
  currentUserId,
}: {
  members: DownlineFlatMember[]
  currentUserId: string
}) {
  const [members, setMembers] = useState(initialMembers)
  const [query,   setQuery]   = useState("")

  const directCount = useMemo(
    () => members.filter((m) => m.sponsor_id === currentUserId).length,
    [members, currentUserId]
  )

  function handleRemove(id: string) {
    const toRemove = getSubtreeIds(id, members)
    setMembers((prev) => prev.filter((m) => !toRemove.has(m.id)))
  }

  // While searching: flat filtered list
  const filteredFlat = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return null
    return members.filter(
      (m) => m.full_name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)
    )
  }, [members, query])

  // Default: tree
  const tree = useMemo(
    () => buildTree(members, currentUserId),
    [members, currentUserId]
  )

  return (
    <div className="space-y-10 pt-2 max-w-2xl">

      {/* Hero */}
      <section>
        <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-5">
          Mein Team
        </p>
        <h1 className="text-[1.65rem] sm:text-[2rem] font-semibold text-[#1A1714] tracking-tight leading-tight">
          {directCount === 1 ? "1 Direkter Partner" : `${directCount} Direkte Partner`}
        </h1>
        {members.length > directCount && (
          <p className="text-[14px] text-[#9E9188] mt-1.5">
            {members.length} Partner insgesamt in deiner Downline
          </p>
        )}
      </section>

      {/* Search — only when team is large enough */}
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

      {/* Team */}
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
        ) : filteredFlat !== null ? (
          // Search active: flat list
          filteredFlat.length === 0 ? (
            <div className="bg-[#F5F0E8] rounded-2xl border border-[#E8E2D9] px-8 py-10 text-center">
              <p className="text-[14px] text-[#B8AFA7]">Keine Ergebnisse für „{query}"</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFlat.map((member) => (
                <TreeNode
                  key={member.id}
                  member={{ ...member, children: [] }}
                  currentUserId={currentUserId}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          )
        ) : (
          // Default: collapsible tree
          <div className="space-y-3">
            {tree.map((member) => (
              <TreeNode key={member.id} member={member} currentUserId={currentUserId} onRemove={handleRemove} />
            ))}
          </div>
        )}
      </section>

    </div>
  )
}
