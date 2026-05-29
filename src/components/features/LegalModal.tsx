"use client"

import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"

// ─── Content ─────────────────────────────────────────────────────────────────

const DATENSCHUTZ = {
  title: "Datenschutzerklärung",
  stand: "Mai 2026",
  sections: [
    {
      heading: null,
      body: "Willkommen bei der Strong Academy.\n\nDer Schutz Ihrer persönlichen Daten ist uns wichtig. Wir verarbeiten personenbezogene Daten ausschließlich im Rahmen der gesetzlichen Bestimmungen und nur soweit dies für die Nutzung der Plattform erforderlich ist.",
    },
    {
      heading: "Erhobene Daten",
      items: [
        "Name",
        "E-Mail-Adresse",
        "Profildaten",
        "Lernfortschritte innerhalb der Plattform",
        "Teamzugehörigkeiten und Einladungsinformationen",
      ],
    },
    {
      heading: "Zweck der Verarbeitung",
      items: [
        "Bereitstellung der Lernplattform",
        "Verwaltung von Benutzerkonten",
        "Speicherung von Lernfortschritten",
        "Verwaltung von Team- und Einladungsfunktionen",
        "Technische Sicherheit und Stabilität der Plattform",
      ],
    },
    {
      heading: "Speicherung",
      body: "Die Daten werden auf sicheren Systemen gespeichert und nur solange verarbeitet, wie dies für den Betrieb der Plattform erforderlich ist.",
    },
    {
      heading: "Weitergabe",
      body: "Eine Weitergabe personenbezogener Daten erfolgt nicht, außer wenn dies gesetzlich vorgeschrieben ist oder zur technischen Bereitstellung der Plattform notwendig ist.",
    },
    {
      heading: "Ihre Rechte",
      body: "Sie haben jederzeit das Recht auf:",
      items: [
        "Auskunft",
        "Berichtigung",
        "Löschung",
        "Einschränkung der Verarbeitung",
        "Datenübertragbarkeit",
      ],
    },
    {
      heading: "Kontakt",
      body: "Bei Fragen zum Datenschutz kontaktieren Sie bitte den Betreiber der Plattform.",
    },
  ],
}

const AGB = {
  title: "Nutzungsbedingungen",
  stand: "Mai 2026",
  sections: [
    {
      heading: null,
      body: "Willkommen bei der Strong Academy.\n\nMit der Registrierung und Nutzung der Plattform stimmen Sie den folgenden Nutzungsbedingungen zu.",
    },
    {
      heading: "1. Nutzung der Plattform",
      body: "Die Strong Academy dient der Bereitstellung von Schulungs-, Lern- und Informationsinhalten.",
    },
    {
      heading: "2. Benutzerkonto",
      body: "Jeder Nutzer ist für die Sicherheit seiner Zugangsdaten selbst verantwortlich.",
    },
    {
      heading: "3. Inhalte",
      body: "Alle bereitgestellten Inhalte sind ausschließlich für registrierte Nutzer bestimmt.\n\nDie Weitergabe, Vervielfältigung oder öffentliche Verbreitung von Inhalten ohne ausdrückliche Genehmigung ist nicht gestattet.",
    },
    {
      heading: "4. Lernfortschritt",
      body: "Die Plattform speichert Lernfortschritte, um Funktionen und Freischaltungen innerhalb des Systems bereitzustellen.",
    },
    {
      heading: "5. Teamfunktionen",
      body: "Einladungs- und Teamfunktionen dienen ausschließlich der internen Organisation innerhalb der Plattform.",
    },
    {
      heading: "6. Verfügbarkeit",
      body: "Wir bemühen uns um eine möglichst unterbrechungsfreie Verfügbarkeit der Plattform, können jedoch keine permanente Erreichbarkeit garantieren.",
    },
    {
      heading: "7. Änderungen",
      body: "Wir behalten uns vor, Inhalte, Funktionen und diese Nutzungsbedingungen jederzeit anzupassen.",
    },
    {
      heading: "8. Haftung",
      body: "Die Nutzung der Plattform erfolgt auf eigene Verantwortung. Eine Haftung für technische Ausfälle oder Datenverluste wird im gesetzlich zulässigen Umfang ausgeschlossen.",
    },
  ],
}

