"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { FileText, MoreHorizontal, Trash2, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { EmptyState } from "@/components/common/empty-state"
import { StatusBadge } from "@/components/quote/status-badge"
import { updateQuoteStatus, deleteQuote } from "@/app/actions/notion-quote"
import type { Quote, QuoteStatus } from "@/types"

interface QuoteTableProps {
  quotes: Quote[]
}

export function QuoteTable({ quotes }: QuoteTableProps) {
  const [isPending, startTransition] = useTransition()
  const [deleteTarget, setDeleteTarget] = useState<Quote | null>(null)

  function formatAmount(amount: number) {
    return new Intl.NumberFormat("ko-KR").format(amount) + "원"
  }

  function formatDate(dateStr?: string) {
    if (!dateStr) return "-"
    return new Date(dateStr).toLocaleDateString("ko-KR")
  }

  function handleStatusChange(quote: Quote, newStatus: QuoteStatus) {
    startTransition(async () => {
      try {
        const result = await updateQuoteStatus(quote.id, newStatus)
        if (result.success) {
          toast.success("상태가 변경되었습니다.")
        } else {
          toast.error(result.error || "상태 변경에 실패했습니다.")
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "상태 변경 중 오류가 발생했습니다"
        toast.error(errorMessage)
        console.error("상태 변경 오류:", error)
      }
    })
  }

  function handleCopyLink(quote: Quote) {
    const url = `${window.location.origin}/quote/${quote.quoteId}`
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success("링크가 클립보드에 복사되었습니다.")
      })
      .catch(() => {
        toast.error("링크 복사에 실패했습니다.")
      })
  }

  function handleDeleteConfirm() {
    if (!deleteTarget) return
    startTransition(async () => {
      try {
        const result = await deleteQuote(deleteTarget.id)
        if (result.success) {
          toast.success("견적서가 삭제되었습니다.")
          setDeleteTarget(null)
        } else {
          toast.error(result.error || "삭제에 실패했습니다.")
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "삭제 중 오류가 발생했습니다"
        toast.error(errorMessage)
        console.error("삭제 오류:", error)
      }
    })
  }

  if (quotes.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="견적서가 없습니다"
        description="새 견적서를 작성하여 클라이언트에게 공유하세요."
        action={{ label: "새 견적서 작성", href: "/quotes/new" }}
      />
    )
  }

  const QUOTE_STATUSES: QuoteStatus[] = ["Draft", "Sent", "Accepted", "Rejected"]

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>제목</TableHead>
            <TableHead>클라이언트</TableHead>
            <TableHead className="text-right">금액 합계</TableHead>
            <TableHead>상태</TableHead>
            <TableHead>유효기간</TableHead>
            <TableHead>생성일</TableHead>
            <TableHead className="text-right">액션</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotes.map((quote) => (
            <TableRow key={quote.id}>
              <TableCell className="font-medium">{quote.title}</TableCell>
              <TableCell>{quote.clientName}</TableCell>
              <TableCell className="text-right">{formatAmount(quote.totalAmount)}</TableCell>
              <TableCell>
                <StatusBadge status={quote.status} />
              </TableCell>
              <TableCell>{formatDate(quote.validUntil)}</TableCell>
              <TableCell>{formatDate(quote.createdDate)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" disabled={isPending}>
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>상태 변경</DropdownMenuLabel>
                    {QUOTE_STATUSES.map((status) => (
                      <DropdownMenuItem
                        key={status}
                        onClick={() => handleStatusChange(quote, status)}
                        disabled={quote.status === status || isPending}
                      >
                        {status === "Draft" && "작성 중"}
                        {status === "Sent" && "발송됨"}
                        {status === "Accepted" && "승인됨"}
                        {status === "Rejected" && "거절됨"}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleCopyLink(quote)} disabled={isPending}>
                      <Copy className="mr-2 size-4" />
                      공유 링크 복사
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDeleteTarget(quote)}
                      disabled={isPending}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 size-4" />
                      삭제
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={deleteTarget !== null} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>견적서 삭제</DialogTitle>
            <DialogDescription>
              &quot;{deleteTarget?.title}&quot;를(을) 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={isPending}>
              {isPending ? "삭제 중..." : "삭제"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
