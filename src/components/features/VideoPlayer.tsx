"use client"

import { useEffect, useRef, useState, useTransition, useId } from "react"
import { CheckCircle2, Clock } from "lucide-react"
import { saveProgress } from "@/lib/supabase/actions"

// ─── Vimeo URL helpers ────────────────────────────────────────────────────────

function parseVimeo(url: string): { id: string; hash?: string } | null {
  // https://vimeo.com/123456789
  // https://vimeo.com/123456789/abcdef
  // https://player.vimeo.com/video/123456789
  // https://player.vimeo.com/video/123456789?h=abcdef
  const fromPlayer = url.match(/player\.vimeo\.com\/video\/(\d+)(?:\?.*h=([a-zA-Z0-9]+))?/)
  if (fromPlayer) return { id: fromPlayer[1], hash: fromPlayer[2] }
  const fromVimeo = url.match(/vimeo\.com\/(\d+)(?:\/([a-zA-Z0-9]+))?/)
  if (fromVimeo) return { id: fromVimeo[1], hash: fromVimeo[2] }
  return null
}

function buildVimeoEmbed(id: string, playerId: string, hash?: string): string {
  const params = new URLSearchParams({
    api:       "1",
    player_id: playerId,
    autopause: "0",
    color:     "5B2D8E",
  })
  if (hash) params.set("h", hash)
  return `https://player.vimeo.com/video/${id}?${params}`
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
  const uid             = useId().replace(/:/g, "")
  const playerId        = `vimeo-${uid}`
  const iframeRef       = useRef<HTMLIFrameElement>(null)
  const [progress,   setProgress]   = useState(initialProgress)
  const [completed,  setCompleted]  = useState(initialCompleted)
  const [savedPct,   setSavedPct]   = useState(initialProgress)
  const [isPending,  startTransition] = useTransition()

  const vimeo = videoUrl ? parseVimeo(videoUrl) : null
  const embedUrl = vimeo ? buildVimeoEmbed(vimeo.id, playerId, vimeo.hash) : null

  // ── Manual progress ────────────────────────────────────────────────────────
  function handleProgress(pct: number) {
    if (!lessonId || pct <= savedPct) return
    startTransition(async () => {
      await saveProgress(lessonId, pct)
      setProgress(pct)
      setCompleted(pct >= 100)
      setSavedPct(pct)
    })
  }

  // ── Vimeo postMessage tracking ─────────────────────────────────────────────
  useEffect(() => {
    if (!embedUrl || !iframeRef.current) return

    function handleMessage(event: MessageEvent) {
      if (!event.origin.includes("vimeo.com")) return
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data

        if (data.event === "ready") {
          // Subscribe to playProgress and finish events
          iframeRef.current?.contentWindow?.postMessage(
            JSON.stringify({ method: "addEventListener", value: "playProgress" }),
            "https://player.vimeo.com"
          )
          iframeRef.current?.contentWindow?.postMessage(
            JSON.stringify({ method: "addEventListener", value: "finish" }),
            "https://player.vimeo.com"
          )
        }

        if (data.player_id !== playerId) return

        if (data.event === "playProgress") {
          const pct = Math.round((data.data?.percent ?? 0) * 100)
          setProgress(pct)
          // Save at each new milestone
          const milestone = MILESTONES.findLast((m) => pct >= m)
          if (milestone && milestone > savedPct) handleProgress(milestone)
        }

        if (data.event === "finish") {
          handleProgress(100)
        }
      } catch {}
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [embedUrl, playerId, savedPct])

  // ── Duration display ───────────────────────────────────────────────────────
  const durationLabel = durationSeconds
    ? `${Math.round(durationSeconds / 60)} Min.`
    : null

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Video area */}
      <div className="rounded-2xl shadow-[0_4px_40px_rgba(26,23,20,0.10),_0_1px_6px_rgba(26,23,20,0.06)] overflow-hidden">
        {embedUrl ? (
          // Vimeo embed
          <div className="aspect-video w-full bg-black">
            <iframe
              ref={iframeRef}
              id={playerId}
              src={embedUrl}
              className="w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title={title}
            />
          </div>
        ) : videoUrl ? (
          // Other video provider (Bunny, direct URL, etc.)
          <div className="aspect-video w-full bg-black">
            <iframe
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
            className={`aspect-video w-full rounded-2xl bg-gradient-to-br ${coverGradient ?? "from-[#B0A898] to-[#8C8070]"} relative`}
          >
            {thumbnailUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={thumbnailUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
            )}
            {/* Overlay header */}
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
            {/* "Video folgt" center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="w-16 h-16 rounded-full bg-white/75 backdrop-blur-md ring-1 ring-white/25 flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.18)]">
                <span className="text-[#5B2D8E] text-xs font-medium">Video folgt</span>
              </span>
            </div>
            {/* Footer */}
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

      {/* Progress controls */}
      {lessonId && (
        <div className="pt-1">
          {completed ? (
            <div className="inline-flex items-center gap-2 text-[13px] text-[#5B2D8E]/55 bg-[#F0EBF8] px-4 py-2 rounded-xl">
              <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} />
              Lektion abgeschlossen
            </div>
          ) : (
            <div className="space-y-3">
              {/* Progress bar (only visible for Vimeo auto-tracking or if there's progress) */}
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

              {/* Manual controls — shown when no Vimeo (no auto tracking) */}
              {!vimeo && (
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
                </div>
              )}

              <button
                disabled={isPending}
                onClick={() => handleProgress(100)}
                className="text-[12px] font-medium px-4 py-1.5 rounded-lg bg-[#5B2D8E] text-white hover:bg-[#4A2478] transition-colors disabled:opacity-60"
              >
                {isPending ? "Wird gespeichert …" : "Als abgeschlossen markieren"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
