import Link from "next/link"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold mb-3">회사</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground transition">
                  소개
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-foreground transition">
                  채용
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-foreground transition">
                  블로그
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3">상품</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/features" className="hover:text-foreground transition">
                  기능
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-foreground transition">
                  가격
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-foreground transition">
                  보안
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3">개발</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/docs" className="hover:text-foreground transition">
                  문서
                </Link>
              </li>
              <li>
                <Link href="/api" className="hover:text-foreground transition">
                  API
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-foreground transition">
                  커뮤니티
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3">법률</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-foreground transition">
                  개인정보 보호정책
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition">
                  이용약관
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-foreground transition">
                  쿠키 정책
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; {currentYear} Next.js 스타터킷. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition">
              Twitter
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition">
              GitHub
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
