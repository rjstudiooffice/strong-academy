"use client"

import { useState, useRef } from "react"
import { Upload, X, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface ImageUploadProps {
  name:         string
  defaultValue?: string
  label:        string
  folder:       string
}

const INPUT_CLS = "w-full px-3 py-2.5 text-[13px] bg-[#FAF9F6] border border-[#E8E2D9] rounded-xl text-[#1A1714] placeholder:text-[#C4B9B0] focus:outline-none focus:ring-2 focus:ring-[#5B2D8E]/15 focus:border-[#5B2D8E]/30 transition-all"

export function ImageUpload({ name, defaultValue, label, folder }: ImageUploadProps) {
  const [url,      setUrl]      = useState(defaultValue ?? "")
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const ext  = file.name.split(".").pop() ?? "jpg"
      const path = `${folder}/${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(path, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from("media")
        .getPublicUrl(path)

      setUrl(publicUrl)
    } catch (err: any) {
      setError(err.message ?? "Upload fehlgeschlagen.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-[12px] font-semibold text-[#6B5E52]">{label}</label>

      {/* URL input — form field */}
      <div className="flex gap-2">
        <input
          name={name}
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://… oder Datei hochladen"
          className={INPUT_CLS}
        />
        {url && (
          <button
            type="button"
            onClick={() => setUrl("")}
            className="shrink-0 w-10 h-10 flex items-center justify-center rounded-xl border border-[#E8E2D9] text-[#C4B9B0] hover:text-[#C4574A] hover:bg-[#FEF2F1] transition-colors"
          >
            <X className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
        )}
      </div>

      {/* Preview + upload button */}
      <div className="flex items-center gap-3">
        {url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt=""
            className="h-16 w-24 object-cover rounded-xl border border-[#E8E2D9]"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        )}

        <button
          type="button"
          disabled={loading}
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-[#E8E2D9] text-[12px] text-[#6B5E52] hover:bg-[#F5F0E8] transition-colors disabled:opacity-50"
        >
          {loading
            ? <><Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={2} /> Lädt hoch…</>
            : <><Upload className="w-3.5 h-3.5" strokeWidth={2} /> Bild hochladen</>
          }
        </button>

        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
            e.target.value = ""
          }}
        />
      </div>

      {error && (
        <p className="text-[11px] text-[#C4574A]">{error}</p>
      )}
    </div>
  )
}
