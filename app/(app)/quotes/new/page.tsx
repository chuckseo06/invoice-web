import { PageHeader } from "@/components/common/page-header"
import { QuoteForm } from "@/components/quote/quote-form"

export const metadata = {
  title: "새 견적서 | Invoice Web",
  description: "새 견적서 작성",
}

export default function NewQuotePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="새 견적서"
        description="새 견적서를 작성하고 클라이언트에게 공유하세요."
      />
      <QuoteForm />
    </div>
  )
}
