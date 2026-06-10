import type { Quote, QuoteStatus } from "@/types"

// Rich Text 배열을 문자열로 변환
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getRichTextContent(richText: any[]): string {
  if (!richText || richText.length === 0) {
    return ""
  }
  return richText.map((text) => text.plain_text || "").join("")
}

// Notion 페이지 객체를 Quote 타입으로 변환
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function pageToQuote(page: any): Quote {
  const props = page.properties || {}

  // title: Title 필드 (기본값)
  const title = getRichTextContent(props.title?.title || [])

  // quoteId: Rich Text 필드
  const quoteId = getRichTextContent(props.quoteId?.rich_text || [])

  // clientName: Rich Text 필드
  const clientName = getRichTextContent(props.clientName?.rich_text || [])

  // amount: Number 필드
  const amount = props.amount?.number || 0

  // description: Rich Text 필드
  const description = getRichTextContent(props.description?.rich_text || [])

  // status: Select 필드
  const statusValue = props.status?.select?.name || "Draft"
  const status = statusValue as QuoteStatus

  // validUntil: Date 필드
  const validUntil = props.validUntil?.date?.start || undefined

  // createdDate: Created time (자동 생성)
  const createdDate = page.created_time || undefined

  return {
    id: page.id,
    quoteId,
    title,
    clientName,
    amount,
    description,
    status,
    validUntil,
    createdDate,
  }
}
