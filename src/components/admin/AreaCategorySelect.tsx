"use client"

import { useState } from "react"
import { BunnyVideoPicker } from "./BunnyVideoPicker"

type Category = {
  id:           string
  name:         string
  area_slug:    string | null
  video_prefix: string | null
}

interface Props {
  categories:             Category[]
  defaultCategoryId?:     string
  defaultAreaSlug?:       string
  defaultVideoId?:        string | null
  defaultVideoUrl?:       string | null
  defaultDurationSeconds?: number | null
}

const AREA_LABELS: Record<string, string> = {
  academy:    "Academy (Foundation)",
  leadership: "Leadership",
}

export function AreaCategorySelect({
  categories,
  defaultCategoryId,
  defaultAreaSlug,
  defaultVideoId,
  defaultVideoUrl,
  defaultDurationSeconds,
}: Props) {
  const initialArea = defaultAreaSlug
    ?? categories.find((c) => c.id === defaultCategoryId)?.area_slug
    ?? "academy"

  const [area,  setArea]  = useState(initialArea)
  const [catId, setCatId] = useState(defaultCategoryId ?? "")

  const filteredCats = categories.filter((c) => c.area_slug === area)
  const selectedCat  = filteredCats.find((c) => c.id === catId)

  function handleAreaChange(newArea: string) {
    setArea(newArea)
    setCatId("")
  }

  return (
    <div className="space-y-4">
      {/* Step 1: Area */}
      <div>
        <label className="block text-[12px] font-semibold text-[#6B5E52] mb-2">
          Bereich *
        </label>
        <div className="flex gap-3">
          {Object.entries(AREA_LABELS).map(([value, label]) => (
            <label
              key={value}
              className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                area === value
                  ? "border-[#5B2D8E] bg-[#F0EBF8] text-[#5B2D8E]"
                  : "border-[#E8E2D9] bg-[#FAF9F6] text-[#6B5E52] hover:bg-[#F5F0E8]"
              }`}
            >
              <input
                type="radio"
                name="_area_select"
                value={value}
                checked={area === value}
                onChange={() => handleAreaChange(value)}
                className="sr-only"
              />
              <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                area === value ? "border-[#5B2D8E]" : "border-[#C4B9B0]"
              }`}>
                {area === value && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5B2D8E]" />
                )}
              </span>
              <span className="text-[13px] font-medium">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Step 2: Category */}
      <div>
        <label className="block text-[12px] font-semibold text-[#6B5E52] mb-1.5">
          Kategorie *
        </label>
        <select
          name="category_id"
          required
          value={catId}
          onChange={(e) => setCatId(e.target.value)}
          className="w-full px-3 py-2.5 text-[13px] bg-[#FAF9F6] border border-[#E8E2D9] rounded-xl text-[#1A1714] focus:outline-none focus:ring-2 focus:ring-[#5B2D8E]/15 focus:border-[#5B2D8E]/30 transition-all"
        >
          <option value="">— Kategorie wählen —</option>
          {filteredCats.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Step 3: Bunny Video Picker — appears after category with prefix is selected */}
      {selectedCat?.video_prefix ? (
        <div className="border-t border-[#E8E2D9] pt-4">
          <BunnyVideoPicker
            prefix={selectedCat.video_prefix}
            defaultVideoId={defaultVideoId}
            defaultVideoUrl={defaultVideoUrl}
            defaultDurationSeconds={defaultDurationSeconds}
          />
        </div>
      ) : catId ? (
        // Category selected but no video prefix (library)
        <div className="border-t border-[#E8E2D9] pt-4 text-[12px] text-[#B8AFA7]">
          Diese Kategorie verwendet kein Bunny Stream Video.
        </div>
      ) : null}
    </div>
  )
}
