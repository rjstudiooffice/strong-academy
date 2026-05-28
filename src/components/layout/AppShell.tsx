import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { MobileNav } from "./MobileNav"
import { hasTeamMembers } from "@/lib/data/team"

export function AppShell({ children }: { children: React.ReactNode }) {
  const showTeam = hasTeamMembers()

  return (
    <div className="flex h-full min-h-screen">
      <Sidebar showTeam={showTeam} />
      <div className="flex flex-col flex-1 min-w-0">
        <Header />
        <main className="flex-1 px-6 py-8 pb-24 md:pb-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
      <MobileNav showTeam={showTeam} />
    </div>
  )
}
