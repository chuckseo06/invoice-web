import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getQuoteByQuoteId } from "@/app/actions/notion-quote"
import { QuoteDisplay } from "@/components/quote/quote-display"
import { PdfDownloadButton } from "@/components/quote/pdf-download-button"
import { Skeleton } from "@/components/ui/skeleton"

interface QuotePageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: QuotePageProps) {
  const { id } = await params
  const invoice = await getQuoteByQuoteId(id)

  if (!invoice) {
    return {
      title: "견적서를 찾을 수 없습니다",
      description: "요청한 견적서를 찾을 수 없습니다",
    }
  }

  return {
    title: `${invoice.title} | 견적서`,
    description: `${invoice.clientName}에게 발행된 견적서: ${invoice.title}`,
  }
}

// Suspense로 감싼 견적서 콘텐츠
async function QuoteContent({ quoteId }: { quoteId: string }) {
  const invoice = await getQuoteByQuoteId(quoteId)

  if (!invoice) {
    notFound()
  }

  return (
    <>
      {/* 상단 헤더 */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{invoice.title}</h1>
          <p className="text-gray-600 mt-1">
            발행: {new Date(invoice.createdDate || "").toLocaleDateString("ko-KR")}
          </p>
        </div>
        <PdfDownloadButton fileName={invoice.title} />
      </div>

      {/* 견적서 본문 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <QuoteDisplay invoice={invoice} />
      </div>
    </>
  )
}

// 로딩 폴백 UI
function QuoteContentSkeleton() {
  return (
    <>
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
          <Skeleton className="h-12 w-1/2" />
          <div className="grid grid-cols-2 gap-8">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
          <div className="space-y-2 border-t pt-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default async function QuotePage({ params }: QuotePageProps) {
  const { id } = await params

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Suspense 경계: 견적서 내용 로딩 */}
        <Suspense fallback={<QuoteContentSkeleton />}>
          <QuoteContent quoteId={id} />
        </Suspense>

        {/* 하단 안내 문구 (항상 표시) */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>본 견적서는 온라인으로 안전하게 공유되는 문서입니다.</p>
          <p className="mt-1">
            문의사항이 있으시면 발신자에게 연락해주세요.
          </p>
        </div>
      </div>
    </div>
  )
}
