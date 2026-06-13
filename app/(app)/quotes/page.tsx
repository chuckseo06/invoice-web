import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PageHeader } from "@/components/common/page-header"
import { QuoteTable } from "@/components/quote/quote-table"
import { getQuotes } from "@/app/actions/notion-quote"
import { PlusIcon } from "lucide-react"
import { LoadingSkeleton } from "@/components/common/loading-skeleton"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "견적서 | Invoice Web",
  description: "견적서 목록 및 관리",
}

// Suspense로 감싼 테이블 컴포넌트
async function QuoteTableWrapper() {
  const quotes = await getQuotes()
  return <QuoteTable quotes={quotes} />
}

export default function QuotesPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="견적서" description="견적서 목록 및 상태 관리">
        <Button size="sm" asChild>
          <Link href="/quotes/new">
            <PlusIcon className="mr-2 size-4" />
            새 견적서
          </Link>
        </Button>
      </PageHeader>

      {/* Suspense 경계: 헤더는 즉시 표시, 테이블은 로딩 스켈레톤 */}
      <Card>
        <div className="p-6">
          <Suspense fallback={<LoadingSkeleton type="table-row" count={5} />}>
            <QuoteTableWrapper />
          </Suspense>
        </div>
      </Card>
    </div>
  )
}
