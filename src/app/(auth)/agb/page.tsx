import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

const SECTIONS = [
  {
    title: "1. Nutzung der Plattform",
    text:  "Die Strong Academy dient der Bereitstellung von Schulungs-, Lern- und Informationsinhalten.",
  },
  {
    title: "2. Benutzerkonto",
    text:  "Jeder Nutzer ist für die Sicherheit seiner Zugangsdaten selbst verantwortlich.",
  },
  {
    title: "3. Inhalte",
    text:  "Alle bereitgestellten Inhalte sind ausschließlich für registrierte Nutzer bestimmt. Die Weitergabe, Vervielfältigung oder öffentliche Verbreitung von Inhalten ohne ausdrückliche Genehmigung ist nicht gestattet.",
  },
  {
    title: "4. Lernfortschritt",
    text:  "Die Plattform speichert Lernfortschritte, um Funktionen und Freischaltungen innerhalb des Systems bereitzustellen.",
  },
  {
    title: "5. Teamfunktionen",
    text:  "Einladungs- und Teamfunktionen dienen ausschließlich der internen Organisation innerhalb der Plattform.",
  },
  {
    title: "6. Verfügbarkeit",
    text:  "Wir bemühen uns um eine möglichst unterbrechungsfreie Verfügbarkeit der Plattform, können jedoch keine permanente Erreichbarkeit garantieren.",
  },
  {
    title: "7. Änderungen",
    text:  "Wir behalten uns vor, Inhalte, Funktionen und diese Nutzungsbedingungen jederzeit anzupassen.",
  },
  {
    title: "8. Haftung",
    text:  "Die Nutzung der Plattform erfolgt auf eigene Verantwortung. Eine Haftung für technische Ausfälle oder Datenverluste wird im gesetzlich zulässigen Umfang ausgeschlossen.",
  },
]

export default function AGBPage() {
  return (
    <div className="flex-1 px-6 py-12 max-w-3xl mx-auto w-full">

      <div className="flex items-center gap-2.5 mb-10">
        <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0">
          <Image src="/logo.png" alt="Strong Academy" width={32} height={32} className="w-full h-full object-cover" />
        </div>
        <span className="text-[14px] font-semibold text-[#1A1714]">Strong Academy</span>
      </div>

      <Link
        href="/registrieren"
        className="inline-flex items-center gap-1.5 text-[13px] text-[#9E9188] hover:text-[#1A1714] transition-colors mb-10"
      >
        <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
        Zurück
      </Link>

      <div className="mb-10 pb-8 border-b border-[#E8E2D9]">
        <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-4">Rechtliches</p>
        <h1 className="text-[2rem] sm:text-[2.5rem] font-semibold text-[#1A1714] tracking-tight leading-tight mb-4">
          Nutzungsbedingungen
        </h1>
        <p className="text-[13px] text-[#9E9188]">Stand: Mai 2026</p>
      </div>

      <div className="space-y-10 text-[14px] text-[#6B5E52] leading-relaxed">

        <p>
          Willkommen bei der Strong Academy. Mit der Registrierung und Nutzung der Plattform stimmen Sie den folgenden Nutzungsbedingungen zu.
        </p>

        {SECTIONS.map((s) => (
          <section key={s.title}>
            <h2 className="text-[16px] font-semibold text-[#1A1714] mb-4">{s.title}</h2>
            <p>{s.text}</p>
          </section>
        ))}

      </div>
    </div>
  )
}
