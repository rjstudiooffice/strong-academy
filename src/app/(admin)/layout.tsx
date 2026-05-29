import { redirect } from "next/navigation"
import { getProfile } from "@/lib/supabase/profile"
import { AdminShell } from "@/components/admin/AdminShell"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile()

  if (!profile || profile.role !== "admin") {
    redirect("/")
  }

  return <AdminShell>{children}</AdminShell>
}
