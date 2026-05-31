"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"

// Handles both token flows Supabase may use:
// 1. Implicit: #access_token=...&refresh_token=...&type=recovery (hash, client-only)
// 2. PKCE:     ?code=xxx (query param, exchanged server- or client-side)
function PasswortNeuInner() {
  const [ready,   setReady]   = useState(false)
  const [invalid, setInvalid] = useState(false)
  const [password,  setPassword]  = useState("")
  const [confirm,   setConfirm]   = useState("")
  const [error,     setError]     = useState<string | null>(null)
  const [pending,   setPending]   = useState(false)
  const [done,      setDone]      = useState(false)

  const router      = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    async function init() {
      const supabase = createClient()

      // ── PKCE code flow (from /auth/callback redirect) ────────────────────
      const code = searchParams.get("code")
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) { setReady(true); return }
      }

      // ── Implicit flow: hash fragment #access_token=...&type=recovery ─────
      const hash = typeof window !== "undefined" ? window.location.hash : ""
      if (hash) {
        const params = new URLSearchParams(hash.slice(1))
        const accessToken  = params.get("access_token")
        const refreshToken = params.get("refresh_token")
        const type         = params.get("type")

        if (accessToken && refreshToken && type === "recovery") {
          const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
          if (!error) {
            window.history.replaceState(null, "", window.location.pathname)
            setReady(true)
            return
          }
        }
      }

      // ── Already authenticated (e.g. admin-generated link via /auth/callback)
      const { data: { user } } = await supabase.auth.getUser()
      if (user) { setReady(true); return }

      setInvalid(true)
    }

    init()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

        {invalid ? (
          <div className="space-y-4">
            <h1 className="text-[1.75rem] font-semibold text-[#1A1714] tracking-tight leading-tight">
              Link ungültig.
            </h1>
            <p className="text-[14px] text-[#9E9188]">
              Der Link ist abgelaufen oder wurde bereits verwendet.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="text-[13px] text-[#9E9188] hover:text-[#5B2D8E] transition-colors"
            >
              ← Zurück zur Anmeldung
            </button>
          </div>
        ) : !ready ? (
          <p className="text-[14px] text-[#9E9188]">Link wird geprüft …</p>
        ) : done ? (
          <div className="space-y-4">
            <h1 className="text-[1.75rem] font-semibold text-[#1A1714] tracking-tight leading-tight">
              Passwort gespeichert.
            </h1>
            <p className="text-[14px] text-[#9E9188]">Du wirst weitergeleitet …</p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-[1.75rem] font-semibold text-[#1A1714] tracking-tight leading-tight">
                Neues Passwort.
              </h1>
              <p className="mt-2 text-[14px] text-[#9E9188] leading-relaxed">
                Wähle ein sicheres Passwort mit mindestens 8 Zeichen.
              </p>
            </div>

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

export default function PasswortNeuPage() {
  return (
    <Suspense>
      <PasswortNeuInner />
    </Suspense>
  )
}
