"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FolderOpen, BookOpen, FileText, Users, ChevronRight, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/admin",          label: "Dashboard",   icon: LayoutDashboard },
  { href: "/admin/kategorien", label: "Kategorien",  icon: FolderOpen },
  { href: "/admin/lektionen",  label: "Lektionen",   icon: BookOpen },
  { href: "/admin/ressourcen", label: "Ressourcen",  icon: FileText },
  { href: "/admin/benutzer",   label: "Benutzer",    icon: Users },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 shrink-0 bg-white border-r border-[#E8E2D9] flex flex-col min-h-screen">
      {/* Brand */}
      <div className="px-5 pt-6 pb-5 border-b border-[#E8E2D9]">
        <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-0.5">
          Strong Academy
        </p>
        <p className="text-[13px] font-semibold text-[#5B2D8E]">Admin</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all",
                active
                  ? "bg-[#F0EBF8] text-[#5B2D8E]"
                  : "text-[#6B5E52] hover:bg-[#F5F0E8] hover:text-[#1A1714]"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Back to app */}
      <div className="px-3 py-4 border-t border-[#E8E2D9]">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[12px] text-[#9E9188] hover:text-[#1A1714] hover:bg-[#F5F0E8] transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
          Zurück zur App
        </Link>
      </div>
    </aside>
  )
}
