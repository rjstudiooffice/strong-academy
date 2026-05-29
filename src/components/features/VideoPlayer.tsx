"use client"

import { useEffect, useRef, useState, useId } from "react"
import { CheckCircle2, Clock } from "lucide-react"
import { saveProgress } from "@/lib/supabase/actions"

// ─── PlayerJS loader (Bunny's player API) ─────────────────────────────────────

function loadPlayerJS(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).Playerjs) { resolve(); return }
    const script    = document.createElement("script")
    script.src      = "https://assets.mediadelivery.net/playerjs/player-0.1.0.min.js"
    script.onload   = () => resolve()
    script.onerror  = () => reject(new Error("PlayerJS load failed"))
    document.head.appendChild(script)
  })
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  lessonId:         string | null
  videoUrl:         string | null
  thumbnailUrl?:    string | null
  coverGradient?:   string | null
  title:            string
  categoryTagline?: string | null
  durationSeconds?: number | null
  lessonIndex?:     number
  totalLessons?:    number
  initialProgress:  number
  initialCompleted: boolean
}

const MILESTONES = [25, 50, 75, 100] as const

// ─── Component ────────────────────────────────────────────────────────────────

export function VideoPlayer({
  lessonId,
  videoUrl,
  thumbnailUrl,
  coverGradient,
  title,
  categoryTagline,
  durationSeconds,
  lessonIndex = 0,
  totalLessons = 1,
  initialProgress,
  initialCompleted,
}: Props) {
  const uid        = useId().replace(/:/g, "")
  const iframeId   = `bunny-player-${uid}`
  const iframeRef  = useRef<HTMLIFrameElement>(null)

  const [progress,  setProgress]  = useState(initialProgress)
  const [completed, setCompleted] = useState(initialCompleted)
  const [savedPct,  setSavedPct]  = useState(initialProgress)

  const isBunny = !!videoUrl && videoUrl.includes("iframe.mediadelivery.net")

  const durationLabel = durationSeconds
    ? `${Math.round(durationSeconds / 60)} Min.`
    : null

  // ── Save progress (auto only, no manual trigger) ───────────────────────────
  async function handleProgress(pct: number) {
    if (!lessonId || pct <= savedPct) return
    await saveProgress(lessonId, pct)
    setProgress(pct)
    setCompleted(pct >= 100)
    setSavedPct(pct)
  }

  // ── Bunny Stream: PlayerJS event tracking ──────────────────────────────────
  useEffect(() => {
    if (!isBunny || !iframeRef.current) return

    let destroyed = false

    loadPlayerJS().then(() => {
      if (destroyed || !iframeRef.current) return
      const Playerjs = (window as any).Playerjs
      if (!Playerjs) return

      const player = new Playerjs({ id: iframeId })

      player.on("timeupdate", (data: { currentTime: number; duration: number }) => {
        if (!data.duration) return
        const pct      = Math.round((data.currentTime / data.duration) * 100)
        setProgress(pct)
        const milestone = [...MILESTONES].reverse().find((m) => pct >= m)
        if (milestone) handleProgress(milestone)
      })

      player.on("ended", () => handleProgress(100))
    }).catch(() => {
      // PlayerJS failed to load — no tracking, video still plays
    })

    return () => { destroyed = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBunny, iframeId])

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">

      {/* Video area */}
      <div className="rounded-2xl shadow-[0_4px_40px_rgba(26,23,20,0.10),_0_1px_6px_rgba(26,23,20,0.06)] overflow-hidden">
        {videoUrl ? (
          <div className="aspect-video w-full bg-black">
            <iframe
              ref={iframeRef}
              id={iframeId}
              src={videoUrl}
              className="w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title={title}
            />
          </div>
        ) : (
          // No video — placeholder
          <div
            className={`aspect-video w-full bg-gradient-to-br ${coverGradient ?? "from-[#B0A898] to-[#8C8070]"} relative`}
          >
            {thumbnailUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={thumbnailUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
            )}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 pt-4">
              <span className="text-[11px] font-semibold text-white/65 uppercase tracking-widest">
                {String(lessonIndex + 1).padStart(2, "0")} / {String(totalLessons).padStart(2, "0")}
              </span>
              {durationLabel && (
                <span className="flex items-center gap-1.5 bg-black/18 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Clock className="w-3 h-3 text-white/70" strokeWidth={1.75} />
                  <span className="text-[11px] font-medium text-white/70">{durationLabel}</span>
                </span>
              )}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="w-16 h-16 rounded-full bg-white/75 backdrop-blur-md ring-1 ring-white/25 flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.18)]">
                <span className="text-[#5B2D8E] text-xs font-medium">Video folgt</span>
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 px-6 pb-5 pt-10 bg-gradient-to-t from-black/32 via-black/10 to-transparent">
              {categoryTagline && (
                <p className="text-[10px] font-semibold text-white/55 uppercase tracking-widest mb-1.5">
                  {categoryTagline}
                </p>
              )}
              <p className="text-[15px] font-semibold text-white/90 leading-snug">{title}</p>
            </div>
          </div>
        )}
      </div>

      {/* Progress — read-only, driven by video playback only */}
      {lessonId && (
        <div className="pt-1">
          {completed ? (
            <div className="inline-flex items-center gap-2 text-[13px] text-[#5B2D8E]/55 bg-[#F0EBF8] px-4 py-2 rounded-xl">
              <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} />
              Lektion abgeschlossen
            </div>
          ) : progress > 0 ? (
            <div className="flex items-center gap-4">
              <div className="h-[2px] w-40 rounded-full bg-[#E3DDD5] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#5B2D8E]/40 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[11px] text-[#B8AFA7] tabular-nums">{progress}% gesehen</span>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
