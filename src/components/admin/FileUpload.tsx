"use client"

import { useState, useRef, DragEvent } from "react"
import { FileText, Upload, X, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const ACCEPT = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "application/zip",
  "application/x-zip-compressed",
  "image/jpeg",
  "image/png",
].join(",")

const MIME_TO_TYPE: Record<string, string> = {
  "application/pdf": "PDF",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "PPTX",
  "application/vnd.ms-powerpoint": "PPTX",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
  "application/msword": "DOCX",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",
  "application/vnd.ms-excel": "XLSX",
  "application/zip": "ZIP",
  "application/x-zip-compressed": "ZIP",
  "image/jpeg": "JPEG",
  "image/png": "PNG",
}

function detectType(file: File): string {
  const byMime = MIME_TO_TYPE[file.type]
  if (byMime) return byMime
  const ext = file.name.split(".").pop()?.toUpperCase() ?? ""
  const map: Record<string, string> = {
    JPG: "JPEG", JPEG: "JPEG", PNG: "PNG",
    PDF: "PDF", PPTX: "PPTX", DOCX: "DOCX",
    XLSX: "XLSX", ZIP: "ZIP",
  }
  return map[ext] ?? ""
}

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function displayName(url: string): string {
  const segment = decodeURIComponent(url.split("/").pop() ?? url)
  // strip timestamp prefix added during upload: {13digits}-{filename}
  return segment.replace(/^\d{13}-/, "")
}

interface FileUploadProps {
  defaultUrl?:      string
  defaultFileType?: string
  defaultFileSize?: string
}

export function FileUpload({ defaultUrl, defaultFileType, defaultFileSize }: FileUploadProps) {
  const [url,      setUrl]      = useState(defaultUrl ?? "")
  const [fileType, setFileType] = useState(defaultFileType ?? "")
  const [fileSize, setFileSize] = useState(defaultFileSize ?? "")
  const [fileName, setFileName] = useState(() => defaultUrl ? displayName(defaultUrl) : "")
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
      const path     = `documents/${Date.now()}-${safeName}`

      const { error: uploadError } = await supabase.storage
        .from("resources")
        .upload(path, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from("resources")
        .getPublicUrl(path)

      setUrl(publicUrl)
      setFileType(detectType(file))
      setFileSize(formatBytes(file.size))
      setFileName(file.name)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload fehlgeschlagen."
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function handleClear() {
    setUrl("")
    setFileType("")
    setFileSize("")
    setFileName("")
    setError(null)
  }

  return (
    <div className="space-y-2">
      <input type="hidden" name="file_url"  value={url} />
      <input type="hidden" name="file_type" value={fileType} />
      <input type="hidden" name="file_size" value={fileSize} />

      {url ? (
        <div className="flex items-center gap-3 px-3 py-2.5 bg-[#FAF9F6] border border-[#E8E2D9] rounded-xl">
          <div className="w-8 h-8 rounded-lg bg-[#5B2D8E]/10 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-[#5B2D8E]" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-[#1A1714] truncate">{fileName}</p>
            {(fileType || fileSize) && (
              <p className="text-[11px] text-[#9E9188]">
                {[fileType, fileSize].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-[#C4B9B0] hover:text-[#C4574A] hover:bg-[#FEF2F1] transition-colors"
          >
            <X className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => !loading && fileRef.current?.click()}
          className={[
            "border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all",
            "flex flex-col items-center justify-center gap-2 select-none",
            dragging
              ? "border-[#5B2D8E]/50 bg-[#5B2D8E]/5"
              : "border-[#E8E2D9] bg-[#FAF9F6] hover:border-[#5B2D8E]/30 hover:bg-[#F5F0E8]",
          ].join(" ")}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 text-[#5B2D8E] animate-spin" strokeWidth={2} />
              <p className="text-[12px] text-[#9E9188]">Wird hochgeladen…</p>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 text-[#C4B9B0]" strokeWidth={1.5} />
              <p className="text-[12px] font-medium text-[#6B5E52]">
                Datei hier ablegen oder klicken
              </p>
              <p className="text-[11px] text-[#C4B9B0]">
                PDF · DOCX · PPTX · XLSX · ZIP · PNG · JPG · max. 50 MB
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ""
        }}
      />

      {error && <p className="text-[11px] text-[#C4574A]">{error}</p>}
    </div>
  )
}
