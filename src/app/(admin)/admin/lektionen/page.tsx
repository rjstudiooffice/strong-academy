import Link from "next/link"
import { getAdminLessons } from "@/lib/supabase/admin-queries"
import { deleteLesson } from "@/lib/supabase/admin-mutations"
import { Plus, Pencil } from "lucide-react"
import { formatDuration } from "@/lib/supabase/content"

export const dynamic = "force-dynamic"

export default async function AdminLektionenPage() {
  const lessons = await getAdminLessons()

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

      <div className="bg-white border border-[#E8E2D9] rounded-2xl overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-[#E8E2D9] bg-[#FAF9F6]">
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
                <td colSpan={6} className="px-5 py-10 text-center text-[#B8AFA7]">
                  Noch keine Lektionen.
                </td>
              </tr>
            )}
            {lessons.map((lesson) => (
              <tr key={lesson.id} className="hover:bg-[#FAF9F6] transition-colors">
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
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${lesson.is_published ? "bg-[#EDF3F0] text-[#3A7A5C]" : "bg-[#F5F4F2] text-[#B8AFA7]"}`}>
                    {lesson.is_published ? "Veröffentlicht" : "Entwurf"}
                  </span>
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
                    <form action={deleteLesson}>
                      <input type="hidden" name="id" value={lesson.id} />
                      <button
                        type="submit"
                        className="px-3 py-1.5 rounded-lg border border-[#E8E2D9] text-[12px] text-[#C4574A] hover:bg-[#FEF2F1] hover:border-[#C4574A]/20 transition-colors"
                        onClick={(e) => { if (!confirm(`"${lesson.title}" wirklich löschen?`)) e.preventDefault() }}
                      >
                        Löschen
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
