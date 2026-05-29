import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

export default function DatenschutzPage() {
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
          Datenschutzerklärung
        </h1>
        <p className="text-[13px] text-[#9E9188]">Stand: Mai 2026</p>
      </div>

      <div className="space-y-10 text-[14px] text-[#6B5E52] leading-relaxed">

        <p>
          Willkommen bei der Strong Academy. Der Schutz Ihrer persönlichen Daten ist uns wichtig. Wir verarbeiten personenbezogene Daten ausschließlich im Rahmen der gesetzlichen Bestimmungen und nur soweit dies für die Nutzung der Plattform erforderlich ist.
        </p>

        <section>
          <h2 className="text-[16px] font-semibold text-[#1A1714] mb-4">Erhobene Daten</h2>
          <ul className="space-y-2">
            {["Name", "E-Mail-Adresse", "Profildaten", "Lernfortschritte innerhalb der Plattform", "Teamzugehörigkeiten und Einladungsinformationen"].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span className="w-1 h-1 rounded-full bg-[#C4B9B0] shrink-0 mt-[0.5em]" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-[16px] font-semibold text-[#1A1714] mb-4">Zweck der Verarbeitung</h2>
          <ul className="space-y-2">
            {[
              "Bereitstellung der Lernplattform",
              "Verwaltung von Benutzerkonten",
              "Speicherung von Lernfortschritten",
              "Verwaltung von Team- und Einladungsfunktionen",
              "Technische Sicherheit und Stabilität der Plattform",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span className="w-1 h-1 rounded-full bg-[#C4B9B0] shrink-0 mt-[0.5em]" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-[16px] font-semibold text-[#1A1714] mb-4">Speicherung</h2>
          <p>Die Daten werden auf sicheren Systemen gespeichert und nur solange verarbeitet, wie dies für den Betrieb der Plattform erforderlich ist.</p>
        </section>

        <section>
          <h2 className="text-[16px] font-semibold text-[#1A1714] mb-4">Weitergabe</h2>
          <p>Eine Weitergabe personenbezogener Daten erfolgt nicht, außer wenn dies gesetzlich vorgeschrieben ist oder zur technischen Bereitstellung der Plattform notwendig ist.</p>
        </section>

        <section>
          <h2 className="text-[16px] font-semibold text-[#1A1714] mb-4">Ihre Rechte</h2>
          <p className="mb-3">Sie haben jederzeit das Recht auf:</p>
          <ul className="space-y-2">
            {["Auskunft", "Berichtigung", "Löschung", "Einschränkung der Verarbeitung", "Datenübertragbarkeit"].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span className="w-1 h-1 rounded-full bg-[#C4B9B0] shrink-0 mt-[0.5em]" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-[16px] font-semibold text-[#1A1714] mb-4">Kontakt</h2>
          <p>Bei Fragen zum Datenschutz kontaktieren Sie bitte den Betreiber der Plattform.</p>
        </section>

      </div>
    </div>
  )
}
