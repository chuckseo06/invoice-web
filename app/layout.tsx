import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Providers } from "./providers"
import "./globals.css"

// 폰트 최적화: display="swap" 사용 (로컬 폰트 먼저 → 웹 폰트 로드되면 교체)
// 사용자가 폰트 로딩을 기다리지 않고 콘텐츠를 즉시 볼 수 있음
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // FOUT(Flash of Unstyled Text) 방지
  preload: true,
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  title: "Invoice Web | 견적서 관리 시스템",
  description: "Notion 기반 견적서 생성 및 관리 시스템",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
