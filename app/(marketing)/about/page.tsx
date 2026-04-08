export const metadata = {
  title: "소개 | 스타터킷",
  description: "우리 회사에 대해 알아보세요.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">소개</h1>
        <div className="border-2 border-dashed rounded-lg p-8 text-muted-foreground">
          <p className="text-lg">회사 소개 페이지는 준비 중입니다.</p>
          <p className="mt-2">곧 업데이트될 예정입니다.</p>
        </div>
      </div>
    </div>
  )
}
