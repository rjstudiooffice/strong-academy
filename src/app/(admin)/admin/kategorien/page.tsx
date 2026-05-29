import Link from "next/link"
import { getAdminCategories } from "@/lib/supabase/admin-queries"
import { deleteCategory, reorderCategoryUp, reorderCategoryDown } from "@/lib/supabase/admin-mutations"
import { DeleteButton } from "@/components/admin/DeleteButton"
import { ReorderButtons } from "@/components/admin/ReorderButtons"
import { Plus, Pencil } from "lucide-react"

export const dynamic = "force-dynamic"

const TYPE_LABEL: Record<string, string> = {
  foundation: "Foundation",
  library:    "Bibliothek",
  leadership: "Leadership",
}

const TYPE_COLOR: Record<string, string> = {
  foundation: "bg-[#EDF3F0] text-[#3A7A5C]",
  library:    "bg-[#F5EFE8] text-[#8A6040]",
  leadership: "bg-[#F0EBF8] text-[#5B2D8E]",
}

export default async function AdminKategorienPage() {
  const categories = await getAdminCategories()

  // Group by type to determine first/last within each type
  const typeGroups: Record<string, typeof categories> = {}
  for (const cat of categories) {
    if (!typeGroups[cat.type]) typeGroups[cat.type] = []
    typeGroups[cat.type].push(cat)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-1">Admin</p>
          <h1 className="text-[1.65rem] font-semibold text-[#1A1714] tracking-tight">Kategorien</h1>
        </div>
        <Link
          href="/admin/kategorien/neu"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#5B2D8E] text-white rounded-xl text-[13px] font-medium hover:bg-[#4A2478] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={2} />
          Neu
        </Link>
      </div>

      <div className="bg-white border border-[#E8E2D9] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-[13px]">
          <thead>
            <tr className="border-b border-[#E8E2D9] bg-[#FAF9F6]">
              <th className="w-10 px-3 py-3" />
              <th className="text-left px-5 py-3 font-semibold text-[#9E9188] text-[11px] uppercase tracking-wider">Name</th>
              <th className="text-left px-5 py-3 font-semibold text-[#9E9188] text-[11px] uppercase tracking-wider hidden sm:table-cell">Typ</th>
              <th className="text-left px-5 py-3 font-semibold text-[#9E9188] text-[11px] uppercase tracking-wider hidden md:table-cell">Lektionen</th>
              <th className="text-left px-5 py-3 font-semibold text-[#9E9188] text-[11px] uppercase tracking-wider">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E2D9]">
            {categories.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-[#B8AFA7]">
                  Noch keine Kategorien.
                </td>
              </tr>
            )}
            {categories.map((cat) => {
              const group    = typeGroups[cat.type]
              const groupIdx = group.findIndex((c) => c.id === cat.id)
              return (
                <tr key={cat.id} className="hover:bg-[#FAF9F6] transition-colors">
                  {/* Reorder */}
                  <td className="px-3 py-3">
                    <ReorderButtons
                      id={cat.id}
                      upAction={reorderCategoryUp}
                      downAction={reorderCategoryDown}
                      isFirst={groupIdx === 0}
                      isLast={groupIdx === group.length - 1}
                    />
                  </td>
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-medium text-[#1A1714]">{cat.name}</p>
                      <p className="text-[11px] text-[#B8AFA7] mt-0.5">/{cat.slug}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wider ${TYPE_COLOR[cat.type]}`}>
                      {TYPE_LABEL[cat.type]}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[#6B5E52] hidden md:table-cell tabular-nums">
                    {cat.lesson_count}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${cat.is_active ? "bg-[#EDF3F0] text-[#3A7A5C]" : "bg-[#F5F4F2] text-[#B8AFA7]"}`}>
                      {cat.is_active ? "Aktiv" : "Inaktiv"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/kategorien/${cat.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E8E2D9] text-[12px] text-[#6B5E52] hover:bg-[#F5F0E8] transition-colors"
                      >
                        <Pencil className="w-3 h-3" strokeWidth={2} />
                        Bearbeiten
                      </Link>
                      <DeleteButton
                        action={deleteCategory}
                        id={cat.id}
                        label="Löschen"
                        confirmText={`"${cat.name}" wirklich löschen? Alle Lektionen werden ebenfalls gelöscht.`}
                      />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )
}
