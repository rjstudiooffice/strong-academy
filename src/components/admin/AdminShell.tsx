import { AdminSidebar } from "./AdminSidebar"
import { AdminMobileNav } from "./AdminMobileNav"

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#FAF9F6]">
      {/* Sidebar — desktop only */}
      <AdminSidebar />

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile top nav */}
        <AdminMobileNav />

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
