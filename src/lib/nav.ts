export type NavItem = {
  label: string
  href: string
  icon: string
}

export const navItems: NavItem[] = [
  { label: "Startseite", href: "/",           icon: "home" },
  { label: "Academy",    href: "/academy",     icon: "graduation-cap" },
  { label: "Ressourcen", href: "/ressourcen",  icon: "folder-open" },
  { label: "Profil",     href: "/profil",      icon: "user" },
]
