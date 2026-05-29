import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { MobileNav } from "./MobileNav"
import { hasTeamMembers } from "@/lib/data/team"
import { getProfile } from "@/lib/supabase/profile"

export async function AppShell({ children }: { children: React.ReactNode }) {
  const profile          = await getProfile()
  const showTeam         = hasTeamMembers()              // TODO: real Supabase team query
  const leadershipUnlocked = profile?.leadership_unlocked ?? false

  return (
    <div className="flex h-full min-h-screen">
      <Sidebar showTeam={showTeam} leadershipUnlocked={leadershipUnlocked} />
      <div className="flex flex-col flex-1 min-w-0">
        <Header profile={profile} />
        <main className="flex-1 px-4 sm:px-6 py-6 sm:py-8 pb-nav-safe md:pb-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
      <MobileNav showTeam={showTeam} leadershipUnlocked={leadershipUnlocked} />
    </div>
  )
}
