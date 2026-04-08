export const metadata = {
  title: "문서 | 스타터킷",
  description: "개발 문서를 확인하세요.",
}

export default function DocsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">문서</h1>
        <div className="border-2 border-dashed rounded-lg p-8 text-muted-foreground">
          <p className="text-lg">개발 문서 페이지는 준비 중입니다.</p>
          <p className="mt-2">곧 업데이트될 예정입니다.</p>
        </div>
      </div>
    </div>
  )
}
