import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { SignInForm } from "@/components/auth/sign-in-form"

export const metadata = {
  title: "로그인 | 스타터킷",
  description: "계정에 로그인하세요",
}

export default function SignInPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-3.5" />
        홈으로 돌아가기
      </Link>
      <SignInForm />
    </div>
  )
}
