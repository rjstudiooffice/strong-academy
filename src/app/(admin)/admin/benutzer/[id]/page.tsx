import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { getAdminUserById, getAdminUsers } from "@/lib/supabase/admin-queries"
import { changeUserSponsor } from "@/lib/supabase/admin-mutations"
import { PasswordResetCard } from "./_password-reset"

export const dynamic = "force-dynamic"

const INPUT = "w-full px-3 py-2.5 text-[13px] bg-[#FAF9F6] border border-[#E8E2D9] rounded-xl text-[#1A1714] focus:outline-none focus:ring-2 focus:ring-[#5B2D8E]/15 focus:border-[#5B2D8E]/30 transition-all"
const LABEL = "block text-[12px] font-semibold text-[#6B5E52] mb-1.5"

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit", month: "long", year: "numeric",
  })
}

export default async function BenutzerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [user, allUsers] = await Promise.all([
    getAdminUserById(id),
    getAdminUsers(),
  ])

  if (!user) notFound()

  // Possible sponsors: every active user except the user themselves
  const possibleSponsors = allUsers.filter((u) => u.id !== id && u.is_active)

  const currentSponsor = possibleSponsors.find((u) => u.id === user.sponsor_id)

  const action = changeUserSponsor.bind(null)

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <Link
          href="/admin/benutzer"
          className="inline-flex items-center gap-1.5 text-[12px] text-[#9E9188] hover:text-[#1A1714] transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
          Zurück
        </Link>
        <h1 className="text-[1.65rem] font-semibold text-[#1A1714] tracking-tight">
          {user.full_name ?? user.email}
        </h1>
        <p className="text-[12px] text-[#B8AFA7] mt-1">
          {user.email} · Mitglied seit {formatDate(user.created_at)}
        </p>
      </div>

      {/* Info card */}
      <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6">
        <p className="text-[11px] font-semibold text-[#9E9188] uppercase tracking-wider mb-4">
          Übersicht
        </p>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-4 text-[13px]">
          <div>
            <dt className="text-[11px] text-[#B8AFA7] mb-0.5">Rolle</dt>
            <dd className="font-medium text-[#1A1714]">{user.role === "admin" ? "Admin" : "Partner"}</dd>
          </div>
          <div>
            <dt className="text-[11px] text-[#B8AFA7] mb-0.5">Status</dt>
            <dd className={`font-medium ${user.is_active ? "text-[#3A7A5C]" : "text-[#C4574A]"}`}>
              {user.is_active ? "Aktiv" : "Deaktiviert"}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] text-[#B8AFA7] mb-0.5">Leadership</dt>
            <dd className="font-medium text-[#1A1714]">
              {user.leadership_unlocked ? "Freigeschaltet" : "Gesperrt"}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] text-[#B8AFA7] mb-0.5">Aktueller Sponsor</dt>
            <dd className="font-medium text-[#1A1714]">
              {currentSponsor
                ? (currentSponsor.full_name ?? currentSponsor.email)
                : <span className="text-[#B8AFA7]">Kein Sponsor</span>
              }
            </dd>
          </div>
        </dl>
      </div>

      {/* Sponsor ändern */}
      <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 space-y-4">
        <div>
          <p className="text-[13px] font-semibold text-[#1A1714]">Führungskraft / Sponsor ändern</p>
          <p className="text-[12px] text-[#9E9188] mt-1">
            Ändert die Zuordnung in der Partnerstruktur. Betrifft Team-Ansichten und Provisions-Logik.
          </p>
        </div>

        <form action={action} className="space-y-4">
          <input type="hidden" name="id" value={user.id} />

          <div>
            <label className={LABEL}>Sponsor zuweisen</label>
            <select
              name="sponsor_id"
              defaultValue={user.sponsor_id ?? ""}
              className={INPUT}
            >
              <option value="">— Kein Sponsor (kein Upline) —</option>
              {possibleSponsors.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.full_name ? `${u.full_name} (${u.email})` : u.email}
                </option>
              ))}
            </select>
          </div>

          {user.sponsor_id && (
            <p className="text-[12px] text-[#9E9188] bg-[#FAF9F6] border border-[#E8E2D9] rounded-xl px-4 py-3">
              Aktuell:{" "}
              <span className="font-medium text-[#1A1714]">
                {currentSponsor?.full_name ?? currentSponsor?.email ?? "Unbekannt"}
              </span>
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#5B2D8E] text-white rounded-xl text-[13px] font-medium hover:bg-[#4A2478] transition-colors"
            >
              Sponsor speichern
            </button>
            <Link
              href="/admin/benutzer"
              className="px-5 py-2.5 border border-[#E8E2D9] text-[#6B5E52] rounded-xl text-[13px] font-medium hover:bg-[#F5F0E8] transition-colors"
            >
              Zurück
            </Link>
          </div>
        </form>
      </div>

      <PasswordResetCard email={user.email} />
    </div>
  )
}
