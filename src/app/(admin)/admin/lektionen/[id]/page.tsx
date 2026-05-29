import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import { getAdminLessonById, getAdminLessonFiles, getAdminCategories } from "@/lib/supabase/admin-queries"
import { updateLesson, createLessonFile, deleteLessonFile } from "@/lib/supabase/admin-mutations"
import { formatDuration } from "@/lib/supabase/content"

export const dynamic = "force-dynamic"

const INPUT = "w-full px-3 py-2.5 text-[13px] bg-[#FAF9F6] border border-[#E8E2D9] rounded-xl text-[#1A1714] placeholder:text-[#C4B9B0] focus:outline-none focus:ring-2 focus:ring-[#5B2D8E]/15 focus:border-[#5B2D8E]/30 transition-all"
const LABEL = "block text-[12px] font-semibold text-[#6B5E52] mb-1.5"

const TYPE_LABEL: Record<string, string> = {
  foundation: "Foundation",
  library:    "Bibliothek",
  leadership: "Leadership",
}

export default async function LektionBearbeitenPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [lesson, files, categories] = await Promise.all([
    getAdminLessonById(id),
    getAdminLessonFiles(id),
    getAdminCategories(),
  ])
  if (!lesson) notFound()

  const action = updateLesson.bind(null, id)
  const addFile = createLessonFile.bind(null, id)

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <Link href="/admin/lektionen" className="inline-flex items-center gap-1.5 text-[12px] text-[#9E9188] hover:text-[#1A1714] transition-colors mb-4">
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
          Zurück
        </Link>
        <h1 className="text-[1.65rem] font-semibold text-[#1A1714] tracking-tight">{lesson.title}</h1>
        <p className="text-[12px] text-[#B8AFA7] mt-1">
          {lesson.category_name} · {formatDuration(lesson.duration_seconds)}
        </p>
      </div>

      <form action={action} className="bg-white border border-[#E8E2D9] rounded-2xl p-6 space-y-5">

        <div>
          <label className={LABEL}>Kategorie *</label>
          <select name="category_id" required defaultValue={lesson.category_id} className={INPUT}>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {TYPE_LABEL[cat.type]} › {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>Titel *</label>
            <input name="title" type="text" required defaultValue={lesson.title} className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Slug *</label>
            <input name="slug" type="text" required defaultValue={lesson.slug} className={INPUT} />
          </div>
        </div>

        <div>
          <label className={LABEL}>Beschreibung</label>
          <textarea name="description" rows={3} defaultValue={lesson.description ?? ""} className={INPUT} />
        </div>

        <div className="pt-2 border-t border-[#E8E2D9]">
          <p className="text-[11px] font-semibold text-[#9E9188] uppercase tracking-wider mb-3">Video</p>
          <div>
            <label className={LABEL}>Video-URL</label>
            <input
              name="video_url"
              type="text"
              defaultValue={lesson.video_url ?? ""}
              placeholder="https://vimeo.com/123456789"
              className={INPUT}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>Dauer (Sekunden)</label>
            <input name="duration_seconds" type="number" defaultValue={lesson.duration_seconds ?? ""} placeholder="300" className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Reihenfolge</label>
            <input name="sort_order" type="number" defaultValue={lesson.sort_order} className={INPUT} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>Thumbnail URL</label>
            <input name="thumbnail_url" type="text" defaultValue={lesson.thumbnail_url ?? ""} className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Cover-Gradient</label>
            <input name="cover_gradient" type="text" defaultValue={lesson.cover_gradient ?? ""} className={INPUT} />
          </div>
        </div>

        <div>
          <label className={LABEL}>Status</label>
          <select name="is_published" defaultValue={String(lesson.is_published)} className={INPUT}>
            <option value="false">Entwurf</option>
            <option value="true">Veröffentlicht</option>
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#5B2D8E] text-white rounded-xl text-[13px] font-medium hover:bg-[#4A2478] transition-colors"
          >
            Speichern
          </button>
          <Link
            href="/admin/lektionen"
            className="px-5 py-2.5 border border-[#E8E2D9] text-[#6B5E52] rounded-xl text-[13px] font-medium hover:bg-[#F5F0E8] transition-colors"
          >
            Abbrechen
          </Link>
        </div>
      </form>

      {/* Lesson files */}
      <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 space-y-4">
        <p className="text-[13px] font-semibold text-[#1A1714]">Anhänge</p>

        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((file) => (
              <div key={file.id} className="flex items-center justify-between gap-4 px-4 py-3 bg-[#FAF9F6] border border-[#E8E2D9] rounded-xl">
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-[#1A1714] truncate">{file.title}</p>
                  <p className="text-[11px] text-[#B8AFA7] truncate mt-0.5">{file.file_url}</p>
                </div>
                <form action={deleteLessonFile}>
                  <input type="hidden" name="id" value={file.id} />
                  <input type="hidden" name="lesson_id" value={id} />
                  <button
                    type="submit"
                    className="p-2 rounded-lg text-[#C4574A] hover:bg-[#FEF2F1] transition-colors shrink-0"
                    onClick={(e) => { if (!confirm(`"${file.title}" wirklich entfernen?`)) e.preventDefault() }}
                  >
                    <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}

        <form action={addFile} className="pt-2 border-t border-[#E8E2D9] space-y-3">
          <p className="text-[12px] font-semibold text-[#9E9188] uppercase tracking-wider">Anhang hinzufügen</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Titel *</label>
              <input name="title" type="text" required placeholder="Produktdatenblatt" className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Sort</label>
              <input name="sort_order" type="number" defaultValue={files.length} className={INPUT} />
            </div>
          </div>
          <div>
            <label className={LABEL}>Datei-URL *</label>
            <input name="file_url" type="text" required placeholder="https://…/datei.pdf" className={INPUT} />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#5B2D8E] text-white rounded-xl text-[13px] font-medium hover:bg-[#4A2478] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={2} />
            Anhang hinzufügen
          </button>
        </form>
      </div>
    </div>
  )
}
