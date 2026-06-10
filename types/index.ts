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

// Quote 상태
export type QuoteStatus = "Draft" | "Sent" | "Accepted" | "Rejected"

// 견적서 (Notion DB에서 조회한 데이터)
export interface Quote {
  id: string // Notion 페이지 ID
  quoteId: string // UUID (공개 URL용)
  title: string
  clientName: string
  amount: number
  description: string
  status: QuoteStatus
  validUntil?: string // ISO 날짜 형식
  createdDate?: string // ISO 날짜 형식
}

// 견적서 생성 폼 입력
export interface CreateQuoteInput {
  title: string
  clientName: string
  amount: number
  description?: string
  validUntil?: string
}
