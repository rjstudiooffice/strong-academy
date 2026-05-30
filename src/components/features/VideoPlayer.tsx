"use client"

import { useEffect, useRef, useState, useId } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, Clock, Maximize2, Minimize2 } from "lucide-react"
import { saveProgress } from "@/lib/supabase/actions"
import { cn } from "@/lib/utils"

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
// Progress = unique seconds actually watched / total duration.
// Segments are merged so rewatching the same range never double-counts.
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

// ── Constants ──────────────────────────────────────────────────────────────────
// Lesson is marked complete when ≥95% of actual video duration has been watched.
const COMPLETION_PCT = 95
// Save milestones (watch %, not playhead position)
const MILESTONES = [25, 50, 75, 95] as const
// Show next-lesson overlay this many seconds before the video ends
const OVERLAY_LEAD_SECONDS = 5

// ── Types ──────────────────────────────────────────────────────────────────────
export interface NextLessonInfo {
  title: string
  thumbnailUrl: string | null
  coverGradient: string | null
  href: string
}

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
  nextLesson?:      NextLessonInfo | null
}

// ── Component ──────────────────────────────────────────────────────────────────
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
  nextLesson,
}: Props) {
  const uid          = useId().replace(/:/g, "")
  const iframeId     = `bunny-player-${uid}`
  const iframeRef    = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const router       = useRouter()

  // UI state
  const [progress,     setProgress]     = useState(initialProgress)
  const [completed,    setCompleted]    = useState(initialCompleted)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showOverlay,  setShowOverlay]  = useState(false)
  const [countdown,    setCountdown]    = useState(OVERLAY_LEAD_SECONDS)

  // Mutable tracking refs (no re-render needed)
  const watchedIntervals = useRef<Interval[]>([])
  const playerDuration   = useRef<number | null>(null)
  const lastTime         = useRef<number | null>(null)
  const savedPctRef      = useRef(initialProgress)
  const completedRef     = useRef(initialCompleted)
  const isSaving         = useRef(false)
  const prefetchedNext   = useRef(false)
  const countdownTimer   = useRef<ReturnType<typeof setInterval> | null>(null)
  const overlayTriggered = useRef(false) // prevents re-trigger after dismiss
  const navigating       = useRef(false)
  // Always-current goToNext fn — updated each render to avoid stale closure
  const goToNextRef      = useRef<() => Promise<void>>(async () => {})

  const isBunny = !!videoUrl && videoUrl.includes("iframe.mediadelivery.net")
  const durationLabel = durationSeconds ? `${Math.round(durationSeconds / 60)} Min.` : null
  const supportsFullscreen =
    typeof document !== "undefined" &&
    !!(document.fullscreenEnabled || (document as any).webkitFullscreenEnabled)

  // ── Keep goToNextRef current on every render ───────────────────────────────
  useEffect(() => {
    goToNextRef.current = async () => {
      if (!nextLesson || navigating.current) return
      navigating.current = true
      if (countdownTimer.current) clearInterval(countdownTimer.current)

      // Save final progress before navigating — guarantees no race condition
      if (lessonId) {
        const duration = playerDuration.current ?? durationSeconds ?? 0
        const watchPct = duration > 0
          ? Math.round((totalWatched(watchedIntervals.current) / duration) * 100)
          : 0
        if (watchPct > savedPctRef.current) {
          const isComplete = watchPct >= COMPLETION_PCT
          await saveProgress(lessonId, isComplete ? 100 : watchPct)
          savedPctRef.current = isComplete ? 100 : watchPct
        }
      }

      router.push(nextLesson.href)
    }
  })

  // ── Persist progress at a milestone ───────────────────────────────────────
  async function persistAt(watchPct: number) {
    if (!lessonId || watchPct <= savedPctRef.current || isSaving.current) return
    isSaving.current = true
    const isComplete = watchPct >= COMPLETION_PCT
    const pct = isComplete ? 100 : watchPct
    await saveProgress(lessonId, pct)
    savedPctRef.current = pct
    if (isComplete && !completedRef.current) {
      setCompleted(true)
      completedRef.current = true
    }
    isSaving.current = false
  }

  // ── Add a continuous playback segment ─────────────────────────────────────
  function addSegment(from: number, to: number, duration: number): number {
    if (to <= from || duration <= 0) return 0
    watchedIntervals.current = mergeIntervals([...watchedIntervals.current, [from, to]])
    const pct = Math.min(Math.round((totalWatched(watchedIntervals.current) / duration) * 100), 100)
    setProgress(pct)
    return pct
  }

  // ── Countdown — only runs when lesson is complete ─────────────────────────
  // If the user hasn't watched 95% yet when the overlay appears, the effect
  // re-runs as soon as `completed` flips to true (last seconds of the video).
  useEffect(() => {
    if (!showOverlay || !nextLesson || !completed) return
    setCountdown(OVERLAY_LEAD_SECONDS)
    countdownTimer.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(countdownTimer.current!)
          goToNextRef.current()
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => { if (countdownTimer.current) clearInterval(countdownTimer.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showOverlay, completed])

  // ── Fullscreen API ─────────────────────────────────────────────────────────
  function enterFullscreen() {
    const el = containerRef.current
    if (!el) return
    if (el.requestFullscreen) el.requestFullscreen()
    else if ((el as any).webkitRequestFullscreen) (el as any).webkitRequestFullscreen()
  }

  function exitFullscreen() {
    if (document.exitFullscreen) document.exitFullscreen()
    else if ((document as any).webkitExitFullscreen) (document as any).webkitExitFullscreen()
  }

  useEffect(() => {
    function onFsChange() {
      setIsFullscreen(!!(document.fullscreenElement || (document as any).webkitFullscreenElement))
    }
    document.addEventListener("fullscreenchange", onFsChange)
    document.addEventListener("webkitfullscreenchange", onFsChange)
    return () => {
      document.removeEventListener("fullscreenchange", onFsChange)
      document.removeEventListener("webkitfullscreenchange", onFsChange)
    }
  }, [])

  // ── Prefetch next lesson at 70% watch time ────────────────────────────────
  useEffect(() => {
    if (!nextLesson || prefetchedNext.current || progress < 70) return
    prefetchedNext.current = true
    router.prefetch(nextLesson.href)
  }, [progress, nextLesson, router])

  // ── Bunny Stream / PlayerJS ────────────────────────────────────────────────
  useEffect(() => {
    if (!isBunny || !iframeRef.current) return
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
            const milestone = ([...MILESTONES] as number[]).reverse().find(m => watchPct >= m)
            if (milestone && milestone > savedPctRef.current) {
              persistAt(watchPct)
            }
          }
        }
        lastTime.current = current

        // Show next-lesson overlay OVERLAY_LEAD_SECONDS before the video ends
        if (
          nextLesson &&
          !overlayTriggered.current &&
          current >= data.duration - OVERLAY_LEAD_SECONDS
        ) {
          overlayTriggered.current = true
          setShowOverlay(true)
        }
      })

      // On seek: reset lastTime so the skipped range is excluded from watch time
      player.on("seek", (data: any) => {
        const pos = typeof data === "number" ? data : (data?.currentTime ?? null)
        lastTime.current = typeof pos === "number" ? pos : null
      })

      player.on("ended", async () => {
        if (destroyed) return
        // Save final progress
        const duration   = playerDuration.current ?? durationSeconds ?? 0
        const watchedSec = totalWatched(watchedIntervals.current)
        const watchPct   = duration > 0 ? Math.round((watchedSec / duration) * 100) : 100
        const isComplete = watchPct >= COMPLETION_PCT
        const finalPct   = isComplete ? 100 : watchPct

        if (lessonId && finalPct > savedPctRef.current) {
          await saveProgress(lessonId, finalPct)
          savedPctRef.current = finalPct
          if (isComplete) { setCompleted(true); completedRef.current = true }
        }

        // Fallback: show overlay if it wasn't triggered via timeupdate (very short video)
        if (!destroyed && nextLesson && !overlayTriggered.current) {
          overlayTriggered.current = true
          setShowOverlay(true)
        }
      })
    }).catch(() => {
      // PlayerJS failed — video plays without tracking
    })

    return () => { destroyed = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBunny, iframeId])

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">

      <div
        ref={containerRef}
        className={cn(
          "relative overflow-hidden group",
          isFullscreen
            ? "bg-black"
            : "rounded-2xl shadow-[0_4px_40px_rgba(26,23,20,0.10),_0_1px_6px_rgba(26,23,20,0.06)]"
        )}
      >
        {videoUrl ? (
          // In fullscreen the browser gives containerRef a fixed size — h-full fills it.
          // In normal mode aspect-video maintains 16:9 ratio.
          <div className={cn("w-full bg-black", isFullscreen ? "h-full" : "aspect-video")}>
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
          // No-video placeholder
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

        {/* Custom fullscreen toggle — hidden on platforms without Fullscreen API (iOS Safari) */}
        {videoUrl && supportsFullscreen && (
          <button
            onClick={isFullscreen ? exitFullscreen : enterFullscreen}
            className="absolute bottom-3 right-3 z-10 w-8 h-8 rounded-lg bg-black/40 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
            aria-label={isFullscreen ? "Vollbild beenden" : "Vollbild"}
          >
            {isFullscreen
              ? <Minimize2 className="w-3.5 h-3.5" strokeWidth={2} />
              : <Maximize2 className="w-3.5 h-3.5" strokeWidth={2} />
            }
          </button>
        )}

        {/* Netflix-style next-lesson overlay */}
        {showOverlay && nextLesson && (
          <div className="absolute inset-0 z-20 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center gap-4 p-6">
            {/* Next lesson thumbnail */}
            <div className="w-44 aspect-video rounded-xl overflow-hidden shadow-lg shrink-0">
              {nextLesson.thumbnailUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={nextLesson.thumbnailUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${nextLesson.coverGradient ?? "from-[#B0A898] to-[#8C8070]"}`} />
              )}
            </div>

            <div className="text-center space-y-1.5">
              <p className="text-white/50 text-[11px] font-semibold uppercase tracking-widest">
                Nächste Lektion
              </p>
              <p className="text-white text-[16px] font-semibold leading-snug max-w-[22ch]">
                {nextLesson.title}
              </p>
            </div>

            {/* Countdown ring — only when lesson is complete */}
            {completed && (
              <div className="flex flex-col items-center gap-1.5 shrink-0">
                <div className="relative w-12 h-12">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
                    <circle cx="24" cy="24" r="20" fill="none" stroke="white" strokeOpacity="0.2" strokeWidth="3" />
                    <circle
                      cx="24" cy="24" r="20"
                      fill="none" stroke="white" strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={`${(2 * Math.PI * 20).toFixed(2)}`}
                      strokeDashoffset={`${(2 * Math.PI * 20 * (countdown / OVERLAY_LEAD_SECONDS)).toFixed(2)}`}
                      style={{ transition: "stroke-dashoffset 1s linear" }}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-white text-[15px] font-semibold">
                    {countdown}
                  </span>
                </div>
                <p className="text-white/40 text-[11px]">
                  Startet in {countdown} {countdown === 1 ? "Sekunde" : "Sekunden"}
                </p>
              </div>
            )}

            <div className="flex gap-3 mt-1">
              <button
                onClick={() => {
                  if (countdownTimer.current) clearInterval(countdownTimer.current)
                  goToNextRef.current()
                }}
                className="px-5 py-2.5 rounded-xl bg-[#5B2D8E] hover:bg-[#4A2372] text-white text-[13px] font-semibold transition-colors"
              >
                Nächste Lektion
              </button>
              <button
                onClick={() => {
                  if (countdownTimer.current) clearInterval(countdownTimer.current)
                  setShowOverlay(false)
                }}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 text-[13px] font-medium transition-colors"
              >
                Abbrechen
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Watch-time progress indicator */}
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
