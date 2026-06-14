import { APIResponseError, isFullDataSource } from "@notionhq/client"
import { notion, NOTION_INVOICE_DB_ID, NOTION_ITEMS_DB_ID, resolveDataSourceId } from "@/lib/notion"

interface TestResult {
  token: { ok: boolean; error?: string }
  invoiceDb: {
    ok: boolean
    error?: string
    suggestion?: string
    resolvedDataSourceId?: string
    properties?: string[]
  }
  itemsDb: {
    ok: boolean
    error?: string
    suggestion?: string
    resolvedDataSourceId?: string
    properties?: string[]
  }
  propertyValidation: {
    expected: string[]
    actual: string[]
    mismatches: string[]
  }
}

export async function GET(): Promise<Response> {
  const result: TestResult = {
    token: { ok: true },
    invoiceDb: { ok: false },
    itemsDb: { ok: false },
    propertyValidation: {
      expected: ["title", "quoteId", "clientName", "description", "status", "validUntil", "totalAmount"],
      actual: [],
      mismatches: [],
    },
  }

  // 1. NOTION_TOKEN 검증
  if (!process.env.NOTION_TOKEN) {
    result.token.ok = false
    result.token.error = "NOTION_TOKEN이 설정되지 않았습니다. Mock 데이터 모드로 실행 중입니다."
    return Response.json(result, { status: 400 })
  }

  // 2. Invoice DB 테스트 (2단계)
  try {
    // Step 1: databases.retrieve로 DB 접근 + data_source_id 추출
    const invoiceDb = await notion.databases.retrieve({ database_id: NOTION_INVOICE_DB_ID })

    if (!("data_sources" in invoiceDb) || !invoiceDb.data_sources || invoiceDb.data_sources.length === 0) {
      throw new Error("Integration이 DB에 연결되지 않음")
    }

    const dataSourceId = invoiceDb.data_sources[0].id
    result.invoiceDb.resolvedDataSourceId = dataSourceId

    // Step 2: dataSources.retrieve로 스키마(properties) 조회
    const invoiceDataSource = await notion.dataSources.retrieve({ data_source_id: dataSourceId })

    const isFullDb = isFullDataSource(invoiceDataSource)
    if (!isFullDb) {
      result.invoiceDb.error = "❌ [권한 부족] Integration이 DB에 대한 읽기 권한이 없습니다"
      result.invoiceDb.suggestion =
        "Notion에서 해당 DB 페이지 → 우측 상단 '...' → 'Connections' → Integration을 'Add connections'로 추가하세요"
      result.invoiceDb.ok = false
      result.invoiceDb.properties = []
    } else {
      result.invoiceDb.ok = true
      const props = invoiceDataSource.properties || {}
      result.invoiceDb.properties = Object.keys(props)
      result.propertyValidation.actual = result.invoiceDb.properties

      // 속성명 검증
      const expectedProps = result.propertyValidation.expected
      const actualProps = result.propertyValidation.actual
      const mismatches: string[] = []

      expectedProps.forEach((prop) => {
        if (!actualProps.includes(prop)) {
          mismatches.push(prop)
        }
      })

      result.propertyValidation.mismatches = mismatches

      console.log("✅ Invoice DB - 정상 접근 가능")
      console.log("Resolved Data Source ID:", dataSourceId)
      console.log("Properties keys:", Object.keys(props))
    }
  } catch (error) {
    result.invoiceDb.ok = false
    result.invoiceDb.properties = []

    if (error instanceof APIResponseError) {
      const status = error.status
      const code = error.code

      if (status === 401) {
        result.invoiceDb.error = "❌ [401 Unauthorized] 토큰 오류"
        result.invoiceDb.suggestion =
          "NOTION_TOKEN을 확인하세요. https://www.notion.so/my-integrations 에서 발급받은 토큰을 사용하세요"
      } else if (status === 403) {
        result.invoiceDb.error = "❌ [403 Forbidden] 접근 권한 없음"
        result.invoiceDb.suggestion =
          "Notion에서 해당 DB 페이지를 우측 상단 '...' → 'Connections' → Integration을 Share하세요"
      } else if (status === 404) {
        result.invoiceDb.error = "❌ [404 Not Found] DB를 찾을 수 없음"
        result.invoiceDb.suggestion =
          "NOTION_INVOICE_DB_ID(.env.local)를 확인하세요. Notion URL에서 정확한 DB ID를 복사했는지 확인하세요"
      } else {
        result.invoiceDb.error = `❌ [${status}] ${code || error.message}`
      }
    } else if (error instanceof Error) {
      if (error.message.includes("Integration이 DB에 연결되지 않음")) {
        result.invoiceDb.error = "❌ [권한 부족] Integration이 DB에 연결되지 않음"
        result.invoiceDb.suggestion =
          "Notion에서 해당 DB 페이지 → 우측 상단 '...' → 'Connections' → Integration을 'Add connections'로 추가하세요"
      } else {
        result.invoiceDb.error = `❌ 오류: ${error.message}`
      }
    } else {
      result.invoiceDb.error = `❌ 오류: ${String(error)}`
    }
  }

  // 3. Items DB 테스트 (2단계)
  try {
    // Step 1: databases.retrieve로 DB 접근 + data_source_id 추출
    const itemsDb = await notion.databases.retrieve({ database_id: NOTION_ITEMS_DB_ID })

    if (!("data_sources" in itemsDb) || !itemsDb.data_sources || itemsDb.data_sources.length === 0) {
      throw new Error("Integration이 DB에 연결되지 않음")
    }

    const dataSourceId = itemsDb.data_sources[0].id
    result.itemsDb.resolvedDataSourceId = dataSourceId

    // Step 2: dataSources.retrieve로 스키마(properties) 조회
    const itemsDataSource = await notion.dataSources.retrieve({ data_source_id: dataSourceId })

    const isFullDb = isFullDataSource(itemsDataSource)
    if (!isFullDb) {
      result.itemsDb.error = "❌ [권한 부족] Integration이 DB에 대한 읽기 권한이 없습니다"
      result.itemsDb.suggestion =
        "Notion에서 해당 DB 페이지를 우측 상단 '...' → 'Connections' → Integration을 Share하세요"
      result.itemsDb.ok = false
      result.itemsDb.properties = []
    } else {
      result.itemsDb.ok = true
      const props = itemsDataSource.properties || {}
      result.itemsDb.properties = Object.keys(props)

      console.log("✅ Items DB - 정상 접근 가능")
      console.log("Resolved Data Source ID:", dataSourceId)
      console.log("Properties keys:", Object.keys(props))
    }
  } catch (error) {
    result.itemsDb.ok = false
    result.itemsDb.properties = []

    if (error instanceof APIResponseError) {
      const status = error.status
      const code = error.code

      if (status === 401) {
        result.itemsDb.error = "❌ [401 Unauthorized] 토큰 오류"
      } else if (status === 403) {
        result.itemsDb.error = "❌ [403 Forbidden] 접근 권한 없음"
        result.itemsDb.suggestion =
          "Notion에서 해당 DB 페이지를 우측 상단 '...' → 'Connections' → Integration을 Share하세요"
      } else if (status === 404) {
        result.itemsDb.error = "❌ [404 Not Found] DB를 찾을 수 없음"
        result.itemsDb.suggestion =
          "NOTION_ITEMS_DB_ID(.env.local)를 확인하세요. Notion URL에서 정확한 DB ID를 복사했는지 확인하세요"
      } else {
        result.itemsDb.error = `❌ [${status}] ${code || error.message}`
      }
    } else if (error instanceof Error) {
      if (error.message.includes("Integration이 DB에 연결되지 않음")) {
        result.itemsDb.error = "❌ [권한 부족] Integration이 DB에 연결되지 않음"
        result.itemsDb.suggestion =
          "Notion에서 해당 DB 페이지 → 우측 상단 '...' → 'Connections' → Integration을 'Add connections'로 추가하세요"
      } else {
        result.itemsDb.error = `❌ 오류: ${error.message}`
      }
    } else {
      result.itemsDb.error = `❌ 오류: ${String(error)}`
    }
  }

  // 4. 최종 진단
  const allOk = result.token.ok && result.invoiceDb.ok && result.itemsDb.ok && result.propertyValidation.mismatches.length === 0

  return Response.json(
    {
      ...result,
      summary: allOk
        ? "✅ Notion API 연동 정상 - 앱이 정상 작동합니다"
        : "❌ Notion API 연동 오류 - 위의 suggestion을 따라 설정을 확인하세요",
    },
    {
      status: allOk ? 200 : 400,
    }
  )
}
