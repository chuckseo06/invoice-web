import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MOCK_ACTIVITY } from "@/lib/constants"

export function ActivityTable() {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>사용자</TableHead>
            <TableHead className="hidden sm:table-cell">액션</TableHead>
            <TableHead className="hidden md:table-cell">대상</TableHead>
            <TableHead className="text-right">시간</TableHead>
            <TableHead className="text-right">상태</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {MOCK_ACTIVITY.map((log) => (
            <TableRow key={log.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="size-6">
                    <AvatarFallback className="text-xs">
                      {log.user
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{log.user}</span>
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <span className="text-sm">{log.action}</span>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <span className="text-sm text-muted-foreground">{log.target}</span>
              </TableCell>
              <TableCell className="text-right text-sm text-muted-foreground">
                {log.timestamp}
              </TableCell>
              <TableCell className="text-right">
                <Badge
                  variant={
                    log.status === "success"
                      ? "default"
                      : log.status === "pending"
                        ? "secondary"
                        : "destructive"
                  }
                  className="text-xs"
                >
                  {log.status === "success"
                    ? "성공"
                    : log.status === "pending"
                      ? "진행 중"
                      : "실패"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
