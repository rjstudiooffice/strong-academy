"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { navItems } from "@/lib/nav"
import { NavIcon } from "./NavIcon"
import { cn } from "@/lib/utils"

type Props = { showTeam: boolean; leadershipUnlocked: boolean }

export function MobileNav({ showTeam, leadershipUnlocked }: Props) {
  const pathname = usePathname()

  const allItems = [
    ...navItems,
    ...(showTeam ? [{ label: "Team", href: "/team", icon: "users" }] : []),
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#F5F0E8]/95 backdrop-blur-md border-t border-[#E8E2D9] pb-safe">
      <div className="flex items-stretch justify-around px-2 pt-1.5 pb-1">
        {allItems.map((item) => {
          const isLeadership = item.href === "/leadership"
          const locked       = isLeadership && !leadershipUnlocked
          const isActive     = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 min-h-[44px] py-1 rounded-xl transition-colors",
                isActive ? "text-[#5B2D8E]" : locked ? "text-[#C4B9B0]" : "text-[#9E9188]"
              )}
            >
              <NavIcon name={locked ? "lock" : item.icon} className="w-[20px] h-[20px]" />
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
