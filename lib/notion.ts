import { Client } from "@notionhq/client"

// Notion API 토큰 (없으면 더미 토큰, 실제 API 호출 전에 검증됨)
const notionToken = process.env.NOTION_TOKEN || "dummy_token_for_demo_mode"

// Notion 데이터 소스 ID
// @notionhq/client 신버전(2025-09-03+)에서 "database"와 "data_source" 개념이 분리됨
// - databases.retrieve({ database_id }) → data_sources 배열 반환 (ID 해석용)
// - dataSources.retrieve({ data_source_id }) → properties 있음 (스키마 조회)
// - dataSources.query({ data_source_id }) → 페이지 목록 조회
// - pages.create({ parent: { database_id } }) → 페이지 생성 (database_id 사용)
// 환경변수 이름은 하위 호환성을 위해 NOTION_*_DB_ID로 유지 (저장값은 database_id)
const notionInvoiceDbId = process.env.NOTION_INVOICE_DB_ID || "dummy_invoice_db_id"
const notionItemsDbId = process.env.NOTION_ITEMS_DB_ID || "dummy_items_db_id"

// Notion 클라이언트 싱글톤 인스턴스
export const notion = new Client({
  auth: notionToken,
})

// Notion 데이터베이스 ID (환경변수 이름은 DB_ID로 유지, 저장값은 database_id)
export const NOTION_INVOICE_DB_ID = notionInvoiceDbId
export const NOTION_ITEMS_DB_ID = notionItemsDbId

// database_id → data_source_id 해석 캐시 (API 호출 최소화)
const dataSourceIdCache = new Map<string, string>()

// database_id를 data_source_id로 해석
// databases.retrieve()에서 data_sources[0].id를 추출해 캐싱
export async function resolveDataSourceId(databaseId: string): Promise<string> {
  if (dataSourceIdCache.has(databaseId)) {
    return dataSourceIdCache.get(databaseId)!
  }

  const db = await notion.databases.retrieve({ database_id: databaseId })

  if (!("data_sources" in db) || !db.data_sources || db.data_sources.length === 0) {
    throw new Error(
      `Database ${databaseId}에 data_source가 없습니다. ` +
        `Notion에서 해당 DB를 Integration과 Share했는지 확인하세요.`
    )
  }

  const dsId = db.data_sources[0].id
  dataSourceIdCache.set(databaseId, dsId)
  return dsId
}
