"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard, FolderOpen, BookOpen, FileText,
  Users, Mail, ArrowLeft, Menu, X,
} from "lucide-react"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/admin",            label: "Dashboard",   icon: LayoutDashboard },
  { href: "/admin/kategorien", label: "Kategorien",  icon: FolderOpen },
  { href: "/admin/lektionen",  label: "Lektionen",   icon: BookOpen },
  { href: "/admin/ressourcen", label: "Ressourcen",  icon: FileText },
  { href: "/admin/benutzer",   label: "Benutzer",    icon: Users },
  { href: "/admin/einladungen",label: "Einladungen", icon: Mail },
]

export function AdminMobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Close on route change
  useEffect(() => { setOpen(false) }, [pathname])

  // ESC to close
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false) }
    window.addEventListener("keydown", handler)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", handler)
      document.body.style.overflow = ""
    }
  }, [open])

  const currentLabel = NAV.find((n) =>
    n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href)
  )?.label ?? "Admin"

  return (
    <>
      {/* Sticky top bar */}
      <header className="md:hidden sticky top-0 z-40 bg-white border-b border-[#E8E2D9] px-4 h-14 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest leading-none">
            Strong Academy
          </p>
          <p className="text-[13px] font-semibold text-[#1A1714] leading-tight mt-0.5">
            {currentLabel}
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F5F0E8] hover:bg-[#EDE8DF] transition-colors"
        >
          <Menu className="w-4 h-4 text-[#6B5E52]" strokeWidth={1.75} />
        </button>
      </header>

      {/* Drawer overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#1A1714]/25 backdrop-blur-[4px]"
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <div className="relative w-64 bg-white h-full flex flex-col shadow-xl">
            {/* Header */}
            <div className="px-5 pt-6 pb-5 border-b border-[#E8E2D9] flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-0.5">
                  Strong Academy
                </p>
                <p className="text-[13px] font-semibold text-[#5B2D8E]">Admin</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#F5F0E8] hover:bg-[#EDE8DF] transition-colors"
              >
                <X className="w-3.5 h-3.5 text-[#9E9188]" strokeWidth={2} />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
              {NAV.map(({ href, label, icon: Icon }) => {
                const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href)
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-xl text-[14px] font-medium transition-all",
                      active
                        ? "bg-[#F0EBF8] text-[#5B2D8E]"
                        : "text-[#6B5E52] hover:bg-[#F5F0E8]"
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
                className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-[13px] text-[#9E9188] hover:text-[#1A1714] hover:bg-[#F5F0E8] transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
                Zurück zur App
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
