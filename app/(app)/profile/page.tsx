import { PageHeader } from "@/components/common/page-header"

export const metadata = {
  title: "프로필 | 스타터킷",
  description: "내 프로필 정보",
}

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="프로필"
        description="이름, 이메일, 아바타 등 계정 정보 관리"
      />
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground text-sm">프로필 편집 기능 준비 중입니다.</p>
      </div>
    </div>
  )
}
