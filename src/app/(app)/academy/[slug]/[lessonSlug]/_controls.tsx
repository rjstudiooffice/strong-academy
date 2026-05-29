"use client"

import { useState, useTransition } from "react"
import { CheckCircle2 } from "lucide-react"
import { saveProgress } from "@/lib/supabase/actions"

type Props = {
  lessonId: string
  initialProgress: number
  initialCompleted: boolean
}

export function LessonProgressControls({ lessonId, initialProgress, initialCompleted }: Props) {
  const [progress,   setProgress]   = useState(initialProgress)
  const [completed,  setCompleted]  = useState(initialCompleted)
  const [isPending,  startTransition] = useTransition()

  async function handleProgress(pct: number) {
    startTransition(async () => {
      await saveProgress(lessonId, pct)
      setProgress(pct)
      setCompleted(pct >= 100)
    })
  }

  if (completed) {
    return (
      <div className="inline-flex items-center gap-2 text-[13px] text-[#5B2D8E]/55 bg-[#F0EBF8] px-4 py-2 rounded-xl">
        <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} />
        Lektion abgeschlossen
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {progress > 0 && (
        <div className="flex items-center gap-4">
          <div className="h-[2px] w-40 rounded-full bg-[#E3DDD5] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#5B2D8E]/40 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[11px] text-[#B8AFA7] tabular-nums">{progress}% gesehen</span>
        </div>
      )}

      <div className="flex items-center gap-2.5 flex-wrap">
        {([25, 50, 75] as const).map((pct) => (
          <button
            key={pct}
            disabled={isPending || progress >= pct}
            onClick={() => handleProgress(pct)}
            className="text-[12px] font-medium px-3 py-1.5 rounded-lg bg-[#F5F0E8] border border-[#E8E2D9] text-[#6B5E52] hover:bg-[#EDE8DF] transition-colors disabled:opacity-35 disabled:cursor-default"
          >
            {pct}%
          </button>
        ))}
        <button
          disabled={isPending}
          onClick={() => handleProgress(100)}
          className="text-[12px] font-medium px-4 py-1.5 rounded-lg bg-[#5B2D8E] text-white hover:bg-[#4A2478] transition-colors disabled:opacity-60"
        >
          {isPending ? "Wird gespeichert …" : "Abgeschlossen markieren"}
        </button>
      </div>
    </div>
  )
}
