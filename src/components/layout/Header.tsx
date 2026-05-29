"use client"

import { Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import type { Profile } from "@/lib/supabase/profile"
import { profileInitials } from "@/lib/supabase/profile"

type Props = { profile: Profile | null }

export function Header({ profile }: Props) {
  const initials = profile ? profileInitials(profile) : "?"
  const name     = profile?.full_name ?? ""

  return (
    <header className="sticky top-0 z-30 bg-[#FAF9F6]/90 backdrop-blur-sm border-b border-[#E8E2D9] px-6 py-3">
      <div className="flex items-center gap-4">
        {/* Search — native form, zero JS required */}
        <form action="/suche" method="get" className="flex-1 max-w-md">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C4B9B0] pointer-events-none"
              strokeWidth={1.75}
            />
            <input
              type="search"
              name="q"
              placeholder="Suche nach Inhalten, Themen oder Ressourcen …"
              autoComplete="off"
              className="w-full pl-9 pr-4 py-2 text-[13px] bg-[#F5F0E8] border border-[#E8E2D9] rounded-xl text-[#1A1714] placeholder:text-[#C4B9B0] focus:outline-none focus:ring-2 focus:ring-[#5B2D8E]/15 focus:border-[#5B2D8E]/30 transition-all"
            />
          </div>
        </form>

        {/* User — links to profile */}
        <Link href="/profil" className="flex items-center gap-2.5 ml-auto group">
          <Avatar className="w-8 h-8">
            <AvatarImage src={profile?.avatar_url ?? ""} alt={name} />
            <AvatarFallback className="bg-[#5B2D8E] text-white text-xs font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <p className="text-[13px] font-medium text-[#1A1714] leading-none group-hover:text-[#5B2D8E] transition-colors">
              {name}
            </p>
          </div>
        </Link>
      </div>
    </header>
  )
}
