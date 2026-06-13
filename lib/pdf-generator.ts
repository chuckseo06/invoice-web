"use client"

export async function generateQuotePdf(
  elementId: string,
  fileName: string
): Promise<void> {
  if (typeof window === "undefined") {
    throw new Error("PDF 생성은 클라이언트 환경에서만 가능합니다")
  }

  try {
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error(`${elementId} 요소를 찾을 수 없습니다`)
    }

    const html2pdf = (await import("html2pdf.js")).default

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options: any = {
      margin: [10, 10, 10, 10] as [number, number, number, number], // 상, 좌, 하, 우 (mm)
      filename: `${fileName}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      },
      jsPDF: {
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    }

    await html2pdf().set(options).from(element).save()
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "PDF 생성 중 오류가 발생했습니다"
    throw new Error(`PDF 생성 실패: ${errorMessage}`)
  }
}
