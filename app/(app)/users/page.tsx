import { PageHeader } from "@/components/common/page-header"

export const metadata = {
  title: "사용자 | 스타터킷",
  description: "사용자 목록 및 관리",
}

export default function UsersPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="사용자"
        description="등록된 사용자 목록 및 권한 관리"
      />
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground text-sm">사용자 관리 기능 준비 중입니다.</p>
      </div>
    </div>
  )
}
