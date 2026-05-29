import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { listVideos } from "@/lib/bunny"

async function isAdmin(): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()
  return profile?.role === "admin"
}

export async function GET(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const prefix = req.nextUrl.searchParams.get("prefix") ?? undefined
  const videos = await listVideos(prefix)
  return NextResponse.json(videos)
}
