import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Showcase-Zugang für Demo-Präsentationen.
// Loggt automatisch als Demo-Account ein und leitet zur Startseite weiter.
//
// DEAKTIVIEREN: Diese Datei löschen oder die Umgebungsvariable
// PREVIEW_ENABLED auf einen anderen Wert als "true" setzen.
// Demo-User entfernen: DELETE FROM auth.users WHERE email = 'hannes@demo.local';

const PREVIEW_ENABLED = process.env.PREVIEW_ENABLED !== "false"

export async function GET(request: NextRequest) {
  if (!PREVIEW_ENABLED) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email:    process.env.DEMO_EMAIL    ?? "hannes@demo.local",
    password: process.env.DEMO_PASSWORD ?? "StrongAcademy2026!",
  })

  if (error) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.redirect(new URL("/", request.url))
}
