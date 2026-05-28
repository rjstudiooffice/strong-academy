"use client"

import {
  Home, GraduationCap, FolderOpen, User, Users,
  Settings, LogOut, BookOpen, Search, TrendingUp
} from "lucide-react"

const icons: Record<string, React.ElementType> = {
  home: Home,
  "graduation-cap": GraduationCap,
  "folder-open": FolderOpen,
  user: User,
  users: Users,
  settings: Settings,
  logout: LogOut,
  book: BookOpen,
  search: Search,
  trending: TrendingUp,
}

export function NavIcon({ name, className }: { name: string; className?: string }) {
  const Icon = icons[name] ?? Home
  return <Icon className={className} strokeWidth={1.75} />
}
