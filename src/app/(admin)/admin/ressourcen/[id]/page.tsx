import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { getAdminResourceById } from "@/lib/supabase/admin-queries"
import { updateResource } from "@/lib/supabase/admin-mutations"

export const dynamic = "force-dynamic"

const INPUT = "w-full px-3 py-2.5 text-[13px] bg-[#FAF9F6] border border-[#E8E2D9] rounded-xl text-[#1A1714] placeholder:text-[#C4B9B0] focus:outline-none focus:ring-2 focus:ring-[#5B2D8E]/15 focus:border-[#5B2D8E]/30 transition-all"
const LABEL = "block text-[12px] font-semibold text-[#6B5E52] mb-1.5"

const CATEGORIES = [
  { id: "produktinformationen",  label: "Produktinformationen" },
  { id: "infomaterial-kunden",   label: "Infomaterial für Kunden" },
  { id: "gesundheitskonzept",    label: "Gesundheitskonzept" },
]

export default async function RessourceBearbeitenPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const res = await getAdminResourceById(id)
  if (!res) notFound()

  const action = updateResource.bind(null, id)

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <Link href="/admin/ressourcen" className="inline-flex items-center gap-1.5 text-[12px] text-[#9E9188] hover:text-[#1A1714] transition-colors mb-4">
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
          Zurück
        </Link>
        <h1 className="text-[1.65rem] font-semibold text-[#1A1714] tracking-tight">{res.title}</h1>
      </div>

      <form action={action} className="bg-white border border-[#E8E2D9] rounded-2xl p-6 space-y-5">

        <div>
          <label className={LABEL}>Titel *</label>
          <input name="title" type="text" required defaultValue={res.title} className={INPUT} />
        </div>

        <div>
          <label className={LABEL}>Beschreibung</label>
          <textarea name="description" rows={2} defaultValue={res.description ?? ""} className={INPUT} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>Kategorie</label>
            <select name="category" defaultValue={res.category ?? ""} className={INPUT}>
              <option value="">— Keine Kategorie —</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={LABEL}>Dateityp</label>
            <select name="file_type" defaultValue={res.file_type ?? ""} className={INPUT}>
              <option value="">—</option>
              <option value="PDF">PDF</option>
              <option value="PPTX">PPTX</option>
              <option value="DOCX">DOCX</option>
              <option value="JPEG">JPEG</option>
              <option value="PNG">PNG</option>
            </select>
          </div>
        </div>

        <div>
          <label className={LABEL}>Datei-URL *</label>
          <input name="file_url" type="text" required defaultValue={res.file_url} className={INPUT} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={LABEL}>Dateigröße</label>
            <input name="file_size" type="text" defaultValue={res.file_size ?? ""} placeholder="2.4 MB" className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Reihenfolge</label>
            <input name="sort_order" type="number" defaultValue={res.sort_order} className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Status</label>
            <select name="is_active" defaultValue={String(res.is_active)} className={INPUT}>
              <option value="true">Aktiv</option>
              <option value="false">Inaktiv</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#5B2D8E] text-white rounded-xl text-[13px] font-medium hover:bg-[#4A2478] transition-colors"
          >
            Speichern
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
