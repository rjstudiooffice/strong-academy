import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { createCategory } from "@/lib/supabase/admin-mutations"

const INPUT = "w-full px-3 py-2.5 text-[13px] bg-[#FAF9F6] border border-[#E8E2D9] rounded-xl text-[#1A1714] placeholder:text-[#C4B9B0] focus:outline-none focus:ring-2 focus:ring-[#5B2D8E]/15 focus:border-[#5B2D8E]/30 transition-all"
const LABEL = "block text-[12px] font-semibold text-[#6B5E52] mb-1.5"

export default function NeueKategoriePage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <Link href="/admin/kategorien" className="inline-flex items-center gap-1.5 text-[12px] text-[#9E9188] hover:text-[#1A1714] transition-colors mb-4">
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
          Zurück
        </Link>
        <h1 className="text-[1.65rem] font-semibold text-[#1A1714] tracking-tight">Neue Kategorie</h1>
      </div>

      <form action={createCategory} className="bg-white border border-[#E8E2D9] rounded-2xl p-6 space-y-5">

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>Name *</label>
            <input name="name" type="text" required placeholder="Produktwissen" className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Slug *</label>
            <input name="slug" type="text" required placeholder="produktwissen" className={INPUT} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>Typ *</label>
            <select name="type" required className={INPUT}>
              <option value="foundation">Foundation</option>
              <option value="library">Wissensbibliothek</option>
              <option value="leadership">Leadership</option>
            </select>
          </div>
          <div>
            <label className={LABEL}>Tagline</label>
            <input name="tagline" type="text" placeholder="Strong OG" className={INPUT} />
          </div>
        </div>

        <div>
          <label className={LABEL}>Beschreibung</label>
          <textarea name="description" rows={3} placeholder="Kurze Beschreibung der Kategorie…" className={INPUT} />
        </div>

        <div>
          <label className={LABEL}>Video-Präfix (Bunny Stream)</label>
          <input
            name="video_prefix"
            type="text"
            placeholder="academy_produktwissen_"
            className={INPUT}
          />
          <p className="mt-1.5 text-[11px] text-[#B8AFA7]">
            Schema: bereich_kategorie_ — wird für automatische Bunny-Filterung verwendet.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={LABEL}>Index-Label</label>
            <input name="index_label" type="text" placeholder="01" className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Reihenfolge</label>
            <input name="sort_order" type="number" defaultValue={0} className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Status</label>
            <select name="is_active" className={INPUT}>
              <option value="true">Aktiv</option>
              <option value="false">Inaktiv</option>
            </select>
          </div>
        </div>

        <div className="pt-2 border-t border-[#E8E2D9]">
          <p className="text-[11px] font-semibold text-[#9E9188] uppercase tracking-wider mb-3">Bilder</p>
          <div className="space-y-3">
            <div>
              <label className={LABEL}>Cover-Bild URL (Kategorie-Karte)</label>
              <input name="cover_image_url" type="text" placeholder="/produktwissen_category_card.png" className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Hero-Bild URL (Kategorie-Detail)</label>
              <input name="hero_image_url" type="text" placeholder="/produktwissen_hero.png" className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Cover-Gradient (Tailwind)</label>
              <input name="cover_gradient" type="text" placeholder="from-[#9EB88C] to-[#7A9C68]" className={INPUT} />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#5B2D8E] text-white rounded-xl text-[13px] font-medium hover:bg-[#4A2478] transition-colors"
          >
            Kategorie anlegen
          </button>
          <Link
            href="/admin/kategorien"
            className="px-5 py-2.5 border border-[#E8E2D9] text-[#6B5E52] rounded-xl text-[13px] font-medium hover:bg-[#F5F0E8] transition-colors"
          >
            Abbrechen
          </Link>
        </div>
      </form>
    </div>
  )
}
