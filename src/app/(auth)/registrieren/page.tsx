import Link from "next/link"
import Image from "next/image"
import { validateToken } from "@/lib/supabase/invitations"
import { RegisterForm } from "./_form"

function BrandMark() {
  return (
    <div className="flex items-center gap-2.5 mb-10">
      <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0">
        <Image src="/logo.png" alt="Strong Academy" width={32} height={32} className="w-full h-full object-cover" />
      </div>
      <span className="text-[14px] font-semibold text-[#1A1714]">Strong Academy</span>
    </div>
  )
}

export default async function RegistrierenPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams

  if (!token) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm text-center space-y-5">
          <BrandMark />
          <h1 className="text-[1.5rem] font-semibold text-[#1A1714] tracking-tight">
            Nur auf Einladung.
          </h1>
          <p className="text-[14px] text-[#9E9188] leading-relaxed max-w-xs mx-auto">
            Die Strong Academy ist eine geschlossene Lernplattform. Bitte wende dich an die Person, die dich eingeladen hat.
          </p>
          <Link href="/login" className="inline-block text-[13px] text-[#5B2D8E] hover:text-[#4A2478] font-medium transition-colors">
            Bereits registriert? Anmelden →
          </Link>
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
          <div className="bg-[#F5F0E8] border border-[#E8E2D9] rounded-2xl px-8 py-8 mb-6">
            <h1 className="text-[1.4rem] font-semibold text-[#1A1714] tracking-tight mb-3">
              Einladung ungültig.
            </h1>
            <p className="text-[14px] text-[#9E9188] leading-relaxed">
              {result.reason}
            </p>
          </div>
          <Link href="/login" className="text-[13px] text-[#5B2D8E] hover:text-[#4A2478] font-medium transition-colors">
            Bereits registriert? Anmelden →
          </Link>
        </div>
      </div>
    )
  }

  return <RegisterForm token={token} />
}
