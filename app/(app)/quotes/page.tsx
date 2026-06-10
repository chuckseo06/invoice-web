import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PageHeader } from "@/components/common/page-header"
import { QuoteTable } from "@/components/quote/quote-table"
import { getQuotes } from "@/app/actions/notion-quote"
import { PlusIcon } from "lucide-react"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "견적서 | Invoice Web",
  description: "견적서 목록 및 관리",
}

export default async function QuotesPage() {
  const quotes = await getQuotes()

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
      <Card>
        <div className="p-6">
          <QuoteTable quotes={quotes} />
        </div>
      </Card>
    </div>
  )
}
