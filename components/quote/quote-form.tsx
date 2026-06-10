"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createQuote } from "@/app/actions/notion-quote"

const quoteFormSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요"),
  clientName: z.string().min(1, "클라이언트명을 입력해주세요"),
  amount: z.number().positive("금액은 0보다 커야 합니다"),
  description: z.string().optional(),
  validUntil: z.string().optional(),
})

type QuoteFormValues = z.infer<typeof quoteFormSchema>

export function QuoteForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      title: "",
      clientName: "",
      amount: 0,
      description: "",
      validUntil: "",
    },
  })

  async function onSubmit(data: unknown) {
    const typedData = data as QuoteFormValues
    try {
      setIsLoading(true)
      await createQuote({
        title: typedData.title,
        clientName: typedData.clientName,
        amount: typedData.amount,
        description: typedData.description || undefined,
        validUntil: typedData.validUntil || undefined,
      })
      toast.success("견적서가 생성되었습니다.")
      router.push("/quotes")
    } catch {
      toast.error("견적서 생성에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg">
      <div className="space-y-2">
        <Label htmlFor="title">제목</Label>
        <Input
          id="title"
          {...register("title")}
          disabled={isLoading}
          placeholder="예: 웹사이트 리디자인 프로젝트"
        />
        {errors.title && <p className="text-xs text-destructive mt-1">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="clientName">클라이언트명</Label>
        <Input
          id="clientName"
          {...register("clientName")}
          disabled={isLoading}
          placeholder="예: ABC 스타트업"
        />
        {errors.clientName && (
          <p className="text-xs text-destructive mt-1">{errors.clientName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">금액</Label>
        <Input
          id="amount"
          type="number"
          {...register("amount", { valueAsNumber: true })}
          disabled={isLoading}
          placeholder="0"
          step="1000"
          min="0"
        />
        {errors.amount && <p className="text-xs text-destructive mt-1">{errors.amount.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">설명 (선택)</Label>
        <Textarea
          id="description"
          {...register("description")}
          disabled={isLoading}
          placeholder="견적서에 대한 추가 설명이나 특수사항을 입력해주세요"
          rows={4}
        />
        {errors.description && (
          <p className="text-xs text-destructive mt-1">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="validUntil">유효기간 (선택)</Label>
        <Input
          id="validUntil"
          type="date"
          {...register("validUntil")}
          disabled={isLoading}
        />
        {errors.validUntil && (
          <p className="text-xs text-destructive mt-1">{errors.validUntil.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "생성 중..." : "견적서 생성"}
      </Button>
    </form>
  )
}
