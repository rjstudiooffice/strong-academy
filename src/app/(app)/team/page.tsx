import { getProfile } from "@/lib/supabase/profile"
import { createClient } from "@/lib/supabase/server"
import { TeamContent, type DownlineFlatMember } from "./_content"

export default async function TeamPage() {
  const profile = await getProfile()

  if (!profile) {
    return <TeamContent members={[]} currentUserId="" />
  }

  const supabase = await createClient()
  const { data } = await supabase.rpc("get_my_downline")

  return (
    <TeamContent
      members={(data ?? []) as DownlineFlatMember[]}
      currentUserId={profile.id}
    />
  )
}
