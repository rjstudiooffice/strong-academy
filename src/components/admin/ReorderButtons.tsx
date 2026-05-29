"use client"

import { ChevronUp, ChevronDown } from "lucide-react"

interface ReorderButtonsProps {
  id: string
  upAction:   (formData: FormData) => Promise<void>
  downAction: (formData: FormData) => Promise<void>
  isFirst?: boolean
  isLast?:  boolean
}

export function ReorderButtons({ id, upAction, downAction, isFirst, isLast }: ReorderButtonsProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <form action={upAction}>
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          disabled={isFirst}
          className="w-6 h-6 flex items-center justify-center rounded text-[#B8AFA7] hover:text-[#1A1714] hover:bg-[#F5F0E8] transition-colors disabled:opacity-25 disabled:cursor-default"
        >
          <ChevronUp className="w-3.5 h-3.5" strokeWidth={2} />
        </button>
      </form>
      <form action={downAction}>
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          disabled={isLast}
          className="w-6 h-6 flex items-center justify-center rounded text-[#B8AFA7] hover:text-[#1A1714] hover:bg-[#F5F0E8] transition-colors disabled:opacity-25 disabled:cursor-default"
        >
          <ChevronDown className="w-3.5 h-3.5" strokeWidth={2} />
        </button>
      </form>
    </div>
  )
}
