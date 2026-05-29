import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { validateToken } from "@/lib/supabase/invitations"

function BrandMark() {
  return (
    <div className="flex items-center gap-2.5 mb-12">
      <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0">
        <Image src="/logo.png" alt="Strong Academy" width={32} height={32} className="w-full h-full object-cover" />
      </div>
      <span className="text-[14px] font-semibold text-[#1A1714]">Strong Academy</span>
    </div>
  )
}

export default async function EinladungPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams

  if (!token) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm text-center">
          <BrandMark />
          <div className="bg-[#F5F0E8] border border-[#E8E2D9] rounded-2xl px-8 py-10 mb-6">
            <h1 className="text-[1.5rem] font-semibold text-[#1A1714] tracking-tight mb-3">
              Diese Seite ist nicht zugänglich.
            </h1>
            <p className="text-[14px] text-[#9E9188] leading-relaxed">
              Die Strong Academy ist eine geschlossene Plattform. Du kommst nur über einen persönlichen Einladungslink rein.
            </p>
          </div>
          <p className="text-[12px] text-[#B8AFA7]">
            Bereits ein Konto?{" "}
            <Link href="/login" className="text-[#5B2D8E] hover:text-[#4A2478] font-medium transition-colors">
              Anmelden
            </Link>
          </p>
        </div>
      </div>
    )
  }

  const result = await validateToken(token)

  if (!result.valid) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm text-center">
          <BrandMark />
          <div className="bg-[#F5F0E8] border border-[#E8E2D9] rounded-2xl px-8 py-10 mb-6">
            <h1 className="text-[1.5rem] font-semibold text-[#1A1714] tracking-tight mb-3">
              Einladung ungültig.
            </h1>
            <p className="text-[14px] text-[#9E9188] leading-relaxed">
              {result.reason}
            </p>
          </div>
          <p className="text-[12px] text-[#B8AFA7]">
            Bereits ein Konto?{" "}
            <Link href="/login" className="text-[#5B2D8E] hover:text-[#4A2478] font-medium transition-colors">
              Anmelden
            </Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">

        <BrandMark />

        <div className="bg-[#F5F0E8] border border-[#E8E2D9] rounded-2xl px-8 py-10 mb-8 text-center">
          <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-4">
            Persönliche Einladung
          </p>
          <h1 className="text-[2rem] font-semibold text-[#1A1714] tracking-tight leading-tight mb-4">
            Du wurdest eingeladen.
          </h1>
          <p className="text-[14px] text-[#8C7E6F] leading-relaxed max-w-xs mx-auto">
            Die Strong Academy ist eine kuratierte Lernplattform für Gesundheit, Wissen und persönliches Wachstum.
          </p>
        </div>

        <div className="space-y-3 mb-8">
          {[
            "Lernpfade zu Mineralien, Zellgesundheit und Ernährung",
            "Praxiswissen für dein Business und dein Wohlbefinden",
            "Eine ruhige, fokussierte Lernumgebung",
          ].map((point) => (
            <div key={point} className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5B2D8E]/40 shrink-0 mt-1.5" />
              <p className="text-[13px] text-[#6B5E52] leading-relaxed">{point}</p>
            </div>
          ))}
        </div>

        <Link
          href={`/registrieren?token=${token}`}
          className="flex items-center justify-center gap-2.5 w-full py-3.5 bg-[#5B2D8E] text-white text-[14px] font-medium rounded-xl hover:bg-[#4A2478] transition-colors"
        >
          Konto erstellen <ArrowRight className="w-4 h-4" strokeWidth={2} />
        </Link>

        <p className="mt-5 text-center text-[12px] text-[#B8AFA7]">
          Bereits registriert?{" "}
          <Link href="/login" className="text-[#5B2D8E] hover:text-[#4A2478] font-medium transition-colors">
            Anmelden
          </Link>
        </p>

      </div>
    </div>
  )
}
