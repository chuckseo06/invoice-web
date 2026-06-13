"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createQuote } from "@/app/actions/notion-quote"

const itemSchema = z.object({
  name: z.string().min(1, "항목명을 입력해주세요"),
  description: z.string().optional(),
  quantity: z.number().positive("수량은 0보다 커야 합니다"),
  unit: z.string().optional(),
  unitPrice: z.number().positive("단가는 0보다 커야 합니다"),
})

const quoteFormSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요"),
  clientName: z.string().min(1, "클라이언트명을 입력해주세요"),
  description: z.string().optional(),
  validUntil: z.string().optional(),
  items: z.array(itemSchema).min(1, "항목을 1개 이상 추가해주세요"),
})

type QuoteFormValues = z.infer<typeof quoteFormSchema>

export function QuoteForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      title: "",
      clientName: "",
      description: "",
      validUntil: "",
      items: [
        {
          name: "",
          description: "",
          quantity: 1,
          unit: "h",
          unitPrice: 0,
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  })

  const items = watch("items")

  const totalAmount = items.reduce((sum, item) => {
    return sum + ((item?.quantity || 0) * (item?.unitPrice || 0))
  }, 0)

  async function onSubmit(data: QuoteFormValues) {
    try {
      setIsLoading(true)
      const result = await createQuote({
        title: data.title,
        clientName: data.clientName,
        description: data.description || undefined,
        validUntil: data.validUntil || undefined,
        items: data.items,
      })

      if (result.success) {
        toast.success("견적서가 생성되었습니다.")
        router.push("/quotes")
      } else {
        toast.error(result.error || "견적서 생성에 실패했습니다.")
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "예상치 못한 오류가 발생했습니다"
      toast.error(errorMessage)
      console.error("견적서 생성 오류:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
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
        <Label htmlFor="description">설명 (선택)</Label>
        <Textarea
          id="description"
          {...register("description")}
          disabled={isLoading}
          placeholder="견적서에 대한 추가 설명이나 특수사항을 입력해주세요"
          rows={3}
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

      <div className="space-y-4 border-t pt-6">
        <div className="flex justify-between items-center">
          <Label className="text-base font-semibold">항목</Label>
          {errors.items && (
            <p className="text-xs text-destructive">{errors.items.message}</p>
          )}
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="space-y-3 p-4 border rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor={`items.${index}.name`}>항목명</Label>
                <Input
                  id={`items.${index}.name`}
                  {...register(`items.${index}.name`)}
                  disabled={isLoading}
                  placeholder="예: 프론트엔드 개발"
                />
                {errors.items?.[index]?.name && (
                  <p className="text-xs text-destructive">{errors.items[index]?.name?.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`items.${index}.quantity`}>수량</Label>
                <Input
                  id={`items.${index}.quantity`}
                  type="number"
                  {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                  disabled={isLoading}
                  placeholder="0"
                  min="0"
                  step="1"
                />
                {errors.items?.[index]?.quantity && (
                  <p className="text-xs text-destructive">
                    {errors.items[index]?.quantity?.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`items.${index}.unit`}>단위</Label>
                <Input
                  id={`items.${index}.unit`}
                  {...register(`items.${index}.unit`)}
                  disabled={isLoading}
                  placeholder="h / 건 / 식"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`items.${index}.unitPrice`}>단가 (₩)</Label>
                <Input
                  id={`items.${index}.unitPrice`}
                  type="number"
                  {...register(`items.${index}.unitPrice`, { valueAsNumber: true })}
                  disabled={isLoading}
                  placeholder="0"
                  min="0"
                  step="10000"
                />
                {errors.items?.[index]?.unitPrice && (
                  <p className="text-xs text-destructive">
                    {errors.items[index]?.unitPrice?.message}
                  </p>
                )}
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor={`items.${index}.description`}>설명 (선택)</Label>
                <Input
                  id={`items.${index}.description`}
                  {...register(`items.${index}.description`)}
                  disabled={isLoading}
                  placeholder="항목에 대한 추가 설명"
                />
              </div>

              <div className="col-span-2 flex justify-between items-center pt-2">
                <span className="text-sm font-medium">
                  소계: ₩{((items[index]?.quantity || 0) * (items[index]?.unitPrice || 0)).toLocaleString()}
                </span>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => remove(index)}
                    disabled={isLoading}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({
              name: "",
              description: "",
              quantity: 1,
              unit: "h",
              unitPrice: 0,
            })
          }
          disabled={isLoading}
          className="w-full"
        >
          + 항목 추가
        </Button>
      </div>

      <div className="bg-accent p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">총금액</span>
          <span className="text-2xl font-bold text-primary">₩{totalAmount.toLocaleString()}</span>
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "생성 중..." : "견적서 생성"}
      </Button>
    </form>
  )
}
