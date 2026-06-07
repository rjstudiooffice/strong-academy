import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const DEMO_USERS: Record<string, { email: string; password: string }> = {
  hannes: { email: "hannes@demo.local", password: "StrongAcademy2026!" },
  thomas: { email: "thomas@demo.local", password: "StrongAcademy2026!" },
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const user = DEMO_USERS[slug]

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(user)

  if (error) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.redirect(new URL("/", request.url))
}
