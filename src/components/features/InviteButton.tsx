"use client"

import { useState, useEffect, useRef } from "react"
import { UserPlus, Copy, Check, X } from "lucide-react"

type Props = { inviteLink: string }

export function InviteButton({ inviteLink }: Props) {
  const [open,   setOpen]   = useState(false)
  const [copied, setCopied] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)

  // Build the full shareable URL client-side so it works on any domain/port
  const fullLink = typeof window !== "undefined"
    ? `${window.location.origin}${inviteLink}`
    : inviteLink

  // Scroll-lock + focus management
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = "hidden"
    // Focus the close button so keyboard users can dismiss immediately
    const t = setTimeout(() => closeRef.current?.focus(), 50)
    return () => {
      clearTimeout(t)
      document.body.style.overflow = ""
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false) }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(fullLink)
    } catch {
      const el = document.createElement("textarea")
      el.value = fullLink
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
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-[12px] font-medium
          bg-[#F0EBF8] text-[#5B2D8E] border border-[#5B2D8E]/15
          hover:bg-[#E8E0F4] hover:border-[#5B2D8E]/25
          transition-all duration-150 shrink-0"
      >
        <UserPlus className="w-3.5 h-3.5" strokeWidth={1.75} />
        Partner einladen
      </button>

      {/* Modal */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Partner einladen"
          className="fixed inset-0 z-50 flex items-end sm:items-start sm:justify-center sm:pt-[12vh] sm:px-5"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#1A1714]/25 backdrop-blur-[5px]"
            onClick={() => setOpen(false)}
          />

          {/* Card — bottom sheet on mobile, centered modal on sm+ */}
          <div
            className="
              relative z-10 w-full sm:max-w-[420px]
              bg-[#FAF9F6]
              rounded-t-2xl sm:rounded-2xl
              border border-[#E8E2D9]
              shadow-[0_-4px_32px_rgba(26,23,20,0.10),_0_0_0_1px_rgba(26,23,20,0.04)]
              sm:shadow-[0_8px_48px_rgba(26,23,20,0.13),_0_2px_8px_rgba(26,23,20,0.06)]
              px-6 sm:px-7 pt-6 sm:pt-7
              max-h-[82vh] overflow-y-auto
            "
            style={{
              /* Safe area at bottom — works on notch/Dynamic Island devices */
              paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Pull handle — mobile only */}
            <div className="sm:hidden w-10 h-1 bg-[#E8E2D9] rounded-full mx-auto mb-5" />

            {/* Close */}
            <button
              ref={closeRef}
              onClick={() => setOpen(false)}
              className="
                absolute top-4 right-4
                w-7 h-7 rounded-lg
                bg-[#F5F0E8] hover:bg-[#EDE8DF]
                flex items-center justify-center
                transition-colors focus:outline-none focus:ring-2 focus:ring-[#5B2D8E]/20
              "
            >
              <X className="w-3.5 h-3.5 text-[#9E9188]" strokeWidth={2} />
            </button>

            {/* Header */}
            <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-3">
              Einladung
            </p>
            <h2 className="text-[1.25rem] font-semibold text-[#1A1714] tracking-tight leading-snug mb-2">
              Partner einladen
            </h2>
            <p className="text-[13px] text-[#8C7E6F] leading-relaxed mb-6">
              Teile diesen Link mit Menschen, die du persönlich einladen möchtest. Wer sich darüber registriert, wird automatisch deinem Team zugeordnet.
            </p>

            {/* Link field */}
            <div className="bg-[#F5F0E8] border border-[#E8E2D9] rounded-xl px-4 py-3 flex items-center gap-3 mb-3">
              <p className="flex-1 text-[12px] text-[#6B5E52] font-mono truncate select-all">
                {fullLink}
              </p>
              <button
                onClick={handleCopy}
                className="
                  flex items-center gap-1.5 text-[12px] font-medium shrink-0
                  transition-colors focus:outline-none
                "
                style={{ color: copied ? "#5A7A5A" : "#5B2D8E" }}
              >
                {copied
                  ? <><Check className="w-3.5 h-3.5" strokeWidth={2.5} /> Kopiert</>
                  : <><Copy className="w-3.5 h-3.5" strokeWidth={1.75} /> Kopieren</>
                }
              </button>
            </div>

            {/* Footer hint */}
            <p className="text-[11px] text-[#C4B9B0] text-center pb-1">
              Teile diesen Link mit deinen direkten Partnern.
            </p>

          </div>
        </div>
      )}
    </>
  )
}
