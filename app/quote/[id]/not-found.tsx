import Link from "next/link"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          견적서를 찾을 수 없습니다
        </h1>
        <p className="text-gray-600 mb-6">
          요청하신 견적서를 찾을 수 없습니다. 링크를 다시 확인해주세요.
        </p>
        <div className="space-y-3">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/">홈으로 돌아가기</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
