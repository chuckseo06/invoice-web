import { LoadingSkeleton } from "@/components/common/loading-skeleton"

export default function QuotesLoading() {
  return <LoadingSkeleton type="table-row" count={5} />
}
