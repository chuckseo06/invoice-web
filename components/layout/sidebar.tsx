"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { NAV_LINKS } from "@/lib/constants"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "h-screen w-64 border-r bg-background sticky top-0 overflow-y-auto",
        className
      )}
    >
      <nav className="p-6 space-y-2">
        {NAV_LINKS.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/")

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-hover hover:text-foreground"
              )}
            >
              {Icon && <Icon className="size-5 shrink-0" />}
              <span>{link.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
