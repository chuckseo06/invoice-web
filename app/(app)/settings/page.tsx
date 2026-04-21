import { PageHeader } from "@/components/common/page-header"

export const metadata = {
  title: "설정 | 스타터킷",
  description: "계정 및 서비스 설정",
}

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="설정"
        description="계정 정보, 알림, 보안 등 설정 관리"
      />
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground text-sm">설정 기능 준비 중입니다.</p>
      </div>
    </div>
  )
}
