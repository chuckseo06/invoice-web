import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function HeroSection() {
  return (
    <section className="relative py-24 md:py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <Badge className="mb-6">v1.0 출시</Badge>

        <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
          모던 웹 개발을 위한
          <br />
          <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            완벽한 스타터킷
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Next.js, React, Tailwind CSS로 구축된 프로덕션 레디 스타터킷.
          빠르게 웹 애플리케이션을 개발하고 배포하세요.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/dashboard">시작하기</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              GitHub 보기
            </a>
          </Button>
        </div>

        <div className="mt-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-600/20 rounded-lg blur-3xl" />
          <div className="relative bg-background border rounded-lg p-8 md:p-12 backdrop-blur">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">50+</div>
                <p className="text-sm text-muted-foreground">컴포넌트</p>
              </div>
              <div>
                <div className="text-2xl font-bold">100%</div>
                <p className="text-sm text-muted-foreground">TypeScript</p>
              </div>
              <div>
                <div className="text-2xl font-bold">1초</div>
                <p className="text-sm text-muted-foreground">빌드</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
