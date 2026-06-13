import {
  getAllLogs,
  getLogsByLevel,
  getLogsByAction,
  getErrorLogs,
  getRecentLogs,
  getLogStats,
  exportLogsAsJSON,
  exportLogsAsCSV,
} from "@/lib/logger"

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url)

  const level = searchParams.get("level") as "debug" | "info" | "warn" | "error" | null
  const action = searchParams.get("action")
  const limit = searchParams.get("limit")
  const format = searchParams.get("format") // json, csv
  const stats = searchParams.get("stats") // true

  try {
    // 통계만 요청
    if (stats === "true") {
      return Response.json({ stats: getLogStats() })
    }

    // 로그 포맷 선택
    let logs
    if (limit) {
      logs = getRecentLogs(parseInt(limit, 10))
    } else if (level) {
      logs = getLogsByLevel(level)
    } else if (action) {
      logs = getLogsByAction(action)
    } else if (searchParams.get("errors") === "true") {
      logs = getErrorLogs()
    } else {
      logs = getAllLogs()
    }

    // CSV 내보내기
    if (format === "csv") {
      const csv = exportLogsAsCSV()
      return new Response(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="logs-${new Date().toISOString()}.csv"`,
        },
      })
    }

    // JSON 내보내기 (기본값)
    return Response.json({
      total: logs.length,
      logs,
      stats: getLogStats(),
    })
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "로그 조회 실패" },
      { status: 500 }
    )
  }
}
