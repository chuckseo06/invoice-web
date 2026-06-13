"use server"

import { revalidatePath } from "next/cache"
import { unstable_cache } from "next/cache"
import { v4 as uuidv4 } from "uuid"
import { notion, NOTION_INVOICE_DB_ID } from "@/lib/notion"
import { pageToInvoice } from "@/lib/notion-helpers"
import type { Invoice, CreateInvoiceInput, QuoteStatus, InvoiceItem } from "@/types"

// 더미 모드 설정 (UI/UX 테스트용) — 실제 API 연동 시 false로 변경 후 삭제
const DEMO_MODE = true

// 더미 데이터 (UI 테스트용)
const DEMO_INVOICES: Invoice[] = [
  {
    id: "demo-1",
    quoteId: "550e8400-e29b-41d4-a716-446655440000",
    title: "웹사이트 리디자인 프로젝트",
    clientName: "ABC 테크",
    totalAmount: 4800000,
    description: "기존 웹사이트의 완전한 리디자인 및 반응형 구현",
    status: "Sent",
    validUntil: "2026-06-30",
    createdDate: "2026-06-01",
    items: [
      {
        id: "item-1",
        name: "프론트엔드 개발",
        description: "React 기반 UI 개발",
        quantity: 80,
        unit: "h",
        unitPrice: 50000,
        subtotal: 4000000,
      },
      {
        id: "item-2",
        name: "UI/UX 디자인",
        description: "와이어프레임 및 디자인",
        quantity: 16,
        unit: "h",
        unitPrice: 50000,
        subtotal: 800000,
      },
    ],
  },
  {
    id: "demo-2",
    quoteId: "550e8400-e29b-41d4-a716-446655440001",
    title: "모바일 앱 개발",
    clientName: "XYZ 스타트업",
    totalAmount: 3000000,
    description: "React Native 기반 iOS/Android 앱 개발",
    status: "Draft",
    validUntil: "2026-07-15",
    createdDate: "2026-06-05",
    items: [
      {
        id: "item-3",
        name: "앱 개발",
        quantity: 60,
        unit: "h",
        unitPrice: 50000,
        subtotal: 3000000,
      },
    ],
  },
  {
    id: "demo-3",
    quoteId: "550e8400-e29b-41d4-a716-446655440002",
    title: "SEO 최적화",
    clientName: "마케팅 에이전시",
    totalAmount: 800000,
    description: "전체 사이트 SEO 분석 및 최적화",
    status: "Accepted",
    validUntil: "2026-06-20",
    createdDate: "2026-05-20",
    items: [
      {
        id: "item-4",
        name: "SEO 분석",
        quantity: 16,
        unit: "h",
        unitPrice: 50000,
        subtotal: 800000,
      },
    ],
  },
  {
    id: "demo-4",
    quoteId: "550e8400-e29b-41d4-a716-446655440003",
    title: "데이터 분석 대시보드",
    clientName: "금융사 A",
    totalAmount: 2500000,
    description: "실시간 데이터 분석 및 시각화 대시보드",
    status: "Rejected",
    validUntil: "2026-06-10",
    createdDate: "2026-05-15",
    items: [
      {
        id: "item-5",
        name: "대시보드 개발",
        quantity: 50,
        unit: "h",
        unitPrice: 50000,
        subtotal: 2500000,
      },
    ],
  },
]

