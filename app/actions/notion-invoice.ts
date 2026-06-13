"use server"

import { revalidatePath } from "next/cache"
import { unstable_cache } from "next/cache"
import { v4 as uuidv4 } from "uuid"
import { notion, NOTION_INVOICE_DB_ID } from "@/lib/notion"
import { pageToInvoice } from "@/lib/notion-helpers"
import { checkRateLimit } from "@/lib/rate-limiter"
import { logDebug, logInfo, logWarn, logError } from "@/lib/logger"
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

// 전체 견적서 조회 (60초 캐싱)
const _getInvoices = async (): Promise<Invoice[]> => {
  logDebug("getInvoices", "견적서 목록 조회 시작")

  if (DEMO_MODE) {
    logDebug("getInvoices", "더미 모드 - 데모 데이터 반환", {
      count: DEMO_INVOICES.length,
    })
    return DEMO_INVOICES
  }

  // Rate Limit 체크
  const { allowed, retryAfter } = checkRateLimit("notion-api")
  if (!allowed) {
    const errorMsg = `API 요청 제한 초과 (분당 10회). ${retryAfter}초 후 재시도해주세요.`
    logWarn("getInvoices", "API Rate Limit 도달", { retryAfter })
    throw new Error(errorMsg)
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await (notion.databases.query as any)({
      database_id: NOTION_INVOICE_DB_ID,
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const invoices = (response.results as any[])
      .filter((page) => page.object === "page")
      .map((page) => pageToInvoice(page))

    logInfo("getInvoices", "견적서 목록 조회 성공", {
      count: invoices.length,
      cacheKey: "invoices",
      revalidate: 60,
    })
    return invoices
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logError("getInvoices", "견적서 목록 조회 실패", error)
    throw new Error(`견적서 조회 실패: ${errorMessage}`)
  }
}

export const getInvoices = unstable_cache(_getInvoices, ["invoices"], {
  revalidate: 60, // 60초 캐싱
})

// 별칭 (하위 호환성)
export const getQuotes = getInvoices

// UUID로 단건 조회
export async function getInvoiceByQuoteId(quoteId: string): Promise<Invoice | null> {
  logDebug("getInvoiceByQuoteId", `견적서 단건 조회: ${quoteId}`)

  if (DEMO_MODE) {
    const invoice = DEMO_INVOICES.find((q) => q.quoteId === quoteId) || null
    if (invoice) {
      logInfo("getInvoiceByQuoteId", "더미 모드 - 견적서 찾음", { quoteId })
    } else {
      logWarn("getInvoiceByQuoteId", "더미 모드 - 견적서 없음", { quoteId })
    }
    return invoice
  }

  // Rate Limit 체크
  const { allowed, retryAfter } = checkRateLimit("notion-api")
  if (!allowed) {
    const errorMsg = `API 요청 제한 초과 (분당 10회). ${retryAfter}초 후 재시도해주세요.`
    logWarn("getInvoiceByQuoteId", "API Rate Limit 도달", { quoteId, retryAfter })
    throw new Error(errorMsg)
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
    if (response.results.length === 0) {
      logWarn("getInvoiceByQuoteId", "견적서 없음", { quoteId })
      return null
    }
    const invoice = pageToInvoice(response.results[0])
    logInfo("getInvoiceByQuoteId", "견적서 조회 성공", {
      quoteId,
      invoiceId: invoice.id,
      title: invoice.title,
    })
    return invoice
  } catch (error: unknown) {
    logError("getInvoiceByQuoteId", `견적서 조회 실패: ${quoteId}`, error)
    throw new Error(`견적서 조회 실패: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// 별칭 (하위 호환성)
export const getQuoteByQuoteId = getInvoiceByQuoteId

// 신규 견적서 생성
export async function createInvoice(data: CreateInvoiceInput): Promise<Invoice> {
  logDebug("createInvoice", "견적서 생성 시작", {
    title: data.title,
    clientName: data.clientName,
    itemCount: data.items?.length || 0,
  })

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
    logInfo("createInvoice", "더미 모드 - 견적서 생성 완료", {
      invoiceId: newInvoice.id,
      quoteId: newInvoice.quoteId,
      totalAmount,
    })
    return newInvoice
  }

  // Rate Limit 체크
  const { allowed, retryAfter } = checkRateLimit("notion-api")
  if (!allowed) {
    const errorMsg = `API 요청 제한 초과 (분당 10회). ${retryAfter}초 후 재시도해주세요.`
    logWarn("createInvoice", "API Rate Limit 도달", {
      title: data.title,
      retryAfter,
    })
    throw new Error(errorMsg)
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

    const invoice = pageToInvoice(response)
    logInfo("createInvoice", "견적서 생성 성공", {
      invoiceId: invoice.id,
      quoteId: invoice.quoteId,
      title: invoice.title,
      clientName: invoice.clientName,
      totalAmount: invoice.totalAmount,
    })

    // TODO: items 배열을 Items DB에 생성하고 Relation 연결
    // 이는 notion-item.ts의 createInvoiceItem 함수에서 처리됨

    return invoice
  } catch (error: unknown) {
    logError("createInvoice", "견적서 생성 실패", error, {
      title: data.title,
      clientName: data.clientName,
    })
    throw new Error(
      `견적서 생성 실패: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}

// 별칭 (하위 호환성)
export const createQuote = createInvoice

// 견적서 상태 변경
export async function updateInvoiceStatus(
  pageId: string,
  status: QuoteStatus
): Promise<void> {
  logDebug("updateInvoiceStatus", `상태 변경 시작: ${pageId} → ${status}`)

  if (DEMO_MODE) {
    const invoice = DEMO_INVOICES.find((q) => q.id === pageId)
    if (invoice) {
      const oldStatus = invoice.status
      invoice.status = status
      logInfo("updateInvoiceStatus", "더미 모드 - 상태 변경 완료", {
        invoiceId: pageId,
        oldStatus,
        newStatus: status,
      })
    } else {
      logWarn("updateInvoiceStatus", "더미 모드 - 견적서 없음", { invoiceId: pageId })
    }
    revalidatePath("/quotes")
    return
  }

  // Rate Limit 체크
  const { allowed, retryAfter } = checkRateLimit("notion-api")
  if (!allowed) {
    const errorMsg = `API 요청 제한 초과 (분당 10회). ${retryAfter}초 후 재시도해주세요.`
    logWarn("updateInvoiceStatus", "API Rate Limit 도달", {
      invoiceId: pageId,
      newStatus: status,
      retryAfter,
    })
    throw new Error(errorMsg)
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
    logInfo("updateInvoiceStatus", "상태 변경 성공", {
      invoiceId: pageId,
      newStatus: status,
    })
  } catch (error: unknown) {
    logError("updateInvoiceStatus", `상태 변경 실패: ${pageId} → ${status}`, error)
    throw new Error(
      `상태 변경 실패: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}

// 별칭 (하위 호환성)
export const updateQuoteStatus = updateInvoiceStatus

// 견적서 삭제 (아카이브)
export async function deleteInvoice(pageId: string): Promise<void> {
  logDebug("deleteInvoice", `견적서 삭제 시작: ${pageId}`)

  if (DEMO_MODE) {
    const index = DEMO_INVOICES.findIndex((q) => q.id === pageId)
    if (index > -1) {
      const invoice = DEMO_INVOICES[index]
      DEMO_INVOICES.splice(index, 1)
      logInfo("deleteInvoice", "더미 모드 - 견적서 삭제 완료", {
        invoiceId: pageId,
        title: invoice.title,
      })
    } else {
      logWarn("deleteInvoice", "더미 모드 - 견적서 없음", { invoiceId: pageId })
    }
    revalidatePath("/quotes")
    return
  }

  // Rate Limit 체크
  const { allowed, retryAfter } = checkRateLimit("notion-api")
  if (!allowed) {
    const errorMsg = `API 요청 제한 초과 (분당 10회). ${retryAfter}초 후 재시도해주세요.`
    logWarn("deleteInvoice", "API Rate Limit 도달", {
      invoiceId: pageId,
      retryAfter,
    })
    throw new Error(errorMsg)
  }

  try {
    await notion.pages.update({
      page_id: pageId,
      archived: true,
    })
    revalidatePath("/quotes")
    logInfo("deleteInvoice", "견적서 삭제 성공", {
      invoiceId: pageId,
    })
  } catch (error: unknown) {
    logError("deleteInvoice", `견적서 삭제 실패: ${pageId}`, error)
    throw new Error(
      `견적서 삭제 실패: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}

// 별칭 (하위 호환성)
export const deleteQuote = deleteInvoice
