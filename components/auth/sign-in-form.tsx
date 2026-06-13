"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Eye, EyeOff, LogIn, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const signInSchema = z.object({
  email: z.string().email("유효한 이메일 주소를 입력해주세요"),
  password: z
    .string()
    .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
    .max(100, "비밀번호는 100자 이하여야 합니다"),
})

type SignInFormValues = z.infer<typeof signInSchema>

export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function onSubmit(_data: SignInFormValues) {
    try {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("로그인되었습니다! 환영합니다.")
    } catch {
      toast.error("로그인 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="shadow-2xl border-border/50 backdrop-blur-sm">
      <CardHeader className="space-y-3 pb-6">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="size-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold text-muted-foreground tracking-wide uppercase">
            스타터킷
          </span>
        </div>
        <div className="space-y-1.5">
          <CardTitle className="text-2xl font-bold tracking-tight">
            다시 오신 것을 환영합니다
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            이메일과 비밀번호로 계정에 로그인하세요
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-medium">
              이메일
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoComplete="email"
              disabled={isLoading}
              className="h-11 transition-shadow focus-visible:shadow-md"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium">
                비밀번호
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                비밀번호를 잊으셨나요?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                disabled={isLoading}
                className="h-11 pr-10 transition-shadow focus-visible:shadow-md"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-11 font-semibold gap-2 shadow-sm"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                로그인 중...
              </>
            ) : (
              <>
                <LogIn className="size-4" />
                로그인
              </>
            )}
          </Button>
        </form>

        <div className="relative">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
            또는
          </span>
        </div>

        <Button
          variant="outline"
          className="w-full h-11 font-semibold shadow-sm"
          asChild
        >
          <Link href="/sign-up">회원가입</Link>
        </Button>
      </CardContent>

      <CardFooter className="pt-2 pb-6 justify-center">
        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          로그인하면{" "}
          <Link href="/terms" className="underline underline-offset-2 hover:text-foreground transition-colors">
            이용약관
          </Link>{" "}
          및{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground transition-colors">
            개인정보처리방침
          </Link>
          에 동의하게 됩니다.
        </p>
      </CardFooter>
    </Card>
  )
}
