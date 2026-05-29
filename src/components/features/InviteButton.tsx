"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { UserPlus, Copy, Check, X, Loader2 } from "lucide-react"
import { createInvitation } from "@/lib/supabase/actions"

export function InviteButton() {
  const [open,    setOpen]    = useState(false)
  const [link,    setLink]    = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const [copied,  setCopied]  = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)

  async function handleOpen() {
    setOpen(true)
    setLoading(true)
    setLink(null)
    setError(null)

    const result = await createInvitation()
    setLoading(false)

    if ("error" in result) {
      setError(result.error)
    } else {
      setLink(`${window.location.origin}/registrieren?token=${result.token}`)
    }
  }

  function handleClose() {
    setOpen(false)
    setLink(null)
    setError(null)
    setCopied(false)
  }

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = "hidden"
    const t = setTimeout(() => closeRef.current?.focus(), 50)
    return () => { clearTimeout(t); document.body.style.overflow = "" }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open])

  async function handleCopy() {
    if (!link) return
    try {
      await navigator.clipboard.writeText(link)
    } catch {
      const el = document.createElement("textarea")
      el.value = link
      document.body.appendChild(el)
      el.select()
      document.execCommand("copy")
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-[12px] font-medium
          bg-[#F0EBF8] text-[#5B2D8E] border border-[#5B2D8E]/15
          hover:bg-[#E8E0F4] hover:border-[#5B2D8E]/25
          transition-all duration-150 shrink-0"
      >
        <UserPlus className="w-3.5 h-3.5" strokeWidth={1.75} />
        Partner einladen
      </button>

      {open && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Partner einladen"
          style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "flex-end" }}
          className="sm:items-start sm:justify-center sm:pt-[12vh] sm:px-5"
        >
          <div
            style={{ position: "absolute", inset: 0 }}
            className="bg-[#1A1714]/25 backdrop-blur-[5px]"
            onClick={handleClose}
          />

          <div
            className="
              relative w-full sm:max-w-[420px]
              bg-[#FAF9F6] rounded-t-2xl sm:rounded-2xl
              border border-[#E8E2D9]
              shadow-[0_-4px_32px_rgba(26,23,20,0.10),_0_0_0_1px_rgba(26,23,20,0.04)]
              sm:shadow-[0_8px_48px_rgba(26,23,20,0.13),_0_2px_8px_rgba(26,23,20,0.06)]
              px-6 sm:px-7 pt-6 sm:pt-7
            "
            style={{
              zIndex: 1,
              maxHeight: "82dvh",
              paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sm:hidden w-10 h-1 bg-[#E8E2D9] rounded-full mx-auto mb-5" />

            <button
              ref={closeRef}
              onClick={handleClose}
              className="
                absolute top-4 right-4 w-7 h-7 rounded-lg
                bg-[#F5F0E8] hover:bg-[#EDE8DF]
                flex items-center justify-center
                transition-colors focus:outline-none focus:ring-2 focus:ring-[#5B2D8E]/20
              "
            >
              <X className="w-3.5 h-3.5 text-[#9E9188]" strokeWidth={2} />
            </button>

            <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-3">
              Einladung
            </p>
            <h2 className="text-[1.25rem] font-semibold text-[#1A1714] tracking-tight leading-snug mb-2">
              Partner einladen
            </h2>
            <p className="text-[13px] text-[#8C7E6F] leading-relaxed mb-6">
              Teile diesen Link mit Menschen, die du persönlich einladen möchtest. Wer sich darüber registriert, wird automatisch deinem Team zugeordnet.
            </p>

            {loading && (
              <div className="bg-[#F5F0E8] border border-[#E8E2D9] rounded-xl px-4 py-4 flex items-center gap-3">
                <Loader2 className="w-4 h-4 text-[#B8AFA7] animate-spin shrink-0" strokeWidth={2} />
                <p className="text-[13px] text-[#9E9188]">Einladung wird erstellt …</p>
              </div>
            )}

            {error && !loading && (
              <div className="bg-[#FDF2F0] border border-[#E8C4BC] rounded-xl px-4 py-3">
                <p className="text-[13px] text-[#8A4A3C]">{error}</p>
              </div>
            )}

            {link && !loading && (
              <>
                <div className="bg-[#F5F0E8] border border-[#E8E2D9] rounded-xl px-4 py-3 flex items-center gap-3 mb-3">
                  <p className="flex-1 text-[12px] text-[#6B5E52] font-mono truncate select-all">
                    {link}
                  </p>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-[12px] font-medium shrink-0 transition-colors focus:outline-none"
                    style={{ color: copied ? "#5A7A5A" : "#5B2D8E" }}
                  >
                    {copied
                      ? <><Check className="w-3.5 h-3.5" strokeWidth={2.5} /> Kopiert</>
                      : <><Copy className="w-3.5 h-3.5" strokeWidth={1.75} /> Kopieren</>
                    }
                  </button>
                </div>
                <div className="bg-[#F5F0E8] border border-[#E8E2D9] rounded-xl px-4 py-3 text-center">
                  <p className="text-[12px] text-[#6B5E52] leading-relaxed">
                    Bitte teile diesen Link ausschließlich mit deinen direkten Partnern.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
