import { PageHeader } from "@/components/common/page-header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { ActivityTable } from "@/components/dashboard/activity-table"

export const metadata = {
  title: "대시보드 | Invoice Web",
  description: "견적서 현황 및 주요 지표",
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="대시보드"
        description="견적서 현황 및 주요 지표"
      />

      <div className="space-y-6">
        <StatsCards />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">최근 견적서</h2>
          <ActivityTable />
        </div>
      </div>
    </div>
  )
}
