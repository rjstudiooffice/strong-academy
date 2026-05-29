"use client"

import { useEffect, useState } from "react"
import { Clock, Check, Film } from "lucide-react"

type BunnyVideo = {
  id:               string
  title:            string
  duration_seconds: number
  embed_url:        string
}

interface Props {
  prefix:                   string
  defaultVideoId?:          string | null
  defaultVideoUrl?:         string | null
  defaultDurationSeconds?:  number | null
}

function fmt(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, "0")}`
}

export function BunnyVideoPicker({
  prefix,
  defaultVideoId,
  defaultVideoUrl,
  defaultDurationSeconds,
}: Props) {
  const [videos,   setVideos]   = useState<BunnyVideo[]>([])
  const [loading,  setLoading]  = useState(false)
  const [selected, setSelected] = useState<BunnyVideo | null>(null)

  // Fetch videos when prefix changes
  useEffect(() => {
    if (!prefix) return
    setLoading(true)
    setSelected(null)

    fetch(`/api/admin/bunny-videos?prefix=${encodeURIComponent(prefix)}`)
      .then((r) => r.json())
      .then((data: BunnyVideo[]) => {
        setVideos(data)
        // Restore default selection if video is in list
        if (defaultVideoId) {
          const match = data.find((v) => v.id === defaultVideoId)
          if (match) setSelected(match)
        }
      })
      .catch(() => setVideos([]))
      .finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefix])

  const activeId       = selected?.id               ?? defaultVideoId       ?? ""
  const activeUrl      = selected?.embed_url         ?? defaultVideoUrl      ?? ""
  const activeDuration = selected?.duration_seconds  ?? defaultDurationSeconds ?? ""

  return (
    <div className="space-y-3">
      <p className="text-[12px] font-semibold text-[#6B5E52]">
        Bunny Stream Video *
      </p>

      {/* Hidden form fields */}
      <input type="hidden" name="video_id"         value={activeId} />
      <input type="hidden" name="video_url"         value={activeUrl} />
      <input type="hidden" name="duration_seconds"  value={activeDuration} />

      {loading ? (
        <div className="flex items-center gap-2 px-4 py-3 bg-[#FAF9F6] border border-[#E8E2D9] rounded-xl">
          <span className="w-3.5 h-3.5 rounded-full border-2 border-[#5B2D8E] border-t-transparent animate-spin shrink-0" />
          <span className="text-[13px] text-[#9E9188]">Videos laden…</span>
        </div>
      ) : videos.length === 0 ? (
        <div className="flex items-center gap-3 px-4 py-3 bg-[#FAF9F6] border border-[#E8E2D9] rounded-xl">
          <Film className="w-4 h-4 text-[#C4B9B0] shrink-0" strokeWidth={1.5} />
          <span className="text-[13px] text-[#9E9188]">Keine passenden Videos gefunden</span>
        </div>
      ) : (
        <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
          {videos.map((video) => {
            const isSelected = video.id === activeId
            return (
              <button
                key={video.id}
                type="button"
                onClick={() => setSelected(video)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "border-[#5B2D8E] bg-[#F0EBF8]"
                    : "border-[#E8E2D9] bg-[#FAF9F6] hover:bg-[#F5F0E8]"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    isSelected ? "border-[#5B2D8E] bg-[#5B2D8E]" : "border-[#C4B9B0]"
                  }`}
                >
                  {isSelected && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-[13px] leading-snug truncate ${isSelected ? "font-semibold text-[#5B2D8E]" : "font-medium text-[#1A1714]"}`}>
                    {video.title}
                  </p>
                </div>

                {video.duration_seconds > 0 && (
                  <span className="flex items-center gap-1 text-[11px] text-[#B8AFA7] shrink-0">
                    <Clock className="w-3 h-3" strokeWidth={1.75} />
                    {fmt(video.duration_seconds)}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Current selection summary */}
      {activeId && (
        <p className="text-[11px] text-[#9E9188]">
          Ausgewählt:{" "}
          <span className="font-mono text-[#5B2D8E]">{activeId.slice(0, 8)}…</span>
          {activeDuration ? ` · ${fmt(Number(activeDuration))} Min.` : ""}
        </p>
      )}
    </div>
  )
}
