import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getAdminCategories } from "@/lib/supabase/admin-queries"
import { createLesson } from "@/lib/supabase/admin-mutations"

export const dynamic = "force-dynamic"

const INPUT = "w-full px-3 py-2.5 text-[13px] bg-[#FAF9F6] border border-[#E8E2D9] rounded-xl text-[#1A1714] placeholder:text-[#C4B9B0] focus:outline-none focus:ring-2 focus:ring-[#5B2D8E]/15 focus:border-[#5B2D8E]/30 transition-all"
const LABEL = "block text-[12px] font-semibold text-[#6B5E52] mb-1.5"

const TYPE_LABEL: Record<string, string> = {
  foundation: "Foundation",
  library:    "Bibliothek",
  leadership: "Leadership",
}

export default async function NeueLektion() {
  const categories = await getAdminCategories()

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <Link href="/admin/lektionen" className="inline-flex items-center gap-1.5 text-[12px] text-[#9E9188] hover:text-[#1A1714] transition-colors mb-4">
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
          Zurück
        </Link>
        <h1 className="text-[1.65rem] font-semibold text-[#1A1714] tracking-tight">Neue Lektion</h1>
      </div>

      <form action={createLesson} className="bg-white border border-[#E8E2D9] rounded-2xl p-6 space-y-5">

        <div>
          <label className={LABEL}>Kategorie *</label>
          <select name="category_id" required className={INPUT}>
            <option value="">— Kategorie wählen —</option>
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
            <input name="title" type="text" required placeholder="Was ist Strong OG?" className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Slug *</label>
            <input name="slug" type="text" required placeholder="was-ist-strong-og" className={INPUT} />
          </div>
        </div>

        <div>
          <label className={LABEL}>Beschreibung</label>
          <textarea name="description" rows={3} placeholder="Kurze Beschreibung der Lektion…" className={INPUT} />
        </div>

        <div className="pt-2 border-t border-[#E8E2D9]">
          <p className="text-[11px] font-semibold text-[#9E9188] uppercase tracking-wider mb-3">Video</p>
          <div>
            <label className={LABEL}>Video-URL</label>
            <input
              name="video_url"
              type="text"
              placeholder="https://iframe.mediadelivery.net/embed/LIBRARY_ID/VIDEO_ID"
              className={INPUT}
            />
            <p className="mt-1.5 text-[11px] text-[#B8AFA7]">
              Bunny Stream Embed-URL hinterlegen — Fortschritt wird automatisch getrackt.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>Dauer (Sekunden)</label>
            <input name="duration_seconds" type="number" placeholder="300" className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Reihenfolge</label>
            <input name="sort_order" type="number" defaultValue={0} className={INPUT} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>Thumbnail URL</label>
            <input name="thumbnail_url" type="text" placeholder="/thumbnails/lektion-01.jpg" className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Cover-Gradient (Tailwind)</label>
            <input name="cover_gradient" type="text" placeholder="from-[#A8C094] to-[#7E9E6A]" className={INPUT} />
          </div>
        </div>

        <div>
          <label className={LABEL}>Status</label>
          <select name="is_published" className={INPUT}>
            <option value="false">Entwurf</option>
            <option value="true">Veröffentlicht</option>
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#5B2D8E] text-white rounded-xl text-[13px] font-medium hover:bg-[#4A2478] transition-colors"
          >
            Lektion anlegen
          </button>
          <Link
            href="/admin/lektionen"
            className="px-5 py-2.5 border border-[#E8E2D9] text-[#6B5E52] rounded-xl text-[13px] font-medium hover:bg-[#F5F0E8] transition-colors"
          >
            Abbrechen
          </Link>
        </div>
      </form>
    </div>
  )
}
