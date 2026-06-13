// 구조화된 로깅 시스템
// 모든 시스템 활동 및 에러를 기록하여 문제 발생 시 빠른 대처 가능하도록 함

export type LogLevel = "debug" | "info" | "warn" | "error"

export interface LogEntry {
  timestamp: string
  level: LogLevel
  action: string
  message: string
  context?: Record<string, unknown>
  error?: {
    message: string
    stack?: string
  }
}

const MAX_LOGS = 1000 // 메모리 버퍼 최대 크기
const logs: LogEntry[] = []

const LOG_COLORS = {
  debug: "\x1b[36m", // cyan
  info: "\x1b[32m", // green
  warn: "\x1b[33m", // yellow
  error: "\x1b[31m", // red
  reset: "\x1b[0m",
}

function formatTimestamp(date: Date): string {
  return date.toISOString()
}

function formatLogMessage(
  level: LogLevel,
  timestamp: string,
  action: string,
  message: string
): string {
  const color = LOG_COLORS[level]
  const reset = LOG_COLORS.reset
  const levelUpper = level.toUpperCase().padEnd(5)
  return `${color}[${timestamp}] [${levelUpper}] ${action} - ${message}${reset}`
}

function addLogEntry(entry: LogEntry): void {
  logs.push(entry)
  // 최대 크기 초과 시 오래된 로그 제거
  if (logs.length > MAX_LOGS) {
    logs.shift()
  }
}

/**
 * 디버그 레벨 로그 (개발 환경용)
 */
export function logDebug(
  action: string,
  message: string,
  context?: Record<string, unknown>
): void {
  const timestamp = formatTimestamp(new Date())
  const entry: LogEntry = { timestamp, level: "debug", action, message, context }

  addLogEntry(entry)

  if (process.env.NODE_ENV === "development") {
    console.log(formatLogMessage("debug", timestamp, action, message))
    if (context) {
      console.log("  Context:", context)
    }
  }
}

/**
 * 정보 레벨 로그 (API 호출, 생성, 수정, 삭제 등)
 */
export function logInfo(
  action: string,
  message: string,
  context?: Record<string, unknown>
): void {
  const timestamp = formatTimestamp(new Date())
  const entry: LogEntry = { timestamp, level: "info", action, message, context }

  addLogEntry(entry)
  console.log(formatLogMessage("info", timestamp, action, message))
  if (context) {
    console.log("  Context:", context)
  }
}

/**
 * 경고 레벨 로그 (Rate Limit 근처, 성능 저하 등)
 */
export function logWarn(
  action: string,
  message: string,
  context?: Record<string, unknown>
): void {
  const timestamp = formatTimestamp(new Date())
  const entry: LogEntry = { timestamp, level: "warn", action, message, context }

  addLogEntry(entry)
  console.warn(formatLogMessage("warn", timestamp, action, message))
  if (context) {
    console.warn("  Context:", context)
  }
}

/**
 * 에러 레벨 로그 (API 실패, 예외 발생 등)
 */
export function logError(
  action: string,
  message: string,
  error?: Error | unknown,
  context?: Record<string, unknown>
): void {
  const timestamp = formatTimestamp(new Date())

  let errorInfo: { message: string; stack?: string } | undefined
  if (error instanceof Error) {
    errorInfo = {
      message: error.message,
      stack: error.stack,
    }
  } else if (typeof error === "string") {
    errorInfo = {
      message: error,
    }
  }

  const entry: LogEntry = {
    timestamp,
    level: "error",
    action,
    message,
    context,
    error: errorInfo,
  }

  addLogEntry(entry)
  console.error(formatLogMessage("error", timestamp, action, message))
  if (errorInfo) {
    console.error("  Error:", errorInfo.message)
    if (errorInfo.stack) {
      console.error("  Stack:", errorInfo.stack)
    }
  }
  if (context) {
    console.error("  Context:", context)
  }
}

/**
 * 모든 로그 조회
 */
export function getAllLogs(): LogEntry[] {
  return [...logs]
}

/**
 * 특정 레벨의 로그만 조회
 */
export function getLogsByLevel(level: LogLevel): LogEntry[] {
  return logs.filter((log) => log.level === level)
}

/**
 * 특정 액션의 로그만 조회
 */
export function getLogsByAction(action: string): LogEntry[] {
  return logs.filter((log) => log.action === action)
}

/**
 * 특정 시간 범위의 로그 조회
 */
export function getLogsByTimeRange(startTime: Date, endTime: Date): LogEntry[] {
  const startStr = startTime.toISOString()
  const endStr = endTime.toISOString()
  return logs.filter((log) => log.timestamp >= startStr && log.timestamp <= endStr)
}

/**
 * 에러 로그만 조회
 */
export function getErrorLogs(): LogEntry[] {
  return getLogsByLevel("error")
}

/**
 * 최근 N개 로그 조회
 */
export function getRecentLogs(count: number = 100): LogEntry[] {
  return logs.slice(-count)
}

/**
 * 로그 초기화 (테스트 또는 유지보수용)
 */
export function clearLogs(): void {
  logs.length = 0
}

/**
 * 로그 통계
 */
export function getLogStats(): Record<LogLevel, number> {
  return {
    debug: logs.filter((log) => log.level === "debug").length,
    info: logs.filter((log) => log.level === "info").length,
    warn: logs.filter((log) => log.level === "warn").length,
    error: logs.filter((log) => log.level === "error").length,
  }
}

/**
 * 로그를 JSON 형식으로 내보내기
 */
export function exportLogsAsJSON(): string {
  return JSON.stringify(logs, null, 2)
}

/**
 * 로그를 CSV 형식으로 내보내기
 */
export function exportLogsAsCSV(): string {
  const headers = ["timestamp", "level", "action", "message", "context", "error"]
  const rows = logs.map((log) => [
    log.timestamp,
    log.level,
    log.action,
    log.message,
    log.context ? JSON.stringify(log.context) : "",
    log.error ? log.error.message : "",
  ])

  const csvContent = [
    headers.map((h) => `"${h}"`).join(","),
    ...rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
  ].join("\n")

  return csvContent
}
