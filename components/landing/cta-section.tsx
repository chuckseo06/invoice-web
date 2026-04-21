import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section className="bg-primary text-primary-foreground py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          지금 바로 시작하세요
        </h2>
        <p className="mt-4 text-lg opacity-90">
          몇 분 만에 프로덕션 레디 웹 애플리케이션을 구축해보세요.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            variant="secondary"
            asChild
          >
            <Link href="/dashboard">무료로 시작하기</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
          >
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              GitHub 스타 남기기
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
