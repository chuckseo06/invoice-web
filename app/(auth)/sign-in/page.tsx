import Link from "next/link"
import { SignInForm } from "@/components/auth/sign-in-form"

export const metadata = {
  title: "로그인 | 스타터킷",
  description: "계정에 로그인하세요",
}

export default function SignInPage() {
  return (
    <div className="space-y-6">
      <Link href="/" className="text-sm font-semibold hover:underline">
        ← 홈으로 돌아가기
      </Link>
      <SignInForm />
    </div>
  )
}
