"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"

export function InvitationCopyButton({ token }: { token: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    const url = `${window.location.origin}/registrieren?token=${token}`
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const el = document.createElement("textarea")
      el.value = url
      document.body.appendChild(el)
      el.select()
      document.execCommand("copy")
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E8E2D9] text-[12px] transition-colors hover:bg-[#F5F0E8]"
      style={{ color: copied ? "#3A7A5C" : "#6B5E52" }}
    >
      {copied
        ? <><Check className="w-3 h-3" strokeWidth={2.5} /> Kopiert</>
        : <><Copy className="w-3 h-3" strokeWidth={1.75} /> Link kopieren</>
      }
    </button>
  )
}
