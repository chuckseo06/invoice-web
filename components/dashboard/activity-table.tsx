import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MOCK_ACTIVITY } from "@/lib/constants"
import { StatusBadge } from "@/components/quote/status-badge"

export function ActivityTable() {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>견적서 제목</TableHead>
            <TableHead className="hidden sm:table-cell">클라이언트</TableHead>
            <TableHead className="text-right">금액</TableHead>
            <TableHead className="hidden md:table-cell">생성일</TableHead>
            <TableHead className="text-right">상태</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {MOCK_ACTIVITY.map((log) => (
            <TableRow key={log.id}>
              <TableCell>
                <span className="font-medium">{log.title}</span>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <span className="text-sm text-muted-foreground">{log.clientName}</span>
              </TableCell>
              <TableCell className="text-right text-sm">
                ₩{log.amount.toLocaleString("ko-KR")}
              </TableCell>
              <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                {new Date(log.createdDate).toLocaleDateString("ko-KR")}
              </TableCell>
              <TableCell className="text-right">
                <StatusBadge status={log.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
