"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"

export default function PasswortNeuPage() {
  const [password,  setPassword]  = useState("")
  const [confirm,   setConfirm]   = useState("")
  const [error,     setError]     = useState<string | null>(null)
  const [pending,   setPending]   = useState(false)
  const [done,      setDone]      = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError("Das Passwort muss mindestens 8 Zeichen lang sein.")
      return
    }
    if (password !== confirm) {
      setError("Die Passwörter stimmen nicht überein.")
      return
    }

    setPending(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      setPending(false)
    } else {
      setDone(true)
      setTimeout(() => router.push("/"), 1500)
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">

        <div className="flex items-center gap-2.5 mb-10">
          <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0">
            <Image src="/logo.png" alt="Strong Academy" width={32} height={32} className="w-full h-full object-cover" />
          </div>
          <span className="text-[14px] font-semibold text-[#1A1714]">Strong Academy</span>
        </div>

        <div className="mb-8">
          <h1 className="text-[1.75rem] font-semibold text-[#1A1714] tracking-tight leading-tight">
            Neues Passwort.
          </h1>
          <p className="mt-2 text-[14px] text-[#9E9188] leading-relaxed">
            Wähle ein sicheres Passwort mit mindestens 8 Zeichen.
          </p>
        </div>

        {done ? (
          <div className="px-4 py-3 bg-[#EDF3F0] border border-[#C0DACE] rounded-xl text-[13px] text-[#3A7A5C]">
            Passwort gespeichert. Du wirst weitergeleitet …
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 px-4 py-3 bg-[#FDF2F0] border border-[#E8C4BC] rounded-xl text-[13px] text-[#8A4A3C]">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-1.5">
                  Neues Passwort
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder="Mindestens 8 Zeichen"
                  required
                  className="w-full px-4 py-3 text-[14px] bg-[#F5F0E8] border border-[#E8E2D9] rounded-xl text-[#1A1714] placeholder:text-[#C4B9B0] focus:outline-none focus:ring-2 focus:ring-[#5B2D8E]/15 focus:border-[#5B2D8E]/30 transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-1.5">
                  Passwort wiederholen
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 text-[14px] bg-[#F5F0E8] border border-[#E8E2D9] rounded-xl text-[#1A1714] placeholder:text-[#C4B9B0] focus:outline-none focus:ring-2 focus:ring-[#5B2D8E]/15 focus:border-[#5B2D8E]/30 transition-all"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={pending}
                  className="w-full py-3 bg-[#5B2D8E] text-white text-[14px] font-medium rounded-xl hover:bg-[#4A2478] transition-colors disabled:opacity-60"
                >
                  {pending ? "Wird gespeichert …" : "Passwort speichern"}
                </button>
              </div>
            </form>
          </>
        )}

      </div>
    </div>
  )
}
