import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 상단 헤더 스켈레톤 */}
        <div className="mb-8 flex justify-between items-start">
          <div className="flex-1">
            <Skeleton className="h-10 w-2/3 mb-3" />
            <Skeleton className="h-4 w-1/3" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* 견적서 본문 스켈레톤 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
          <div className="space-y-6">
            {/* 제목 */}
            <Skeleton className="h-12 w-1/2" />

            {/* 정보 행 */}
            <div className="grid grid-cols-2 gap-8">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>

            {/* 클라이언트 정보 */}
            <div className="grid grid-cols-2 gap-8">
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </div>

            {/* 테이블 행들 */}
            <div className="space-y-2 border-t pt-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>

            {/* 합계 */}
            <div className="flex justify-end">
              <Skeleton className="h-12 w-48" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
