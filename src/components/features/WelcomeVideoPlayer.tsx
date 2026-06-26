"use client"

import { useEffect, useRef, useState, useId } from "react"
import { useRouter } from "next/navigation"
import { markWelcomeVideoSeen } from "@/lib/supabase/actions"

// ── PlayerJS loader ────────────────────────────────────────────────────────────
function loadPlayerJS(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).Playerjs) { resolve(); return }
    const script = document.createElement("script")
    script.src = "https://assets.mediadelivery.net/playerjs/player-0.1.0.min.js"
    script.onload = () => resolve()
    script.onerror = () => reject(new Error("PlayerJS load failed"))
    document.head.appendChild(script)
  })
}

// ── Watch-time tracking ────────────────────────────────────────────────────────
// Same anti-skip logic as the lesson VideoPlayer: only continuous playback
// counts, so dragging the seek bar to the end does not mark the video as seen.
type Interval = [number, number]

function mergeIntervals(intervals: Interval[]): Interval[] {
  if (intervals.length === 0) return []
  const sorted = [...intervals].sort((a, b) => a[0] - b[0])
  const result: Interval[] = [[sorted[0][0], sorted[0][1]]]
  for (let i = 1; i < sorted.length; i++) {
    const last = result[result.length - 1]
    if (sorted[i][0] <= last[1]) {
      last[1] = Math.max(last[1], sorted[i][1])
    } else {
      result.push([sorted[i][0], sorted[i][1]])
    }
  }
  return result
}

function totalWatched(intervals: Interval[]): number {
  return intervals.reduce((sum, [a, b]) => sum + (b - a), 0)
}

const COMPLETION_PCT = 95

interface Props {
  videoUrl: string
  durationSeconds?: number | null
}

export function WelcomeVideoPlayer({ videoUrl, durationSeconds }: Props) {
  const uid       = useId().replace(/:/g, "")
  const iframeId  = `welcome-player-${uid}`
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const router    = useRouter()

  const [progress,  setProgress]  = useState(0)
  const [completed, setCompleted] = useState(false)

  const watchedIntervals = useRef<Interval[]>([])
  const playerDuration   = useRef<number | null>(null)
  const lastTime         = useRef<number | null>(null)
  const finished         = useRef(false)

  function addSegment(from: number, to: number, duration: number): number {
    if (to <= from || duration <= 0) return 0
    watchedIntervals.current = mergeIntervals([...watchedIntervals.current, [from, to]])
    const pct = Math.min(Math.round((totalWatched(watchedIntervals.current) / duration) * 100), 100)
    setProgress(pct)
    return pct
  }

  async function finish() {
    if (finished.current) return
    finished.current = true
    setCompleted(true)
    await markWelcomeVideoSeen()
    router.push("/")
  }

  useEffect(() => {
    if (!iframeRef.current) return
    let destroyed = false

    loadPlayerJS().then(() => {
      if (destroyed || !iframeRef.current) return
      const Playerjs = (window as any).Playerjs
      if (!Playerjs) return

      const player = new Playerjs({ id: iframeId })

      player.on("timeupdate", (data: { currentTime: number; duration: number }) => {
        if (!data?.duration || data.currentTime == null) return
        playerDuration.current = data.duration

        const current = data.currentTime
        const prev    = lastTime.current

        if (prev !== null) {
          const delta = current - prev
          // Only count continuous playback — gaps > 3s indicate a seek/skip
          if (delta > 0 && delta <= 3) {
            const watchPct = addSegment(prev, current, data.duration)
            if (watchPct >= COMPLETION_PCT) finish()
          }
        }
        lastTime.current = current
      })

      player.on("seek", (data: any) => {
        const pos = typeof data === "number" ? data : (data?.currentTime ?? null)
        lastTime.current = typeof pos === "number" ? pos : null
      })

      player.on("ended", () => {
        if (destroyed) return
        const duration   = playerDuration.current ?? durationSeconds ?? 0
        const watchedSec = totalWatched(watchedIntervals.current)
        const watchPct   = duration > 0 ? Math.round((watchedSec / duration) * 100) : 0
        if (watchPct >= COMPLETION_PCT) finish()
      })
    }).catch(() => {
      // PlayerJS failed to load — video plays without completion tracking
    })

    return () => { destroyed = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iframeId])

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl shadow-[0_4px_40px_rgba(26,23,20,0.10),_0_1px_6px_rgba(26,23,20,0.06)] bg-black">
        <div className="w-full aspect-video">
          <iframe
            ref={iframeRef}
            id={iframeId}
            src={videoUrl}
            className="w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title="Willkommen bei der Strong Academy"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="h-[2px] flex-1 rounded-full bg-[#E3DDD5] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#5B2D8E]/40 transition-all duration-500"
            style={{ width: `${completed ? 100 : progress}%` }}
          />
        </div>
        <span className="text-[11px] text-[#B8AFA7] tabular-nums shrink-0">
          {completed ? "Fertig" : `${progress}% gesehen`}
        </span>
      </div>
    </div>
  )
}
