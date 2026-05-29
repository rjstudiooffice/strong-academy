"use client"

import { useActionState } from "react"
import Link from "next/link"
import Image from "next/image"
import { register } from "@/lib/supabase/actions"

export function RegisterForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(register, null)

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">

        <div className="flex items-center gap-2.5 mb-10">
          <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0">
            <Image src="/logo.png" alt="Strong Academy" width={32} height={32} className="w-full h-full object-cover" />
          </div>
          <span className="text-[14px] font-semibold text-[#1A1714]">Strong Academy</span>
        </div>

        <div className="bg-[#F5F0E8] border border-[#E8E2D9] rounded-xl px-4 py-3 mb-8">
          <p className="text-[12px] text-[#6B5E52] leading-relaxed">
            Du wurdest persönlich eingeladen. Erstelle jetzt dein Konto.
          </p>
        </div>

        <div className="mb-7">
          <h1 className="text-[1.75rem] font-semibold text-[#1A1714] tracking-tight leading-tight">
            Konto erstellen.
          </h1>
          <p className="mt-2 text-[14px] text-[#9E9188] leading-relaxed">
            Wenige Angaben — dann kannst du direkt starten.
          </p>
        </div>

        {state?.error && (
          <div className="mb-4 px-4 py-3 bg-[#FDF2F0] border border-[#E8C4BC] rounded-xl text-[13px] text-[#8A4A3C]">
            {state.error}
          </div>
        )}

        <form action={action} className="space-y-3">
          <input type="hidden" name="token" value={token} />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-1.5">
                Vorname
              </label>
              <input
                type="text"
                name="firstName"
                autoComplete="given-name"
                placeholder="Lea"
                required
                className="w-full px-4 py-3 text-[14px] bg-[#F5F0E8] border border-[#E8E2D9] rounded-xl text-[#1A1714] placeholder:text-[#C4B9B0] focus:outline-none focus:ring-2 focus:ring-[#5B2D8E]/15 focus:border-[#5B2D8E]/30 transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-1.5">
                Nachname
              </label>
              <input
                type="text"
                name="lastName"
                autoComplete="family-name"
                placeholder="Fischer"
                required
                className="w-full px-4 py-3 text-[14px] bg-[#F5F0E8] border border-[#E8E2D9] rounded-xl text-[#1A1714] placeholder:text-[#C4B9B0] focus:outline-none focus:ring-2 focus:ring-[#5B2D8E]/15 focus:border-[#5B2D8E]/30 transition-all"
              />
            </div>
          </div>

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
            <label className="block text-[11px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-1.5">
              Passwort
            </label>
            <input
              type="password"
              name="password"
              autoComplete="new-password"
              placeholder="Mindestens 8 Zeichen"
              required
              minLength={8}
              className="w-full px-4 py-3 text-[14px] bg-[#F5F0E8] border border-[#E8E2D9] rounded-xl text-[#1A1714] placeholder:text-[#C4B9B0] focus:outline-none focus:ring-2 focus:ring-[#5B2D8E]/15 focus:border-[#5B2D8E]/30 transition-all"
            />
          </div>

          {/* Consent checkboxes */}
          <div className="pt-1 space-y-3">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                name="privacy_accepted"
                required
                className="mt-0.5 w-4 h-4 shrink-0 rounded border-[#C4B9B0] text-[#5B2D8E] focus:ring-[#5B2D8E]/20 cursor-pointer"
              />
              <span className="text-[12px] text-[#6B5E52] leading-relaxed">
                Ich habe die{" "}
                <Link
                  href="/datenschutz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#5B2D8E] hover:text-[#4A2478] font-medium transition-colors underline-offset-2 hover:underline"
                >
                  Datenschutzerklärung
                </Link>
                {" "}gelesen und akzeptiere sie.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                name="terms_accepted"
                required
                className="mt-0.5 w-4 h-4 shrink-0 rounded border-[#C4B9B0] text-[#5B2D8E] focus:ring-[#5B2D8E]/20 cursor-pointer"
              />
              <span className="text-[12px] text-[#6B5E52] leading-relaxed">
                Ich akzeptiere die{" "}
                <Link
                  href="/agb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#5B2D8E] hover:text-[#4A2478] font-medium transition-colors underline-offset-2 hover:underline"
                >
                  Nutzungsbedingungen
                </Link>
                .
              </span>
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={pending}
              className="w-full py-3 bg-[#5B2D8E] text-white text-[14px] font-medium rounded-xl hover:bg-[#4A2478] transition-colors disabled:opacity-60"
            >
              {pending ? "Konto wird erstellt …" : "Konto erstellen"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-[12px] text-[#B8AFA7]">
          Bereits registriert?{" "}
          <Link href="/login" className="text-[#5B2D8E] hover:text-[#4A2478] font-medium transition-colors">
            Anmelden
          </Link>
        </p>

      </div>
    </div>
  )
}
