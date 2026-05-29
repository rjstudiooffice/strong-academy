import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

const SECTIONS = [
  {
    title: "1. Geltungsbereich",
    placeholder: "Informationen zum Anwendungsbereich dieser Nutzungsbedingungen und zur Plattform werden hier ergänzt.",
  },
  {
    title: "2. Registrierung und Zugangsberechtigung",
    placeholder: "Bedingungen für die Registrierung, Einladungspflicht und Kontoanforderungen werden hier ergänzt.",
  },
  {
    title: "3. Nutzungsrechte und Inhalte",
    placeholder: "Umfang der eingeräumten Nutzungsrechte an Plattforminhalten sowie Regelungen zu urheberrechtlich geschützten Materialien werden hier ergänzt.",
  },
  {
    title: "4. Pflichten der Nutzer",
    placeholder: "Verhaltensregeln, Verbote und Verantwortlichkeiten der Nutzer werden hier ergänzt.",
  },
  {
    title: "5. Kündigung und Zugangsbeendigung",
    placeholder: "Bedingungen für die Beendigung der Mitgliedschaft und Konsequenzen der Kündigung werden hier ergänzt.",
  },
  {
    title: "6. Haftungsausschluss",
    placeholder: "Haftungsbeschränkungen für Inhalte, technische Ausfälle und externe Links werden hier ergänzt.",
  },
  {
    title: "7. Änderungen der Nutzungsbedingungen",
    placeholder: "Verfahren zur Änderung dieser Bedingungen und Informationspflichten werden hier ergänzt.",
  },
  {
    title: "8. Anwendbares Recht",
    placeholder: "Anzuwendendes Recht und Gerichtsstand werden hier ergänzt.",
  },
]

export default function AGBPage() {
  return (
    <div className="flex-1 px-6 py-12 max-w-3xl mx-auto w-full">

      {/* Brand mark */}
      <div className="flex items-center gap-2.5 mb-10">
        <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0">
          <Image src="/logo.png" alt="Strong Academy" width={32} height={32} className="w-full h-full object-cover" />
        </div>
        <span className="text-[14px] font-semibold text-[#1A1714]">Strong Academy</span>
      </div>

      {/* Back */}
      <Link
        href="/registrieren"
        className="inline-flex items-center gap-1.5 text-[13px] text-[#9E9188] hover:text-[#1A1714] transition-colors mb-10"
      >
        <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
        Zurück
      </Link>

      {/* Header */}
      <div className="mb-10 pb-8 border-b border-[#E8E2D9]">
        <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-4">
          Rechtliches
        </p>
        <h1 className="text-[2rem] sm:text-[2.5rem] font-semibold text-[#1A1714] tracking-tight leading-tight mb-4">
          Nutzungsbedingungen
        </h1>
        <div className="inline-flex items-center gap-2 bg-[#F5F0E8] border border-[#E8E2D9] rounded-lg px-3 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C4B9B0] shrink-0" />
          <p className="text-[12px] text-[#9E9188]">Stand: wird ergänzt</p>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-10">
        {SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className="text-[16px] font-semibold text-[#1A1714] mb-4">
              {section.title}
            </h2>
            <div className="bg-[#F5F0E8] border border-[#E8E2D9] rounded-xl px-5 py-4">
              <p className="text-[13px] text-[#B8AFA7] leading-relaxed italic">
                {section.placeholder}
              </p>
            </div>
          </section>
        ))}
      </div>

    </div>
  )
}
