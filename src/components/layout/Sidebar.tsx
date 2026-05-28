"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { navItems } from "@/lib/nav"
import { NavIcon } from "./NavIcon"
import { Lock } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = { showTeam: boolean; leadershipUnlocked: boolean }

export function Sidebar({ showTeam, leadershipUnlocked }: Props) {
  const pathname = usePathname()

  const allItems = [
    ...navItems,
    ...(showTeam ? [{ label: "Mein Team", href: "/team", icon: "users" }] : []),
  ]

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 bg-[#F5F0E8] border-r border-[#E8E2D9] h-screen sticky top-0">
      {/* Logo */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0">
            <Image src="/images/logo.png" alt="Strong Academy" width={32} height={32} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#1A1714] leading-none">Strong Academy</p>
            <p className="text-[11px] text-[#9E9188] mt-0.5 leading-none">Lernplattform</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5">
        {allItems.map((item) => {
          const isLeadership = item.href === "/leadership"
          const locked       = isLeadership && !leadershipUnlocked
          const isActive     = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-white text-[#5B2D8E] shadow-sm"
                  : locked
                    ? "text-[#B8AFA7] hover:bg-[#EDE8DF] hover:text-[#9E9188]"
                    : "text-[#6B5E52] hover:bg-[#EDE8DF] hover:text-[#1A1714]"
              )}
            >
              <NavIcon
                name={item.icon}
                className={cn(
                  "w-4 h-4 shrink-0",
                  isActive ? "text-[#5B2D8E]" : locked ? "text-[#C4B9B0]" : "text-[#9E9188]"
                )}
              />
              <span className="flex-1">{item.label}</span>
              {locked && (
                <Lock className="w-3 h-3 text-[#C4B9B0] shrink-0" strokeWidth={1.75} />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-6 border-t border-[#E8E2D9] pt-3 mt-3">
        <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#6B5E52] hover:bg-[#EDE8DF] hover:text-[#1A1714] transition-all duration-150">
          <NavIcon name="logout" className="w-4 h-4 shrink-0 text-[#9E9188]" />
          Abmelden
        </button>
      </div>
    </aside>
  )
}
