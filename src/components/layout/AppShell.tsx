import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { MobileNav } from "./MobileNav"
import { hasTeamMembers } from "@/lib/data/team"
import { isLeadershipUnlocked } from "@/lib/data/leadership"

export function AppShell({ children }: { children: React.ReactNode }) {
  const showTeam           = hasTeamMembers()
  const leadershipUnlocked = isLeadershipUnlocked()

  return (
    <div className="flex h-full min-h-screen">
      <Sidebar showTeam={showTeam} leadershipUnlocked={leadershipUnlocked} />
      <div className="flex flex-col flex-1 min-w-0">
        <Header />
        <main className="flex-1 px-4 sm:px-6 py-6 sm:py-8 pb-nav-safe md:pb-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
      <MobileNav showTeam={showTeam} leadershipUnlocked={leadershipUnlocked} />
    </div>
  )
}
