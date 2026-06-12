import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { createResource } from "@/lib/supabase/admin-mutations"
import { FileUpload } from "@/components/admin/FileUpload"

const INPUT = "w-full px-3 py-2.5 text-[13px] bg-[#FAF9F6] border border-[#E8E2D9] rounded-xl text-[#1A1714] placeholder:text-[#C4B9B0] focus:outline-none focus:ring-2 focus:ring-[#5B2D8E]/15 focus:border-[#5B2D8E]/30 transition-all"
const LABEL = "block text-[12px] font-semibold text-[#6B5E52] mb-1.5"

const CATEGORIES = [
  { id: "produktinformationen",  label: "Produktinformationen" },
  { id: "infomaterial-kunden",   label: "Infomaterial für Kunden" },
  { id: "gesundheitskonzept",    label: "Gesundheitskonzept" },
]

export default function NeueRessource() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <Link href="/admin/ressourcen" className="inline-flex items-center gap-1.5 text-[12px] text-[#9E9188] hover:text-[#1A1714] transition-colors mb-4">
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
          Zurück
        </Link>
        <h1 className="text-[1.65rem] font-semibold text-[#1A1714] tracking-tight">Neue Ressource</h1>
      </div>

      <form action={createResource} className="bg-white border border-[#E8E2D9] rounded-2xl p-6 space-y-5">

        <div>
          <label className={LABEL}>Titel *</label>
          <input name="title" type="text" required placeholder="Produktdatenblatt Strong OG" className={INPUT} />
        </div>

        <div>
          <label className={LABEL}>Beschreibung</label>
          <textarea name="description" rows={2} placeholder="Kurze Beschreibung…" className={INPUT} />
        </div>

        <div>
          <label className={LABEL}>Kategorie</label>
          <select name="category" className={INPUT}>
            <option value="">— Keine Kategorie —</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={LABEL}>Datei *</label>
          <FileUpload />
        </div>

        <div>
          <label className={LABEL}>Reihenfolge</label>
          <input name="sort_order" type="number" defaultValue={0} className={INPUT} />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#5B2D8E] text-white rounded-xl text-[13px] font-medium hover:bg-[#4A2478] transition-colors"
          >
            Ressource anlegen
          </button>
          <Link
            href="/admin/ressourcen"
            className="px-5 py-2.5 border border-[#E8E2D9] text-[#6B5E52] rounded-xl text-[13px] font-medium hover:bg-[#F5F0E8] transition-colors"
          >
            Abbrechen
          </Link>
        </div>
      </form>
    </div>
  )
}
