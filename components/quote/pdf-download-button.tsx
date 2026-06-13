"use client"

import { useState } from "react"
import { Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { generateQuotePdf } from "@/lib/pdf-generator"

interface PdfDownloadButtonProps {
  fileName: string
  elementId?: string
}

export function PdfDownloadButton({
  fileName,
  elementId = "quote-content",
}: PdfDownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDownload = async () => {
    try {
      setIsLoading(true)
      await generateQuotePdf(elementId, fileName)
      toast.success("PDF가 다운로드되었습니다")
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다"
      toast.error(`PDF 다운로드 실패: ${errorMessage}`)
      console.error("PDF 생성 오류:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={isLoading}
      size="lg"
      className="gap-2"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          처리 중...
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          PDF 다운로드
        </>
      )}
    </Button>
  )
}
