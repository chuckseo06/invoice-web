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
  Clock,
  CheckCircle,
} from "lucide-react"
import type { NavLink, Feature, StatCard, ActivityLog, QuoteStatus } from "@/types"

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

// 통계 카드 목업 데이터 (견적서 관련)
export const MOCK_STATS: StatCard[] = [
  {
    title: "전체 견적서",
    value: "12건",
    change: "+3건 vs 지난달",
    trend: "up",
    icon: FileText,
  },
  {
    title: "이번 달 매출",
    value: "₩11,500,000",
    change: "+8% vs 지난달",
    trend: "up",
    icon: TrendingUp,
  },
  {
    title: "대기 중",
    value: "3건",
    change: "Sent 상태",
    trend: "neutral",
    icon: Clock,
  },
  {
    title: "승인됨",
    value: "7건",
    change: "Accepted 상태",
    trend: "up",
    icon: CheckCircle,
  },
]

// 활동 로그 목록 목업 데이터 (최근 견적서 목록)
export const MOCK_ACTIVITY: ActivityLog[] = [
  {
    id: "1",
    title: "웹사이트 리디자인",
    clientName: "ABC 테크",
    amount: 4800000,
    createdDate: "2026-06-10",
    status: "Sent",
  },
  {
    id: "2",
    title: "모바일 앱 개발",
    clientName: "XYZ 스타트업",
    amount: 3000000,
    createdDate: "2026-06-05",
    status: "Draft",
  },
  {
    id: "3",
    title: "SEO 최적화",
    clientName: "마케팅 에이전시",
    amount: 800000,
    createdDate: "2026-05-20",
    status: "Accepted",
  },
  {
    id: "4",
    title: "데이터 분석 대시보드",
    clientName: "금융사 A",
    amount: 2500000,
    createdDate: "2026-05-15",
    status: "Rejected",
  },
  {
    id: "5",
    title: "프론트엔드 개발",
    clientName: "ABC 회사",
    amount: 4000000,
    createdDate: "2026-06-13",
    status: "Accepted",
  },
]