// 전체 견적서 조회 (1시간 캐싱)
const _getInvoices = async (): Promise<Invoice[]> => {
  if (DEMO_MODE) {
    return DEMO_INVOICES
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await (notion.databases.query as any)({
      database_id: NOTION_INVOICE_DB_ID,
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (response.results as any[])
      .filter((page) => page.object === "page")
      .map((page) => pageToInvoice(page))
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error("getInvoices 실패:", errorMessage)
    throw new Error(`견적서 조회 실패: ${errorMessage}`)
  }
}

export const getInvoices = unstable_cache(_getInvoices, ["invoices"], {
  revalidate: 3600,
})

// 별칭 (하위 호환성)
export const getQuotes = getInvoices

// UUID로 단건 조회
export async function getInvoiceByQuoteId(quoteId: string): Promise<Invoice | null> {
  if (DEMO_MODE) {
    return DEMO_INVOICES.find((q) => q.quoteId === quoteId) || null
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await (notion.databases.query as any)({
      database_id: NOTION_INVOICE_DB_ID,
      filter: {
        property: "quoteId",
        rich_text: { equals: quoteId },
      },
    })
    if (response.results.length === 0) return null
    return pageToInvoice(response.results[0])
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`getInvoiceByQuoteId(${quoteId}) 실패:`, errorMessage)
    throw new Error(`견적서 조회 실패: ${errorMessage}`)
  }
}

// 별칭 (하위 호환성)
export const getQuoteByQuoteId = getInvoiceByQuoteId

// 신규 견적서 생성
export async function createInvoice(data: CreateInvoiceInput): Promise<Invoice> {
  if (DEMO_MODE) {
    const quoteId = uuidv4()
    const items: InvoiceItem[] = (data.items || []).map((item, idx) => ({
      id: `demo-item-${Date.now()}-${idx}`,
      name: item.name,
      description: item.description,
      quantity: item.quantity,
      unit: item.unit,
      unitPrice: item.unitPrice,
      subtotal: item.quantity * item.unitPrice,
      sortOrder: idx,
    }))

    const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0)

    const newInvoice: Invoice = {
      id: `demo-${Date.now()}`,
      quoteId,
      title: data.title,
      clientName: data.clientName,
      description: data.description || "",
      status: "Draft",
      validUntil: data.validUntil || undefined,
      createdDate: new Date().toISOString().split("T")[0],
      totalAmount,
      items,
    }
    DEMO_INVOICES.push(newInvoice)
    revalidatePath("/quotes")
    return newInvoice
  }

  try {
    const quoteId = uuidv4()
    const response = await notion.pages.create({
      parent: { database_id: NOTION_INVOICE_DB_ID },
      properties: {
        title: {
          title: [{ text: { content: data.title } }],
        },
        quoteId: {
          rich_text: [{ text: { content: quoteId } }],
        },
        clientName: {
          rich_text: [{ text: { content: data.clientName } }],
        },
        description: {
          rich_text: [{ text: { content: data.description || "" } }],
        },
        status: {
          select: { name: "Draft" },
        },
        ...(data.validUntil && {
          validUntil: {
            date: { start: data.validUntil },
          },
        }),
      },
    })
    revalidatePath("/quotes")

    // TODO: items 배열을 Items DB에 생성하고 Relation 연결
    // 이는 notion-item.ts의 createInvoiceItem 함수에서 처리됨

    return pageToInvoice(response)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error("createInvoice 실패:", errorMessage)
    throw new Error(`견적서 생성 실패: ${errorMessage}`)
  }
}

// 별칭 (하위 호환성)
export const createQuote = createInvoice

// 견적서 상태 변경
export async function updateInvoiceStatus(
  pageId: string,
  status: QuoteStatus
): Promise<void> {
  if (DEMO_MODE) {
    const invoice = DEMO_INVOICES.find((q) => q.id === pageId)
    if (invoice) {
      invoice.status = status
    }
    revalidatePath("/quotes")
    return
  }

  try {
    await notion.pages.update({
      page_id: pageId,
      properties: {
        status: {
          select: { name: status },
        },
      },
    })
    revalidatePath("/quotes")
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`updateInvoiceStatus(${pageId}, ${status}) 실패:`, errorMessage)
    throw new Error(`상태 변경 실패: ${errorMessage}`)
  }
}

// 별칭 (하위 호환성)
export const updateQuoteStatus = updateInvoiceStatus

// 견적서 삭제 (아카이브)
export async function deleteInvoice(pageId: string): Promise<void> {
  if (DEMO_MODE) {
    const index = DEMO_INVOICES.findIndex((q) => q.id === pageId)
    if (index > -1) {
      DEMO_INVOICES.splice(index, 1)
    }
    revalidatePath("/quotes")
    return
  }

  try {
    await notion.pages.update({
      page_id: pageId,
      archived: true,
    })
    revalidatePath("/quotes")
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`deleteInvoice(${pageId}) 실패:`, errorMessage)
    throw new Error(`견적서 삭제 실패: ${errorMessage}`)
  }
}

// 별칭 (하위 호환성)
export const deleteQuote = deleteInvoice
