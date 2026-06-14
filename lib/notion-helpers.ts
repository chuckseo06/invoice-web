import type { Invoice, InvoiceItem, Quote, QuoteStatus } from "@/types"

// Rich Text 배열을 문자열로 변환
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getRichTextContent(richText: any[]): string {
  if (!richText || richText.length === 0) {
    return ""
  }
  return richText.map((text) => text.plain_text || "").join("")
}

// Formula 필드에서 숫자 추출
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getFormulaNumber(prop: any): number {
  return prop?.formula?.number || 0
}

// Rollup 필드에서 숫자 추출
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getRollupNumber(prop: any): number {
  return prop?.rollup?.number || 0
}

// Notion 페이지 객체를 InvoiceItem 타입으로 변환
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function pageToInvoiceItem(page: any): InvoiceItem {
  const props = page.properties || {}

  // Items DB 속성명: Title (not Name), order (not sortOrder)
  const name = getRichTextContent(props.Title?.title || [])
  const description = getRichTextContent(props.description?.rich_text || [])
  const quantity = props.quantity?.number || 0
  const unit = getRichTextContent(props.unit?.rich_text || [])
  const unitPrice = props.unitPrice?.number || 0
  const subtotal = getFormulaNumber(props.subtotal)
  const invoiceId = props.invoice?.relation?.[0]?.id || undefined
  const sortOrder = props.order?.number || undefined

  return {
    id: page.id,
    name,
    description: description || undefined,
    quantity,
    unit: unit || undefined,
    unitPrice,
    subtotal,
    invoiceId,
    sortOrder,
  }
}

// Notion 페이지 객체를 Invoice 타입으로 변환
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function pageToInvoice(page: any, items?: InvoiceItem[]): Invoice {
  const props = page.properties || {}

  const title = getRichTextContent(props.title?.title || [])
  const quoteId = getRichTextContent(props.quoteId?.rich_text || [])
  const clientName = getRichTextContent(props.clientName?.rich_text || [])
  const description = getRichTextContent(props.description?.rich_text || [])
  const statusValue = props.status?.select?.name || "Draft"
  const status = statusValue as QuoteStatus
  const validUntil = props.validUntil?.date?.start || undefined
  const createdDate = page.created_time || undefined
  const totalAmount = getRollupNumber(props.totalAmount)

  return {
    id: page.id,
    quoteId,
    title,
    clientName,
    description: description || undefined,
    status,
    validUntil,
    createdDate,
    totalAmount,
    items,
  }
}

// 하위 호환성: pageToQuote를 pageToInvoice의 wrapper로 유지
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function pageToQuote(page: any): Quote {
  return pageToInvoice(page)
}
