import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { MobileNav } from "./MobileNav"
import { getProfile } from "@/lib/supabase/profile"

export async function AppShell({ children }: { children: React.ReactNode }) {
  const profile = await getProfile()

  // Team nav item always visible — empty state on the page guides new users to invite
  const showTeam           = true
  const leadershipUnlocked = profile?.leadership_unlocked ?? false
  const isAdmin            = profile?.role === "admin"

  return (
    <div className="flex h-full min-h-screen">
      <Sidebar showTeam={showTeam} leadershipUnlocked={leadershipUnlocked} isAdmin={isAdmin} />
      <div className="flex flex-col flex-1 min-w-0">
        <Header profile={profile} />
        <main className="flex-1 px-4 sm:px-6 py-6 sm:py-8 pb-nav-safe md:pb-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
      <MobileNav showTeam={showTeam} leadershipUnlocked={leadershipUnlocked} isAdmin={isAdmin} />
    </div>
  )
}
