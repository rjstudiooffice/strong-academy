import { getAdminUsers } from "@/lib/supabase/admin-queries"
import { toggleUserActive, toggleLeadershipUnlock, changeUserRole } from "@/lib/supabase/admin-mutations"
import { LeadershipToggle } from "@/components/admin/LeadershipToggle"
import { UserActiveToggle } from "@/components/admin/UserActiveToggle"
import { RoleToggle } from "@/components/admin/RoleToggle"

export const dynamic = "force-dynamic"

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })
}

export default async function AdminBenutzerPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const users = await getAdminUsers(q)

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-1">Admin</p>
        <h1 className="text-[1.65rem] font-semibold text-[#1A1714] tracking-tight">Benutzer</h1>
      </div>

      {/* Search */}
      <form method="get" className="max-w-sm">
        <input
          type="search"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Name oder E-Mail suchen…"
          className="w-full px-3 py-2.5 text-[13px] bg-white border border-[#E8E2D9] rounded-xl text-[#1A1714] placeholder:text-[#C4B9B0] focus:outline-none focus:ring-2 focus:ring-[#5B2D8E]/15 focus:border-[#5B2D8E]/30 transition-all"
        />
      </form>

      <div className="bg-white border border-[#E8E2D9] rounded-2xl overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-[#E8E2D9] bg-[#FAF9F6]">
              <th className="text-left px-5 py-3 font-semibold text-[#9E9188] text-[11px] uppercase tracking-wider">Name</th>
              <th className="text-left px-5 py-3 font-semibold text-[#9E9188] text-[11px] uppercase tracking-wider hidden sm:table-cell">Rolle</th>
              <th className="text-left px-5 py-3 font-semibold text-[#9E9188] text-[11px] uppercase tracking-wider hidden md:table-cell">Leadership</th>
              <th className="text-left px-5 py-3 font-semibold text-[#9E9188] text-[11px] uppercase tracking-wider hidden lg:table-cell">Erstellt</th>
              <th className="text-left px-5 py-3 font-semibold text-[#9E9188] text-[11px] uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 text-right">
                <span className="text-[11px] font-semibold text-[#9E9188] uppercase tracking-wider">Aktionen</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E2D9]">
            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-[#B8AFA7]">
                  {q ? "Keine Benutzer gefunden." : "Noch keine Benutzer."}
                </td>
              </tr>
            )}
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-[#FAF9F6] transition-colors">

                {/* Name + Email */}
                <td className="px-5 py-4">
                  <p className="font-medium text-[#1A1714]">{user.full_name ?? "—"}</p>
                  <p className="text-[11px] text-[#B8AFA7] mt-0.5">{user.email}</p>
                </td>

                {/* Rolle — klickbar zum Wechseln */}
                <td className="px-5 py-4 hidden sm:table-cell">
                  <RoleToggle
                    action={changeUserRole}
                    userId={user.id}
                    role={user.role}
                    userName={user.full_name ?? user.email}
                  />
                </td>

                {/* Leadership — Toggle */}
                <td className="px-5 py-4 hidden md:table-cell">
                  <LeadershipToggle
                    action={toggleLeadershipUnlock}
                    userId={user.id}
                    unlocked={user.leadership_unlocked}
                    userName={user.full_name ?? user.email}
                  />
                </td>

                {/* Erstellt */}
                <td className="px-5 py-4 text-[#B8AFA7] hidden lg:table-cell">
                  {formatDate(user.created_at)}
                </td>

                {/* Status Badge */}
                <td className="px-5 py-4">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    user.is_active ? "bg-[#EDF3F0] text-[#3A7A5C]" : "bg-[#FEF2F1] text-[#C4574A]"
                  }`}>
                    {user.is_active ? "Aktiv" : "Deaktiviert"}
                  </span>
                </td>

                {/* Deaktivieren / Reaktivieren */}
                <td className="px-5 py-4 text-right">
                  <UserActiveToggle
                    action={toggleUserActive}
                    userId={user.id}
                    isActive={user.is_active}
                    userName={user.full_name ?? user.email}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[12px] text-[#B8AFA7]">{users.length} Benutzer</p>
    </div>
  )
}
