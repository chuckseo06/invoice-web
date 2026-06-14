"use server"

import { revalidatePath } from "next/cache"
import { notion, NOTION_ITEMS_DB_ID, resolveDataSourceId } from "@/lib/notion"
import { pageToInvoiceItem } from "@/lib/notion-helpers"
import { checkRateLimit } from "@/lib/rate-limiter"
import { logDebug, logInfo, logWarn, logError } from "@/lib/logger"
import type { InvoiceItem, CreateInvoiceItemInput } from "@/types"

// Items DB에서 특정 Invoice에 속한 아이템들 조회
export async function getItemsByInvoiceId(invoicePageId: string): Promise<InvoiceItem[]> {
  logDebug("getItemsByInvoiceId", `아이템 조회 시작: ${invoicePageId}`)

  // Rate Limit 체크
  const { allowed, retryAfter } = checkRateLimit("notion-api")
  if (!allowed) {
    const errorMsg = `API 요청 제한 초과 (분당 10회). ${retryAfter}초 후 재시도해주세요.`
    logWarn("getItemsByInvoiceId", "API Rate Limit 도달", {
      invoiceId: invoicePageId,
      retryAfter,
    })
    throw new Error(errorMsg)
  }

  try {
    // database_id → data_source_id 해석 후 조회
    const dataSourceId = await resolveDataSourceId(NOTION_ITEMS_DB_ID)
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      filter: {
        property: "invoice",
        relation: { contains: invoicePageId },
      },
      sorts: [
        {
          property: "sortOrder",
          direction: "ascending",
        },
      ],
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items = (response.results as any[])
      .filter((page) => page.object === "page")
      .map((page) => pageToInvoiceItem(page))

    logInfo("getItemsByInvoiceId", "아이템 조회 성공", {
      invoiceId: invoicePageId,
      itemCount: items.length,
    })
    return items
  } catch (error: unknown) {
    logError("getItemsByInvoiceId", `아이템 조회 실패: ${invoicePageId}`, error)
    throw new Error(`아이템 조회 실패: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// 신규 아이템 생성 (특정 Invoice에 추가)
export async function createInvoiceItem(
  invoicePageId: string,
  data: CreateInvoiceItemInput,
  sortOrder: number = 0
): Promise<InvoiceItem> {
  logDebug("createInvoiceItem", "아이템 생성 시작", {
    invoiceId: invoicePageId,
    name: data.name,
    quantity: data.quantity,
    unitPrice: data.unitPrice,
    sortOrder,
  })

  // Rate Limit 체크
  const { allowed, retryAfter } = checkRateLimit("notion-api")
  if (!allowed) {
    const errorMsg = `API 요청 제한 초과 (분당 10회). ${retryAfter}초 후 재시도해주세요.`
    logWarn("createInvoiceItem", "API Rate Limit 도달", {
      invoiceId: invoicePageId,
      itemName: data.name,
      retryAfter,
    })
    throw new Error(errorMsg)
  }

  try {
    // pages.create는 database_id 사용 (data_source_id 아님)
    const response = await notion.pages.create({
      parent: { database_id: NOTION_ITEMS_DB_ID },
      properties: {
        Name: {
          title: [{ text: { content: data.name } }],
        },
        description: {
          rich_text: [{ text: { content: data.description || "" } }],
        },
        quantity: {
          number: data.quantity,
        },
        unit: {
          rich_text: [{ text: { content: data.unit || "" } }],
        },
        unitPrice: {
          number: data.unitPrice,
        },
        sortOrder: {
          number: sortOrder,
        },
        invoice: {
          relation: [{ id: invoicePageId }],
        },
      },
    })

    const item = pageToInvoiceItem(response)
    revalidatePath("/quotes")
    logInfo("createInvoiceItem", "아이템 생성 성공", {
      itemId: item.id,
      invoiceId: invoicePageId,
      name: item.name,
      subtotal: item.subtotal,
    })
    return item
  } catch (error: unknown) {
    logError("createInvoiceItem", "아이템 생성 실패", error, {
      invoiceId: invoicePageId,
      itemName: data.name,
    })
    throw new Error(`아이템 생성 실패: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// 아이템 수정
export async function updateInvoiceItem(
  pageId: string,
  data: Partial<CreateInvoiceItemInput>
): Promise<void> {
  logDebug("updateInvoiceItem", `아이템 수정 시작: ${pageId}`, { updates: Object.keys(data) })

  // Rate Limit 체크
  const { allowed, retryAfter } = checkRateLimit("notion-api")
  if (!allowed) {
    const errorMsg = `API 요청 제한 초과 (분당 10회). ${retryAfter}초 후 재시도해주세요.`
    logWarn("updateInvoiceItem", "API Rate Limit 도달", {
      itemId: pageId,
      retryAfter,
    })
    throw new Error(errorMsg)
  }

  try {
    const updateProps: Record<string, unknown> = {}

    if (data.name !== undefined) {
      updateProps.Name = {
        title: [{ text: { content: data.name } }],
      }
    }
    if (data.description !== undefined) {
      updateProps.description = {
        rich_text: [{ text: { content: data.description } }],
      }
    }
    if (data.quantity !== undefined) {
      updateProps.quantity = {
        number: data.quantity,
      }
    }
    if (data.unit !== undefined) {
      updateProps.unit = {
        rich_text: [{ text: { content: data.unit } }],
      }
    }
    if (data.unitPrice !== undefined) {
      updateProps.unitPrice = {
        number: data.unitPrice,
      }
    }

    await notion.pages.update({
      page_id: pageId,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      properties: updateProps as any,
    })

    revalidatePath("/quotes")
    logInfo("updateInvoiceItem", "아이템 수정 성공", {
      itemId: pageId,
      updatedFields: Object.keys(data),
    })
  } catch (error: unknown) {
    logError("updateInvoiceItem", `아이템 수정 실패: ${pageId}`, error)
    throw new Error(`아이템 수정 실패: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// 아이템 삭제 (아카이브)
export async function deleteInvoiceItem(pageId: string): Promise<void> {
  logDebug("deleteInvoiceItem", `아이템 삭제 시작: ${pageId}`)

  // Rate Limit 체크
  const { allowed, retryAfter } = checkRateLimit("notion-api")
  if (!allowed) {
    const errorMsg = `API 요청 제한 초과 (분당 10회). ${retryAfter}초 후 재시도해주세요.`
    logWarn("deleteInvoiceItem", "API Rate Limit 도달", {
      itemId: pageId,
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
    logInfo("deleteInvoiceItem", "아이템 삭제 성공", {
      itemId: pageId,
    })
  } catch (error: unknown) {
    logError("deleteInvoiceItem", `아이템 삭제 실패: ${pageId}`, error)
    throw new Error(`아이템 삭제 실패: ${error instanceof Error ? error.message : String(error)}`)
  }
}
