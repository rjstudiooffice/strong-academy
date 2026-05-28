"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

const tags = [
  "Alle", "Schlaf", "Stress", "Energie", "Führung",
  "Vertrieb", "Fokus", "Mindset", "Ernährung",
]

export function FilterPills() {
  const [active, setActive] = useState("Alle")

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => setActive(tag)}
          className={cn(
            "px-4 py-1.5 rounded-full text-[13px] font-medium border transition-all duration-150",
            active === tag
              ? "bg-[#5B2D8E] text-white border-[#5B2D8E]"
              : "bg-transparent text-[#6B5E52] border-[#E8E2D9] hover:bg-[#F5F0E8] hover:border-[#D8D1C7]"
          )}
        >
          {tag}
        </button>
      ))}
    </div>
  )
}
