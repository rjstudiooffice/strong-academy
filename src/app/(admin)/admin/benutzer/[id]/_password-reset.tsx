"use client"

import { useTransition, useState } from "react"
import { generatePasswordResetLink } from "@/lib/supabase/admin-mutations"

export function PasswordResetCard({ email }: { email: string }) {
  const [pending, startTransition] = useTransition()
  const [link,    setLink]    = useState<string | null>(null)
  const [error,   setError]   = useState<string | null>(null)
  const [copied,  setCopied]  = useState(false)

  function handleGenerate() {
    startTransition(async () => {
      const result = await generatePasswordResetLink(email)
      if (result.error) {
        setError(result.error)
      } else if (result.link) {
        setLink(result.link)
        setError(null)
      }
    })
  }

  function handleCopy() {
    if (!link) return
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 space-y-4">
      <div>
        <p className="text-[13px] font-semibold text-[#1A1714]">Passwort zurücksetzen</p>
        <p className="text-[12px] text-[#9E9188] mt-1">
          Generiert einen einmaligen Reset-Link. Schicke ihn direkt an den Nutzer.
        </p>
      </div>

      {!link ? (
        <button
          onClick={handleGenerate}
          disabled={pending}
          className="px-5 py-2.5 bg-[#5B2D8E] text-white rounded-xl text-[13px] font-medium hover:bg-[#4A2478] transition-colors disabled:opacity-60"
        >
          {pending ? "Wird generiert …" : "Reset-Link generieren"}
        </button>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={link}
              readOnly
              className="flex-1 min-w-0 px-3 py-2.5 text-[11px] bg-[#FAF9F6] border border-[#E8E2D9] rounded-xl text-[#6B5E52] font-mono truncate focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 border border-[#E8E2D9] text-[#6B5E52] rounded-xl text-[13px] font-medium hover:bg-[#F5F0E8] transition-colors shrink-0"
            >
              {copied ? "Kopiert ✓" : "Kopieren"}
            </button>
          </div>
          <p className="text-[11px] text-[#B8AFA7]">
            Gültig für 24 Stunden · Einmalig verwendbar.
          </p>
          <button
            onClick={() => { setLink(null); setCopied(false) }}
            className="text-[11px] text-[#9E9188] hover:text-[#1A1714] transition-colors"
          >
            Neuen Link generieren
          </button>
        </div>
      )}

      {error && (
        <p className="text-[12px] text-[#C4574A]">{error}</p>
      )}
    </div>
  )
}
