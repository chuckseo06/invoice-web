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

// 활동 로그 (대시보드용 - 최근 견적서 목록)
export interface ActivityLog {
  id: string
  title: string // 견적서 제목
  clientName: string // 클라이언트명
  amount: number // 금액
  createdDate: string // 생성일
  status: QuoteStatus // "Draft" | "Sent" | "Accepted" | "Rejected"
}

// Quote 상태
export type QuoteStatus = "Draft" | "Sent" | "Accepted" | "Rejected"

// 라인 아이템 (Items DB에서 조회한 데이터)
export interface InvoiceItem {
  id: string // Notion 페이지 ID
  name: string // 항목명
  description?: string // 항목 세부 설명
  quantity: number // 공수/시간/수량
  unit?: string // 단위 (h, 시간, 건 등)
  unitPrice: number // 단가
  subtotal: number // 소계 (quantity × unitPrice, Formula에서 계산)
  invoiceId?: string // 소속 Invoice의 Notion 페이지 ID
  sortOrder?: number // 표시 순서
}

// 견적서 (Invoice DB에서 조회한 데이터)
export interface Invoice {
  id: string // Notion 페이지 ID
  quoteId: string // UUID (공개 URL용)
  title: string // 견적서 제목
  clientName: string
  description?: string // 전체 견적 설명
  status: QuoteStatus
  validUntil?: string // ISO 날짜 형식
  createdDate?: string // ISO 날짜 형식
  totalAmount: number // 총금액 (Rollup에서 자동 계산)
  items?: InvoiceItem[] // 포함된 라인 아이템 배열
}

// 라인 아이템 생성 폼 입력
export interface CreateInvoiceItemInput {
  name: string
  description?: string
  quantity: number
  unit?: string
  unitPrice: number
}

// 견적서 생성 폼 입력
export interface CreateInvoiceInput {
  title: string
  clientName: string
  description?: string
  validUntil?: string
  items?: CreateInvoiceItemInput[] // 함께 생성할 라인 아이템들
}

// 견적서 수정 폼 입력
export interface UpdateInvoiceInput {
  title?: string
  clientName?: string
  description?: string
  validUntil?: string
  items?: CreateInvoiceItemInput[] // 항목들은 삭제 후 재생성
}

// 하위 호환성: 기존 Quote, CreateQuoteInput 타입 alias 유지
export type Quote = Invoice
export type CreateQuoteInput = CreateInvoiceInput
export type UpdateQuoteInput = UpdateInvoiceInput
