import type { LucideIcon } from "lucide-react"

// 네비게이션 링크
export interface NavLink {
  label: string
  href: string
  icon?: LucideIcon
}

// 기능 카드
export interface Feature {
  title: string
  description: string
  icon: LucideIcon
}

// 통계 카드
export interface StatCard {
  title: string
  value: string
  change: string
  trend: "up" | "down" | "neutral"
  icon?: LucideIcon
}

// 활동 로그
export interface ActivityLog {
  id: string
  user: string
  action: string
  target: string
  timestamp: string
  status: "success" | "pending" | "failed"
}
