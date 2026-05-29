import { getAdminStats } from "@/lib/supabase/admin-queries"
import { Users, FolderOpen, BookOpen, FileText } from "lucide-react"

export const dynamic = "force-dynamic"

const STAT_ICONS = {
  users:      Users,
  categories: FolderOpen,
  lessons:    BookOpen,
  resources:  FileText,
}

const STAT_LABELS: Record<string, string> = {
  users:      "Benutzer",
  categories: "Kategorien",
  lessons:    "Lektionen",
  resources:  "Ressourcen",
}

export default async function AdminDashboard() {
  const stats = await getAdminStats()

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-1">
          Admin
        </p>
        <h1 className="text-[1.65rem] font-semibold text-[#1A1714] tracking-tight">
          Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {(["users", "categories", "lessons", "resources"] as const).map((key) => {
          const Icon = STAT_ICONS[key]
          return (
            <div key={key} className="bg-white border border-[#E8E2D9] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[12px] font-medium text-[#9E9188]">{STAT_LABELS[key]}</p>
                <div className="w-8 h-8 rounded-xl bg-[#F5F0E8] flex items-center justify-center">
                  <Icon className="w-4 h-4 text-[#5B2D8E]" strokeWidth={1.75} />
                </div>
              </div>
              <p className="text-[2rem] font-semibold text-[#1A1714] leading-none tabular-nums">
                {stats[key]}
              </p>
            </div>
          )
        })}
      </div>

      <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6">
        <p className="text-[13px] font-semibold text-[#1A1714] mb-4">Schnellzugriff</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { href: "/admin/kategorien/neu", label: "Kategorie anlegen" },
            { href: "/admin/lektionen/neu",  label: "Lektion anlegen" },
            { href: "/admin/ressourcen/neu", label: "Ressource anlegen" },
            { href: "/admin/benutzer",       label: "Benutzer verwalten" },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="flex items-center justify-center text-center px-4 py-3 rounded-xl border border-[#E8E2D9] text-[13px] font-medium text-[#5B2D8E] hover:bg-[#F0EBF8] hover:border-[#5B2D8E]/20 transition-all"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
