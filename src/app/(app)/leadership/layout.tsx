import type { ReactNode } from "react"

export default function LeadershipLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="-mx-4 sm:-mx-6 -mt-6 sm:-mt-8 px-4 sm:px-6 pt-6 sm:pt-8 md:pb-8 pb-nav-safe min-h-screen"
      style={{ backgroundColor: "#1A1714" }}
    >
      {children}
    </div>
  )
}
