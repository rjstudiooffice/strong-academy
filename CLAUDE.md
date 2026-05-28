# Strong Academy — Claude Context

## Vision
Premium mobile-first Lernplattform für Zinzino-Partner. Editorial, ruhig, hochwertig — kein SaaS-Dashboard, kein MLM-Backoffice.

## Stack
Next.js App Router · Tailwind · shadcn/ui · TypeScript · Vercel

## Design DNA
- Canvas `#FAF9F6`, Surface `#F5F0E8`, Border `#E8E2D9`
- Accent `#5B2D8E` (purple), Text primary `#1A1714`
- Viel Weißraum · ruhige Typography · minimale Interaktionen · mobile-first

## Architektur
```
src/
  app/(app)/          # geschützte Seiten (Sidebar + MobileNav)
  app/(auth)/         # Login, Registrieren, Einladung
  components/
    layout/           # AppShell, Sidebar, Header, MobileNav, NavIcon
    features/         # MediaCover, InviteButton, CurrentDate
    ui/               # shadcn-Komponenten
  lib/
    data/             # academy.ts, leadership.ts, team.ts, resources.ts, user.ts
    nav.ts            # navItems array (shared Sidebar + MobileNav)
    utils.ts
```

## Coding Rules
- Keine unnötigen Abstraktionen — drei ähnliche Zeilen > Abstraktion
- Kein Error-Handling für Fälle die nicht eintreten können
- Keine Kommentare außer für nicht-offensichtliches "Warum"
- Mock-Daten in `lib/data/*.ts` — alle mit TODO-Kommentar für Supabase-Integration
- AppShell liest `showTeam` und `leadershipUnlocked` server-side, gibt sie als Props weiter

## Produkt-Regeln
- Keine sichtbaren Rollen — jeder ist Partner
- Leadership: eigener Bereich, locked bis 75% Gesamtfortschritt
- „Mein Team" erscheint nur wenn `hasTeamMembers()` true
- Alle Lektionen zugänglich — Fortschritt nur bei echtem Video-Konsum
- Keine Gamification, keine Quizze, keine KPIs

## No-Go's
- Kein LMS-Template-Feel
- Keine Enterprise-Strukturen
- Keine großen Refactors ohne klaren Grund
- Nicht beide Navigationen (Sidebar + MobileNav) separat pflegen — `nav.ts` ist Single Source
