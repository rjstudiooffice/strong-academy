"use client"

import { logout } from "@/lib/supabase/actions"
import { LogOut } from "lucide-react"

export function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="w-full flex items-center justify-between gap-3 py-4 group text-left"
      >
        <div className="flex items-baseline gap-5 sm:gap-8 min-w-0 flex-1">
          <span className="text-[11px] sm:text-[12px] font-medium text-[#B8AFA7] uppercase tracking-widest w-16 sm:w-24 shrink-0">
            Konto
          </span>
        </div>
        <span className="flex items-center gap-1 text-[12px] font-medium text-[#A06050] group-hover:text-[#8A4A3C] transition-colors">
          Abmelden
          <LogOut className="w-3 h-3" strokeWidth={2} />
        </span>
      </button>
    </form>
  )
}
