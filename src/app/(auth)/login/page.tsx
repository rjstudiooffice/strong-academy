"use client"

import { useActionState, useState } from "react"
import Image from "next/image"
import { login } from "@/lib/supabase/actions"
import { createClient } from "@/lib/supabase/client"

// ── Forgot-password view ───────────────────────────────────────────────────────

function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const [email,   setEmail]   = useState("")
  const [pending, setPending] = useState(false)
  const [done,    setDone]    = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    setError(null)

    const supabase = createClient()
    const redirectTo = `${window.location.origin}/passwort-neu`

    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })

    if (error) {
      setError(error.message)
      setPending(false)
    } else {
      setDone(true)
    }
  }

  if (done) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-[1.75rem] font-semibold text-[#1A1714] tracking-tight leading-tight">
            E-Mail gesendet.
          </h1>
          <p className="mt-2 text-[14px] text-[#9E9188] leading-relaxed">
            Prüfe dein Postfach und klicke auf den Link um ein neues Passwort zu setzen.
          </p>
        </div>
        <p className="text-[12px] text-[#B8AFA7]">
          Kein E-Mail erhalten?{" "}
          <button
            onClick={() => { setDone(false); setEmail("") }}
            className="text-[#9E9188] hover:text-[#5B2D8E] transition-colors"
          >
            Erneut senden
          </button>
        </p>
        <button
          onClick={onBack}
          className="text-[13px] text-[#9E9188] hover:text-[#1A1714] transition-colors"
        >
          ← Zurück zur Anmeldung
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[1.75rem] font-semibold text-[#1A1714] tracking-tight leading-tight">
          Passwort vergessen?
        </h1>
        <p className="mt-2 text-[14px] text-[#9E9188] leading-relaxed">
          Gib deine E-Mail-Adresse ein. Wir schicken dir einen Link zum Zurücksetzen.
        </p>
      </div>

      {error && (
        <div className="px-4 py-3 bg-[#FDF2F0] border border-[#E8C4BC] rounded-xl text-[13px] text-[#8A4A3C]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-[11px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-1.5">
            E-Mail
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="deine@email.de"
            required
            className="w-full px-4 py-3 text-[14px] bg-[#F5F0E8] border border-[#E8E2D9] rounded-xl text-[#1A1714] placeholder:text-[#C4B9B0] focus:outline-none focus:ring-2 focus:ring-[#5B2D8E]/15 focus:border-[#5B2D8E]/30 transition-all"
          />
        </div>

        <div className="pt-2 space-y-3">
          <button
            type="submit"
            disabled={pending}
            className="w-full py-3 bg-[#5B2D8E] text-white text-[14px] font-medium rounded-xl hover:bg-[#4A2478] transition-colors disabled:opacity-60"
          >
            {pending ? "Wird gesendet …" : "Link senden"}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="w-full py-3 text-[14px] text-[#9E9188] hover:text-[#1A1714] transition-colors"
          >
            Zurück zur Anmeldung
          </button>
        </div>
      </form>
    </div>
  )
}

// ── Login view ─────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, null)
  const [showForgot, setShowForgot] = useState(false)

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">

        <div className="flex items-center gap-2.5 mb-10">
          <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0">
            <Image src="/logo.png" alt="Strong Academy" width={32} height={32} className="w-full h-full object-cover" />
          </div>
          <span className="text-[14px] font-semibold text-[#1A1714]">Strong Academy</span>
        </div>

        {showForgot ? (
          <ForgotPasswordForm onBack={() => setShowForgot(false)} />
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-[1.75rem] font-semibold text-[#1A1714] tracking-tight leading-tight">
                Willkommen zurück.
              </h1>
              <p className="mt-2 text-[14px] text-[#9E9188] leading-relaxed">
                Melde dich an, um weiterzulernen.
              </p>
            </div>

            {state?.error && (
              <div className="mb-4 px-4 py-3 bg-[#FDF2F0] border border-[#E8C4BC] rounded-xl text-[13px] text-[#8A4A3C]">
                {state.error}
              </div>
            )}

            <form action={action} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-1.5">
                  E-Mail
                </label>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="deine@email.de"
                  required
                  className="w-full px-4 py-3 text-[14px] bg-[#F5F0E8] border border-[#E8E2D9] rounded-xl text-[#1A1714] placeholder:text-[#C4B9B0] focus:outline-none focus:ring-2 focus:ring-[#5B2D8E]/15 focus:border-[#5B2D8E]/30 transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-semibold text-[#B8AFA7] uppercase tracking-widest">
                    Passwort
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgot(true)}
                    className="text-[11px] text-[#9E9188] hover:text-[#5B2D8E] transition-colors"
                  >
                    Vergessen?
                  </button>
                </div>
                <input
                  type="password"
                  name="password"
                  autoComplete="current-password"
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
                  {pending ? "Anmelden …" : "Anmelden"}
                </button>
              </div>
            </form>

            <p className="mt-8 text-center text-[12px] text-[#B8AFA7] leading-relaxed">
              Noch kein Konto?{" "}
              <span className="text-[#9E9188]">
                Die Plattform ist nur auf persönliche Einladung zugänglich.
              </span>
            </p>
          </>
        )}

      </div>
    </div>
  )
}
