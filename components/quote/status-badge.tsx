import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { QuoteStatus } from "@/types"

interface StatusBadgeProps {
  status: QuoteStatus
}

const STATUS_STYLES: Record<QuoteStatus, string> = {
  Draft: "bg-secondary text-secondary-foreground border-border",
  Sent: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
  Accepted: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
  Rejected: "bg-destructive/10 text-destructive border-destructive/20 dark:border-destructive/30",
}

const STATUS_LABELS: Record<QuoteStatus, string> = {
  Draft: "작성 중",
  Sent: "발송됨",
  Accepted: "승인됨",
  Rejected: "거절됨",
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn(STATUS_STYLES[status])}>
      {STATUS_LABELS[status]}
    </Badge>
  )
}
