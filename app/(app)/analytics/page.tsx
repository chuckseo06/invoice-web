import { PageHeader } from "@/components/common/page-header"

export const metadata = {
  title: "분석 | 스타터킷",
  description: "서비스 사용 현황 분석",
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="분석"
        description="트래픽, 전환율 등 서비스 지표 분석"
      />
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground text-sm">분석 기능 준비 중입니다.</p>
      </div>
    </div>
  )
}
