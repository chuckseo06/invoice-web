// 분당 요청 수 제한 (Rate Limiting)
// Token Bucket 알고리즘 기반

interface RateLimitState {
  tokens: number
  lastRefillTime: number
}

const rateLimitMap = new Map<string, RateLimitState>()

const MAX_TOKENS = 10 // 분당 최대 10회
const REFILL_RATE = MAX_TOKENS / 60 // 초당 토큰 생성 속도

export function checkRateLimit(key: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now() / 1000 // 초 단위

  let state = rateLimitMap.get(key)
  if (!state) {
    state = { tokens: MAX_TOKENS, lastRefillTime: now }
    rateLimitMap.set(key, state)
  }

  // 경과 시간만큼 토큰 충전
  const elapsed = now - state.lastRefillTime
  const tokensToAdd = elapsed * REFILL_RATE
  state.tokens = Math.min(MAX_TOKENS, state.tokens + tokensToAdd)
  state.lastRefillTime = now

  // 토큰 소비
  if (state.tokens >= 1) {
    state.tokens -= 1
    return { allowed: true }
  }

  // 다음 토큰까지의 대기 시간 (초)
  const retryAfter = Math.ceil((1 - state.tokens) / REFILL_RATE)
  return { allowed: false, retryAfter }
}

// 더미 모드 또는 테스트용: 특정 클라이언트별 제한 우회
export function resetRateLimit(key: string): void {
  rateLimitMap.delete(key)
}

// 모든 Rate Limit 초기화 (테스트용)
export function clearRateLimits(): void {
  rateLimitMap.clear()
}
