import { getAdminInvitations } from "@/lib/supabase/admin-queries"
import { toggleInvitationActive, deleteInvitation, extendInvitation } from "@/lib/supabase/admin-mutations"
import { InvitationCopyButton } from "@/components/admin/InvitationCopyButton"
import { DeleteButton } from "@/components/admin/DeleteButton"

export const dynamic = "force-dynamic"

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
  })
}

function isExpired(iso: string) {
  return new Date(iso) < new Date()
}

export default async function AdminEinladungenPage() {
  const invitations = await getAdminInvitations()

  const active   = invitations.filter((i) => i.is_active && !isExpired(i.expires_at))
  const inactive = invitations.filter((i) => !i.is_active || isExpired(i.expires_at))

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-1">Admin</p>
        <h1 className="text-[1.65rem] font-semibold text-[#1A1714] tracking-tight">Einladungen</h1>
        <p className="text-[13px] text-[#9E9188] mt-1">
          Links sind 3 Tage gültig und können von mehreren Personen genutzt werden.
        </p>
      </div>

      {/* Aktive Links */}
      <div className="space-y-3">
        <p className="text-[11px] font-semibold text-[#9E9188] uppercase tracking-wider">
          Aktive Links — {active.length}
        </p>

        {active.length === 0 && (
          <div className="bg-white border border-[#E8E2D9] rounded-2xl px-6 py-8 text-center text-[13px] text-[#B8AFA7]">
            Keine aktiven Einladungslinks.
          </div>
        )}

        {active.map((inv) => (
          <div key={inv.id} className="bg-white border border-[#E8E2D9] rounded-2xl px-5 py-4">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#EDF3F0] text-[#3A7A5C]">
                    Aktiv
                  </span>
                  <span className="text-[11px] text-[#B8AFA7]">
                    {inv.use_count} × genutzt
                  </span>
                </div>
                <p className="text-[13px] font-medium text-[#1A1714] mb-0.5">
                  Erstellt von {inv.creator_name ?? inv.creator_email}
                </p>
                <p className="text-[11px] text-[#B8AFA7]">
                  Läuft ab: {formatDate(inv.expires_at)} · Erstellt: {formatDate(inv.created_at)}
                </p>
                <p className="text-[11px] font-mono text-[#C4B9B0] mt-1.5 truncate">
                  Token: {inv.token.substring(0, 16)}…
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <InvitationCopyButton token={inv.token} />
                <form action={extendInvitation}>
                  <input type="hidden" name="id" value={inv.id} />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg border border-[#E8E2D9] text-[12px] text-[#6B5E52] hover:bg-[#F5F0E8] transition-colors"
                  >
                    +3 Tage verlängern
                  </button>
                </form>
                <form action={toggleInvitationActive}>
                  <input type="hidden" name="id" value={inv.id} />
                  <input type="hidden" name="is_active" value="true" />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg border border-[#E8E2D9] text-[12px] text-[#C4574A] hover:bg-[#FEF2F1] hover:border-[#C4574A]/20 transition-colors"
                  >
                    Deaktivieren
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Inaktive / abgelaufene Links */}
      {inactive.length > 0 && (
        <div className="space-y-3">
          <p className="text-[11px] font-semibold text-[#9E9188] uppercase tracking-wider">
            Inaktiv / Abgelaufen — {inactive.length}
          </p>

          {inactive.map((inv) => {
            const expired = isExpired(inv.expires_at)
            return (
              <div key={inv.id} className="bg-[#FAF9F6] border border-[#E8E2D9] rounded-2xl px-5 py-4 opacity-70">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${expired ? "bg-[#F5F4F2] text-[#B8AFA7]" : "bg-[#FEF2F1] text-[#C4574A]"}`}>
                        {expired ? "Abgelaufen" : "Deaktiviert"}
                      </span>
                      <span className="text-[11px] text-[#B8AFA7]">
                        {inv.use_count} × genutzt
                      </span>
                    </div>
                    <p className="text-[13px] font-medium text-[#6B5E52] mb-0.5">
                      {inv.creator_name ?? inv.creator_email}
                    </p>
                    <p className="text-[11px] text-[#B8AFA7]">
                      {expired ? "Abgelaufen" : "Deaktiviert"}: {formatDate(inv.expires_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <form action={extendInvitation}>
                      <input type="hidden" name="id" value={inv.id} />
                      <button
                        type="submit"
                        className="px-3 py-1.5 rounded-lg border border-[#E8E2D9] text-[12px] text-[#3A7A5C] hover:bg-[#EDF3F0] transition-colors"
                      >
                        Reaktivieren (+3 Tage)
                      </button>
                    </form>
                    <DeleteButton
                      action={deleteInvitation}
                      id={inv.id}
                      label="Löschen"
                      confirmText="Einladung permanent löschen?"
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
