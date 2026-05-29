import { AdminSidebar } from "./AdminSidebar"

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#FAF9F6]">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <main className="max-w-6xl mx-auto px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  )
}
