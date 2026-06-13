"use client"

import Link from "next/link"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          오류가 발생했습니다
        </h1>
        <p className="text-gray-600 mb-2">
          견적서를 불러오는 중에 문제가 발생했습니다.
        </p>
        {process.env.NODE_ENV === "development" && error.message && (
          <p className="text-sm text-gray-500 mb-6 bg-gray-100 p-3 rounded font-mono">
            {error.message}
          </p>
        )}
        <div className="space-y-3">
          <Button onClick={reset} className="w-full">
            다시 시도
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/">홈으로 돌아가기</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
