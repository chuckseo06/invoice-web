import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="size-8 bg-primary rounded-lg" />
          <span>스타터킷</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition"
          >
            홈
          </Link>
          <Link
            href="#features"
            className="text-sm text-muted-foreground hover:text-foreground transition"
          >
            기능
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/sign-in">로그인</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/sign-in">시작하기</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
