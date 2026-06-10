"use server"

import { revalidatePath } from "next/cache"
import { unstable_cache } from "next/cache"
import { v4 as uuidv4 } from "uuid"
import { notion, NOTION_DATABASE_ID } from "@/lib/notion"
import { pageToQuote } from "@/lib/notion-helpers"
import type { Quote, CreateQuoteInput, QuoteStatus } from "@/types"

// 더미 모드 설정 (UI/UX 테스트용) — 실제 API 연동 시 false로 변경 후 삭제
const DEMO_MODE = true

// 더미 데이터 (UI 테스트용)
const DEMO_QUOTES: Quote[] = [
  {
    id: "demo-1",
    quoteId: "550e8400-e29b-41d4-a716-446655440000",
    title: "웹사이트 리디자인 프로젝트",
    clientName: "ABC 테크",
    amount: 1500000,
    description: "기존 웹사이트의 완전한 리디자인 및 반응형 구현",
    status: "Sent",
    validUntil: "2026-06-30",
    createdDate: "2026-06-01",
  },
  {
    id: "demo-2",
    quoteId: "550e8400-e29b-41d4-a716-446655440001",
    title: "모바일 앱 개발",
    clientName: "XYZ 스타트업",
    amount: 3000000,
    description: "React Native 기반 iOS/Android 앱 개발",
    status: "Draft",
    validUntil: "2026-07-15",
    createdDate: "2026-06-05",
  },
  {
    id: "demo-3",
    quoteId: "550e8400-e29b-41d4-a716-446655440002",
    title: "SEO 최적화",
    clientName: "마케팅 에이전시",
    amount: 800000,
    description: "전체 사이트 SEO 분석 및 최적화",
    status: "Accepted",
    validUntil: "2026-06-20",
    createdDate: "2026-05-20",
  },
  {
    id: "demo-4",
    quoteId: "550e8400-e29b-41d4-a716-446655440003",
    title: "데이터 분석 대시보드",
    clientName: "금융사 A",
    amount: 2500000,
    description: "실시간 데이터 분석 및 시각화 대시보드",
    status: "Rejected",
    validUntil: "2026-06-10",
    createdDate: "2026-05-15",
  },
]

// 전체 견적서 조회 (1시간 캐싱)
const _getQuotes = async (): Promise<Quote[]> => {
  if (DEMO_MODE) {
    return DEMO_QUOTES
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await (notion.databases.query as any)({
      database_id: NOTION_DATABASE_ID,
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (response.results as any[])
      .filter((page) => page.object === "page")
      .map((page) => pageToQuote(page))
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error("getQuotes 실패:", errorMessage)
    throw new Error(`견적서 조회 실패: ${errorMessage}`)
  }
}

export const getQuotes = unstable_cache(_getQuotes, ["quotes"], {
  revalidate: 3600,
})

// UUID로 단건 조회
export async function getQuoteByQuoteId(quoteId: string): Promise<Quote | null> {
  if (DEMO_MODE) {
    return DEMO_QUOTES.find((q) => q.quoteId === quoteId) || null
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await (notion.databases.query as any)({
      database_id: NOTION_DATABASE_ID,
      filter: {
        property: "quoteId",
        rich_text: { equals: quoteId },
      },
    })
    if (response.results.length === 0) return null
    return pageToQuote(response.results[0])
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`getQuoteByQuoteId(${quoteId}) 실패:`, errorMessage)
    throw new Error(`견적서 조회 실패: ${errorMessage}`)
  }
}

// 신규 견적서 생성
export async function createQuote(data: CreateQuoteInput): Promise<Quote> {
  if (DEMO_MODE) {
    const quoteId = uuidv4()
    const newQuote: Quote = {
      id: `demo-${Date.now()}`,
      quoteId,
      title: data.title,
      clientName: data.clientName,
      amount: data.amount,
      description: data.description || "",
      status: "Draft",
      validUntil: data.validUntil || undefined,
      createdDate: new Date().toISOString().split("T")[0],
    }
    DEMO_QUOTES.push(newQuote)
    revalidatePath("/quotes")
    return newQuote
  }

  try {
    const quoteId = uuidv4()
    const response = await notion.pages.create({
      parent: { database_id: NOTION_DATABASE_ID },
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
        amount: {
          number: data.amount,
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
    return pageToQuote(response)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error("createQuote 실패:", errorMessage)
    throw new Error(`견적서 생성 실패: ${errorMessage}`)
  }
}

// 견적서 상태 변경
export async function updateQuoteStatus(
  pageId: string,
  status: QuoteStatus
): Promise<void> {
  if (DEMO_MODE) {
    const quote = DEMO_QUOTES.find((q) => q.id === pageId)
    if (quote) {
      quote.status = status
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
    console.error(`updateQuoteStatus(${pageId}, ${status}) 실패:`, errorMessage)
    throw new Error(`상태 변경 실패: ${errorMessage}`)
  }
}

// 견적서 삭제 (아카이브)
export async function deleteQuote(pageId: string): Promise<void> {
  if (DEMO_MODE) {
    const index = DEMO_QUOTES.findIndex((q) => q.id === pageId)
    if (index > -1) {
      DEMO_QUOTES.splice(index, 1)
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
    console.error(`deleteQuote(${pageId}) 실패:`, errorMessage)
    throw new Error(`견적서 삭제 실패: ${errorMessage}`)
  }
}
