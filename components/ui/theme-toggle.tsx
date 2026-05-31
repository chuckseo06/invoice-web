"use client"

import { useIsClient } from "usehooks-ts"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const isClient = useIsClient()
  const { theme, setTheme } = useTheme()

  if (!isClient) {
    return <Button variant="ghost" size="icon" disabled />
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      title={`${theme === "dark" ? "라이트" : "다크"} 모드로 전환`}
    >
      {theme === "dark" ? (
        <Sun className="size-5" />
      ) : (
        <Moon className="size-5" />
      )}
      <span className="sr-only">테마 전환</span>
    </Button>
  )
}
