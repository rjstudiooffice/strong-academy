import Link from "next/link"
import { getAdminResources } from "@/lib/supabase/admin-queries"
import { deleteResource } from "@/lib/supabase/admin-mutations"
import { DeleteButton } from "@/components/admin/DeleteButton"
import { Plus, Pencil } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminRessourcenPage() {
  const resources = await getAdminResources()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-1">Admin</p>
          <h1 className="text-[1.65rem] font-semibold text-[#1A1714] tracking-tight">Ressourcen</h1>
        </div>
        <Link
          href="/admin/ressourcen/neu"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#5B2D8E] text-white rounded-xl text-[13px] font-medium hover:bg-[#4A2478] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={2} />
          Neu
        </Link>
      </div>

      <div className="bg-white border border-[#E8E2D9] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-[13px]">
          <thead>
            <tr className="border-b border-[#E8E2D9] bg-[#FAF9F6]">
              <th className="text-left px-5 py-3 font-semibold text-[#9E9188] text-[11px] uppercase tracking-wider">Titel</th>
              <th className="text-left px-5 py-3 font-semibold text-[#9E9188] text-[11px] uppercase tracking-wider hidden sm:table-cell">Kategorie</th>
              <th className="text-left px-5 py-3 font-semibold text-[#9E9188] text-[11px] uppercase tracking-wider hidden md:table-cell">Typ</th>
              <th className="text-left px-5 py-3 font-semibold text-[#9E9188] text-[11px] uppercase tracking-wider">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E2D9]">
            {resources.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-[#B8AFA7]">
                  Noch keine Ressourcen.
                </td>
              </tr>
            )}
            {resources.map((res) => (
              <tr key={res.id} className="hover:bg-[#FAF9F6] transition-colors">
                <td className="px-5 py-4">
                  <p className="font-medium text-[#1A1714]">{res.title}</p>
                  {res.description && (
                    <p className="text-[11px] text-[#B8AFA7] mt-0.5 truncate max-w-xs">{res.description}</p>
                  )}
                </td>
                <td className="px-5 py-4 text-[#6B5E52] hidden sm:table-cell">
                  {res.category ?? "—"}
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  {res.file_type ? (
                    <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#F0EBF8] text-[#5B2D8E] tracking-wider">
                      {res.file_type}
                    </span>
                  ) : "—"}
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${res.is_active ? "bg-[#EDF3F0] text-[#3A7A5C]" : "bg-[#F5F4F2] text-[#B8AFA7]"}`}>
                    {res.is_active ? "Aktiv" : "Inaktiv"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/ressourcen/${res.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E8E2D9] text-[12px] text-[#6B5E52] hover:bg-[#F5F0E8] transition-colors"
                    >
                      <Pencil className="w-3 h-3" strokeWidth={2} />
                      Bearbeiten
                    </Link>
                    <DeleteButton
                      action={deleteResource}
                      id={res.id}
                      label="Löschen"
                      confirmText={`"${res.title}" wirklich löschen?`}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )
}
