import { Suspense } from "react"
import { PageHeader } from "@/components/common/page-header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { ActivityTable } from "@/components/dashboard/activity-table"
import { LoadingSkeleton } from "@/components/common/loading-skeleton"

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
        {/* Suspense 경계: 통계 카드 (지표들이 먼저 로딩) */}
        <Suspense fallback={<LoadingSkeleton type="card" count={4} />}>
          <StatsCards />
        </Suspense>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">최근 견적서</h2>

          {/* Suspense 경계: 활동 테이블 (통계보다 느릴 수 있음) */}
          <Suspense fallback={<LoadingSkeleton type="table-row" count={5} />}>
            <ActivityTable />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