// ─── Types ────────────────────────────────────────────────────────────────────

type ModalType = "datenschutz" | "agb"

type Section = {
  heading?: string | null
  body?: string
  items?: string[]
}

// ─── Section renderer ─────────────────────────────────────────────────────────

function Section({ section }: { section: Section }) {
  return (
    <div className="space-y-3">
      {section.heading && (
        <h3 className="text-[14px] font-semibold text-[#1A1714]">{section.heading}</h3>
      )}
      {section.body && section.body.split("\n\n").map((para, i) => (
        <p key={i} className="text-[13px] text-[#6B5E52] leading-relaxed">{para}</p>
      ))}
      {section.items && (
        <ul className="space-y-1.5 pl-0">
          {section.items.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-[13px] text-[#6B5E52] leading-relaxed">
              <span className="w-1 h-1 rounded-full bg-[#C4B9B0] shrink-0 mt-[0.45em]" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────

interface LegalModalProps {
  type:    ModalType
  onClose: () => void
}

export function LegalModal({ type, onClose }: LegalModalProps) {
  const content    = type === "datenschutz" ? DATENSCHUTZ : AGB
  const closeRef   = useRef<HTMLButtonElement>(null)
  const scrollRef  = useRef<HTMLDivElement>(null)

  // Focus close button on mount
  useEffect(() => {
    const t = setTimeout(() => closeRef.current?.focus(), 50)
    document.body.style.overflow = "hidden"
    return () => {
      clearTimeout(t)
      document.body.style.overflow = ""
    }
  }, [])

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose])

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={content.title}
      className="fixed inset-0 z-[9999] flex items-end sm:items-center sm:justify-center"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1A1714]/30 backdrop-blur-[6px]"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="
          relative w-full sm:max-w-[560px] sm:mx-5
          bg-[#FAF9F6]
          rounded-t-[20px] sm:rounded-[20px]
          border border-[#E8E2D9]
          shadow-[0_-4px_48px_rgba(26,23,20,0.12),_0_0_0_1px_rgba(26,23,20,0.04)]
          sm:shadow-[0_8px_64px_rgba(26,23,20,0.16),_0_2px_12px_rgba(26,23,20,0.06)]
          flex flex-col
          max-h-[88dvh] sm:max-h-[82dvh]
          z-10
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle — mobile only */}
        <div className="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-[#E8E2D9]" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 pt-4 sm:pt-6 pb-4 border-b border-[#E8E2D9] shrink-0">
          <div>
            <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-1">
              Rechtliches
            </p>
            <h2 className="text-[1.2rem] sm:text-[1.35rem] font-semibold text-[#1A1714] tracking-tight leading-tight">
              {content.title}
            </h2>
            <p className="text-[11px] text-[#B8AFA7] mt-1">Stand: {content.stand}</p>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            className="
              shrink-0 w-8 h-8 rounded-xl mt-0.5
              bg-[#F5F0E8] hover:bg-[#EDE8DF]
              flex items-center justify-center
              transition-colors focus:outline-none focus:ring-2 focus:ring-[#5B2D8E]/20
            "
          >
            <X className="w-3.5 h-3.5 text-[#9E9188]" strokeWidth={2} />
          </button>
        </div>

        {/* Scrollable body */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-6 py-6 space-y-6 overscroll-contain"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {content.sections.map((section, i) => (
            <Section key={i} section={section} />
          ))}

          {/* Bottom spacing for mobile safe area */}
          <div className="h-2 sm:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }} />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E8E2D9] shrink-0" style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#1A1714] text-white text-[13px] font-medium rounded-xl hover:bg-[#2C2820] transition-colors"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
