import { Client } from "@notionhq/client"

// Notion API 토큰 검증
const notionToken = process.env.NOTION_TOKEN
if (!notionToken) {
  throw new Error(
    "NOTION_TOKEN 환경변수가 설정되지 않았습니다. .env.local 파일을 확인해주세요."
  )
}

// Notion 데이터베이스 ID 검증
const notionInvoiceDbId = process.env.NOTION_INVOICE_DB_ID
const notionItemsDbId = process.env.NOTION_ITEMS_DB_ID
if (!notionInvoiceDbId || !notionItemsDbId) {
  throw new Error(
    "NOTION_INVOICE_DB_ID와 NOTION_ITEMS_DB_ID 환경변수가 설정되지 않았습니다. .env.local 파일을 확인해주세요."
  )
}

// Notion 클라이언트 싱글톤 인스턴스
export const notion = new Client({
  auth: notionToken,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as any

// Notion 데이터베이스 ID
export const NOTION_INVOICE_DB_ID = notionInvoiceDbId
export const NOTION_ITEMS_DB_ID = notionItemsDbId
