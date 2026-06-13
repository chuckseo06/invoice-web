import { notFound } from "next/navigation"
import { getQuoteByQuoteId } from "@/app/actions/notion-quote"
import { QuoteDisplay } from "@/components/quote/quote-display"
import { PdfDownloadButton } from "@/components/quote/pdf-download-button"

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

export default async function QuotePage({ params }: QuotePageProps) {
  const { id } = await params
  const invoice = await getQuoteByQuoteId(id)

  if (!invoice) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
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

        {/* 하단 안내 문구 */}
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
