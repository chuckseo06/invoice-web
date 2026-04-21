"use client"

import { useMediaQuery } from "react-responsive"

/**
 * Tailwind 브레이크포인트 기준 반응형 감지 훅
 * - sm: 640px
 * - md: 768px
 * - lg: 1024px
 * - xl: 1280px
 */
export function useBreakpoint() {
  const isMobile = useMediaQuery({ maxWidth: 767 }) // < md
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 }) // md ~ lg
  const isDesktop = useMediaQuery({ minWidth: 1024 }) // >= lg

  return {
    isMobile,
    isTablet,
    isDesktop,
  }
}
