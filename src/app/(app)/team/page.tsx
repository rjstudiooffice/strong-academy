import { getProfile } from "@/lib/supabase/profile"
import { createClient } from "@/lib/supabase/server"
import { TeamContent, type TeamProfile } from "./_content"

export default async function TeamPage() {
  const profile = await getProfile()

  let members: TeamProfile[] = []

  if (profile) {
    const supabase = await createClient()
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, email, avatar_url, created_at")
      .eq("sponsor_id", profile.id)
      .order("created_at", { ascending: false })

    members = (data ?? []) as TeamProfile[]
  }

  return <TeamContent members={members} />
}
