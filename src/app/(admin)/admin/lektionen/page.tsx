import Link from "next/link"
import { getAdminLessons, getAdminCategories } from "@/lib/supabase/admin-queries"
import { deleteLesson, reorderLessonUp, reorderLessonDown, toggleLessonPublished } from "@/lib/supabase/admin-mutations"
import { DeleteButton } from "@/components/admin/DeleteButton"
import { ReorderButtons } from "@/components/admin/ReorderButtons"
import { Plus, Pencil, Search } from "lucide-react"
import { formatDuration } from "@/lib/supabase/content"

export const dynamic = "force-dynamic"

export default async function AdminLektionenPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>
}) {
  const { q, category: catFilter } = await searchParams
  const [allLessons, categories] = await Promise.all([
    getAdminLessons(),
    getAdminCategories(),
  ])

  // Client-side filter (data already loaded)
  const lessons = allLessons.filter((l) => {
    if (catFilter && l.category_id !== catFilter) return false
    if (q) {
      const query = q.toLowerCase()
      return l.title.toLowerCase().includes(query) || l.category_name.toLowerCase().includes(query)
    }
    return true
  })

  // Group by category_id for reorder first/last detection
  const catGroups: Record<string, typeof lessons> = {}
  for (const l of allLessons) {
    if (!catGroups[l.category_id]) catGroups[l.category_id] = []
    catGroups[l.category_id].push(l)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-1">Admin</p>
          <h1 className="text-[1.65rem] font-semibold text-[#1A1714] tracking-tight">Lektionen</h1>
        </div>
        <Link
          href="/admin/lektionen/neu"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#5B2D8E] text-white rounded-xl text-[13px] font-medium hover:bg-[#4A2478] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={2} />
          Neu
        </Link>
      </div>

      {/* Suche + Kategoriefilter */}
      <form method="get" className="flex gap-3 flex-wrap">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#C4B9B0] pointer-events-none" strokeWidth={1.75} />
          <input
            type="search"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Titel suchen…"
            className="w-full pl-9 pr-4 py-2.5 text-[13px] bg-white border border-[#E8E2D9] rounded-xl text-[#1A1714] placeholder:text-[#C4B9B0] focus:outline-none focus:ring-2 focus:ring-[#5B2D8E]/15 focus:border-[#5B2D8E]/30 transition-all"
          />
        </div>
        <select
          name="category"
          defaultValue={catFilter ?? ""}
          className="py-2.5 px-3 text-[13px] bg-white border border-[#E8E2D9] rounded-xl text-[#6B5E52] focus:outline-none focus:ring-2 focus:ring-[#5B2D8E]/15 focus:border-[#5B2D8E]/30 transition-all"
        >
          <option value="">Alle Kategorien</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <button
          type="submit"
          className="px-4 py-2.5 bg-[#F5F0E8] border border-[#E8E2D9] rounded-xl text-[13px] text-[#6B5E52] hover:bg-[#EDE8DF] transition-colors"
        >
          Filtern
        </button>
        {(q || catFilter) && (
          <Link
            href="/admin/lektionen"
            className="px-4 py-2.5 text-[13px] text-[#9E9188] hover:text-[#1A1714] transition-colors"
          >
            Zurücksetzen
          </Link>
        )}
      </form>

      <div className="bg-white border border-[#E8E2D9] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-[13px]">
          <thead>
            <tr className="border-b border-[#E8E2D9] bg-[#FAF9F6]">
              <th className="w-10 px-3 py-3" />
              <th className="text-left px-5 py-3 font-semibold text-[#9E9188] text-[11px] uppercase tracking-wider">Titel</th>
              <th className="text-left px-5 py-3 font-semibold text-[#9E9188] text-[11px] uppercase tracking-wider hidden sm:table-cell">Kategorie</th>
              <th className="text-left px-5 py-3 font-semibold text-[#9E9188] text-[11px] uppercase tracking-wider hidden md:table-cell">Dauer</th>
              <th className="text-left px-5 py-3 font-semibold text-[#9E9188] text-[11px] uppercase tracking-wider hidden md:table-cell">Video</th>
              <th className="text-left px-5 py-3 font-semibold text-[#9E9188] text-[11px] uppercase tracking-wider">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E2D9]">
            {lessons.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-[#B8AFA7]">
                  {q || catFilter ? "Keine Lektionen gefunden." : "Noch keine Lektionen."}
                </td>
              </tr>
            )}
            {lessons.map((lesson) => {
              const group    = catGroups[lesson.category_id] ?? []
              const groupIdx = group.findIndex((l) => l.id === lesson.id)
              const showReorder = !q && !catFilter
              return (
                <tr key={lesson.id} className="hover:bg-[#FAF9F6] transition-colors">
                  <td className="px-3 py-3">
                    {showReorder && (
                      <ReorderButtons
                        id={lesson.id}
                        upAction={reorderLessonUp}
                        downAction={reorderLessonDown}
                        isFirst={groupIdx === 0}
                        isLast={groupIdx === group.length - 1}
                      />
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-medium text-[#1A1714]">{lesson.title}</p>
                      <p className="text-[11px] text-[#B8AFA7] mt-0.5">/{lesson.slug}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[#6B5E52] hidden sm:table-cell">
                    {lesson.category_name}
                  </td>
                  <td className="px-5 py-4 text-[#6B5E52] hidden md:table-cell">
                    {formatDuration(lesson.duration_seconds)}
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    {lesson.video_url ? (
                      <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#EDF3F0] text-[#3A7A5C]">
                        Vorhanden
                      </span>
                    ) : (
                      <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#F5EFE8] text-[#8A6040]">
                        Fehlt
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <form action={toggleLessonPublished}>
                      <input type="hidden" name="id" value={lesson.id} />
                      <input type="hidden" name="is_published" value={String(lesson.is_published)} />
                      <button
                        type="submit"
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium cursor-pointer transition-colors ${
                          lesson.is_published
                            ? "bg-[#EDF3F0] text-[#3A7A5C] hover:bg-[#D8EDD8]"
                            : "bg-[#F5F4F2] text-[#B8AFA7] hover:bg-[#F0EBF8] hover:text-[#5B2D8E]"
                        }`}
                      >
                        {lesson.is_published ? "Veröffentlicht" : "Entwurf"}
                      </button>
                    </form>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/lektionen/${lesson.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E8E2D9] text-[12px] text-[#6B5E52] hover:bg-[#F5F0E8] transition-colors"
                      >
                        <Pencil className="w-3 h-3" strokeWidth={2} />
                        Bearbeiten
                      </Link>
                      <DeleteButton
                        action={deleteLesson}
                        id={lesson.id}
                        label="Löschen"
                        confirmText={`"${lesson.title}" wirklich löschen?`}
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

      <p className="text-[12px] text-[#B8AFA7]">{lessons.length} Lektionen</p>
    </div>
  )
}
