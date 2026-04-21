import { PageHeader } from "@/components/common/page-header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { ActivityTable } from "@/components/dashboard/activity-table"

export const metadata = {
  title: "대시보드 | 스타터킷",
  description: "서비스 현황 개요",
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="대시보드"
        description="서비스 현황 개요 및 주요 지표"
      />

      <div className="space-y-6">
        <StatsCards />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">최근 활동</h2>
          <ActivityTable />
        </div>
      </div>
    </div>
  )
}
