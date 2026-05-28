"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { navItems } from "@/lib/nav"
import { NavIcon } from "./NavIcon"
import { cn } from "@/lib/utils"

type Props = { showTeam: boolean }

export function MobileNav({ showTeam }: Props) {
  const pathname = usePathname()

  const allItems = [
    ...navItems,
    ...(showTeam ? [{ label: "Team", href: "/team", icon: "users" }] : []),
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#F5F0E8]/95 backdrop-blur-md border-t border-[#E8E2D9] px-4 pb-safe">
      <div className="flex items-center justify-around py-2">
        {allItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all",
                isActive ? "text-[#5B2D8E]" : "text-[#9E9188]"
              )}
            >
              <NavIcon name={item.icon} className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
