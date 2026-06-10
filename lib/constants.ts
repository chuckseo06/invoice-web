import {
  LayoutDashboard,
  Settings,
  Users,
  BarChart3,
  Zap,
  Shield,
  Smartphone,
  Globe,
  TrendingUp,
  Users2,
  FileText,
} from "lucide-react"
import type { NavLink, Feature, StatCard, ActivityLog, QuoteStatus } from "@/types"

// Notion 데이터베이스 ID
export const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID || ""

// 견적서 상태 옵션
export const QUOTE_STATUS: Record<QuoteStatus, { label: string; color: string }> = {
  Draft: { label: "작성 중", color: "bg-gray-100 text-gray-800" },
  Sent: { label: "발송됨", color: "bg-blue-100 text-blue-800" },
  Accepted: { label: "승인됨", color: "bg-green-100 text-green-800" },
  Rejected: { label: "거절됨", color: "bg-red-100 text-red-800" },
}

// 네비게이션 링크
export const NAV_LINKS: NavLink[] = [
  { label: "대시보드", href: "/dashboard", icon: LayoutDashboard },
  { label: "견적서", href: "/quotes", icon: FileText },
  { label: "사용자", href: "/users", icon: Users },
  { label: "분석", href: "/analytics", icon: BarChart3 },
  { label: "설정", href: "/settings", icon: Settings },
]

// 기능 섹션
export const FEATURES: Feature[] = [
  {
    title: "빠른 성능",
    description: "최신 기술 스택으로 구현된 초고속 웹 애플리케이션",
    icon: Zap,
  },
  {
    title: "안전성",
    description: "엔터프라이즈급 보안과 데이터 보호",
    icon: Shield,
  },
  {
    title: "반응형 디자인",
    description: "모든 기기에 최적화된 사용자 경험",
    icon: Smartphone,
  },
  {
    title: "글로벌 확장",
    description: "전 세계 어디서나 안정적인 서비스 제공",
    icon: Globe,
  },
  {
    title: "실시간 분석",
    description: "대시보드를 통한 실시간 데이터 모니터링",
    icon: TrendingUp,
  },
  {
    title: "팀 협업",
    description: "팀원들과 함께 효율적으로 일할 수 있는 환경",
    icon: Users2,
  },
]

// 통계 카드 목업 데이터
export const MOCK_STATS: StatCard[] = [
  {
    title: "총 사용자",
    value: "12,543",
    change: "+12% vs 지난달",
    trend: "up",
    icon: Users,
  },
  {
    title: "매출",
    value: "$45,231.89",
    change: "+8% vs 지난달",
    trend: "up",
    icon: TrendingUp,
  },
  {
    title: "활성 세션",
    value: "8,234",
    change: "-2% vs 지난달",
    trend: "down",
    icon: BarChart3,
  },
  {
    title: "완료율",
    value: "94.2%",
    change: "+3.5% vs 지난달",
    trend: "up",
    icon: LayoutDashboard,
  },
]

// 활동 로그 목록 목업 데이터
export const MOCK_ACTIVITY: ActivityLog[] = [
  {
    id: "1",
    user: "Alex Kim",
    action: "로그인",
    target: "시스템",
    timestamp: "2024년 2월 15일 14:32",
    status: "success",
  },
  {
    id: "2",
    user: "Sarah Chen",
    action: "파일 업로드",
    target: "report_2024.pdf",
    timestamp: "2024년 2월 15일 13:15",
    status: "success",
  },
  {
    id: "3",
    user: "John Doe",
    action: "설정 변경",
    target: "팀 권한",
    timestamp: "2024년 2월 15일 12:48",
    status: "pending",
  },
  {
    id: "4",
    user: "Emma Wilson",
    action: "데이터 내보내기",
    target: "quarterly_report.xlsx",
    timestamp: "2024년 2월 15일 11:22",
    status: "success",
  },
  {
    id: "5",
    user: "Michael Brown",
    action: "접근 거부",
    target: "관리자 패널",
    timestamp: "2024년 2월 15일 10:05",
    status: "failed",
  },
]
