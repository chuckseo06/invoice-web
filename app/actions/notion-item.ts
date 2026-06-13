"use server"

import { revalidatePath } from "next/cache"
import { notion, NOTION_ITEMS_DB_ID } from "@/lib/notion"
import { pageToInvoiceItem } from "@/lib/notion-helpers"
import type { InvoiceItem, CreateInvoiceItemInput } from "@/types"

// Items DB에서 특정 Invoice에 속한 아이템들 조회
export async function getItemsByInvoiceId(invoicePageId: string): Promise<InvoiceItem[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await (notion.databases.query as any)({
      database_id: NOTION_ITEMS_DB_ID,
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
    return (response.results as any[])
      .filter((page) => page.object === "page")
      .map((page) => pageToInvoiceItem(page))
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`getItemsByInvoiceId(${invoicePageId}) 실패:`, errorMessage)
    throw new Error(`아이템 조회 실패: ${errorMessage}`)
  }
}

// 신규 아이템 생성 (특정 Invoice에 추가)
export async function createInvoiceItem(
  invoicePageId: string,
  data: CreateInvoiceItemInput,
  sortOrder: number = 0
): Promise<InvoiceItem> {
  try {
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

    revalidatePath("/quotes")
    return pageToInvoiceItem(response)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error("createInvoiceItem 실패:", errorMessage)
    throw new Error(`아이템 생성 실패: ${errorMessage}`)
  }
}

// 아이템 수정
export async function updateInvoiceItem(
  pageId: string,
  data: Partial<CreateInvoiceItemInput>
): Promise<void> {
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
      properties: updateProps,
    })

    revalidatePath("/quotes")
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`updateInvoiceItem(${pageId}) 실패:`, errorMessage)
    throw new Error(`아이템 수정 실패: ${errorMessage}`)
  }
}

// 아이템 삭제 (아카이브)
export async function deleteInvoiceItem(pageId: string): Promise<void> {
  try {
    await notion.pages.update({
      page_id: pageId,
      archived: true,
    })

    revalidatePath("/quotes")
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`deleteInvoiceItem(${pageId}) 실패:`, errorMessage)
    throw new Error(`아이템 삭제 실패: ${errorMessage}`)
  }
}
