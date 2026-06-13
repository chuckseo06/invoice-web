"use client"

import { StatusBadge } from "@/components/quote/status-badge"
import type { Invoice } from "@/types"

interface QuoteDisplayProps {
  invoice: Invoice
}

export function QuoteDisplay({ invoice }: QuoteDisplayProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  return (
    <div
      id="quote-content"
      className="w-full max-w-4xl mx-auto bg-white p-12 print:p-0 print:bg-white"
    >
      {/* 헤더 영역 */}
      <div className="mb-12 border-b pb-8">
        <div className="flex justify-between items-start mb-6 gap-4">
          <div className="flex-1 min-w-0">
            <h1
              className="font-bold text-gray-900"
              style={{
                fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                lineHeight: '1.4',
              }}
            >
              {invoice.title}
            </h1>
            <p className="text-lg text-gray-600 mt-2">견적서</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">견적서 번호</p>
            <p className="text-xs font-mono font-semibold text-gray-900 break-all">
              {invoice.quoteId || "-"}
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">발행일</p>
            <p className="font-semibold text-gray-900">
              {formatDate(invoice.createdDate)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">상태</p>
            <div className="mt-1">
              <StatusBadge status={invoice.status} />
            </div>
          </div>
        </div>
      </div>

      {/* 클라이언트 정보 */}
      <div className="mb-12 grid grid-cols-2 gap-8">
        <div>
          <p className="text-sm font-semibold text-gray-600 uppercase mb-2">
            발신자
          </p>
          <div className="space-y-1">
            <p className="text-lg font-semibold text-gray-900">(주) 프리랜서 스튜디오</p>
            <p className="text-gray-700">서울시 강남구 테헤란로 123</p>
            <p className="text-gray-700">02-1234-5678</p>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-600 uppercase mb-2">
            청구처
          </p>
          <div className="space-y-1">
            <p className="text-lg font-semibold text-gray-900">
              {invoice.clientName}
            </p>
            <p className="text-gray-700">서울시 영등포구 여의나루로 456</p>
            <p className="text-gray-700">02-9876-5432</p>
          </div>
        </div>
      </div>

      {/* 항목 테이블 */}
      <div className="mb-12">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-900">
              <th className="text-left py-3 px-4 font-semibold text-gray-900">
                항목
              </th>
              <th className="text-right py-3 px-4 font-semibold text-gray-900 w-24">
                수량
              </th>
              <th className="text-right py-3 px-4 font-semibold text-gray-900 w-28">
                단가
              </th>
              <th className="text-right py-3 px-4 font-semibold text-gray-900 w-28">
                소계
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice.items && invoice.items.length > 0 ? (
              invoice.items.map((item, index) => (
                <tr key={item.id || index} className="border-b border-gray-200">
                  <td className="py-3 px-4 text-gray-900">
                    <p className="font-medium">{item.name}</p>
                    {item.description && (
                      <p className="text-gray-600 text-xs mt-1">
                        {item.description}
                      </p>
                    )}
                  </td>
                  <td className="text-right py-3 px-4 text-gray-900">
                    {item.quantity} {item.unit || ""}
                  </td>
                  <td className="text-right py-3 px-4 text-gray-900">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="text-right py-3 px-4 font-semibold text-gray-900">
                    {formatCurrency(item.subtotal)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-6 px-4 text-center text-gray-500">
                  항목이 없습니다
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 합계 섹션 */}
      <div className="mb-12 flex justify-end">
        <div className="w-full max-w-xs">
          <div className="flex justify-between py-2 px-4 border-t-2 border-gray-900">
            <p className="font-semibold text-gray-900">합계</p>
            <p className="font-bold text-lg text-gray-900">
              {formatCurrency(invoice.totalAmount)}
            </p>
          </div>
        </div>
      </div>

      {/* 설명 섹션 */}
      {invoice.description && (
        <div className="mb-12 bg-gray-50 p-6 rounded">
          <p className="text-sm font-semibold text-gray-600 uppercase mb-3">
            비고
          </p>
          <p className="text-gray-700 whitespace-pre-wrap">
            {invoice.description}
          </p>
        </div>
      )}

      {/* 하단 정보 */}
      <div className="border-t pt-8 text-sm text-gray-600">
        <div className="flex justify-between mb-4">
          <div>
            <p className="font-semibold text-gray-900">유효기간</p>
            <p>{formatDate(invoice.validUntil)}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-900">생성일</p>
            <p>{formatDate(invoice.createdDate)}</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-6">
          본 견적서는 제시된 조건에 따른 서비스 제공을 위한 견적입니다.
        </p>
      </div>
    </div>
  )
}
