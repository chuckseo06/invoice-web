"use client"

import { useSidebar } from "@/hooks/use-sidebar"
import { AppNavbar } from "@/components/layout/app-navbar"
import { Sidebar } from "@/components/layout/sidebar"
import { MobileNav } from "@/components/layout/mobile-nav"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const { isOpen, toggle, close } = useSidebar()

  return (
    <div className="flex min-h-screen flex-col">
      <AppNavbar onMenuClick={toggle} />
      <div className="flex flex-1">
        <Sidebar className="hidden md:flex" />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
      <MobileNav isOpen={isOpen} onClose={close} />
    </div>
  )
}
