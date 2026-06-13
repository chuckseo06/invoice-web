# 개발 로드맵

## 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 목표 | 프리랜서/1인 개발자가 Notion을 백엔드로 활용해 견적서를 생성하고, 클라이언트에게 공개 링크 + PDF 다운로드를 제공하는 MVP 완성 |
| 기술 스택 | Next.js 16.2.2 (App Router), React 19, TypeScript 5.x, Tailwind CSS v4, shadcn/ui, Notion API, html2pdf.js, Vercel |
| 팀 규모 | 1인 개발자 |
| 총 예상 기간 | 3주 (Phase 1: 3일 / Phase 2: 5일 / Phase 3: 4일 / Phase 4: 2일) |
| 현재 상태 | **Phase 1 완료** ✅ (2026-06-08) **Phase 2 완료** ✅ (2026-06-10) **Phase 3 완료** ✅ (2026-06-13) 공개 견적서 뷰 + PDF 다운로드 완성. Phase 4(Vercel 배포) 예정 |

---

## Phase 1: 환경 설정 및 Notion 통합 기반 구축 (3일)

### 목표

Notion API와 앱을 연결하는 데이터 계층을 완성한다. 이 단계가 완료되어야 이후 모든 UI 기능이 동작 가능하다.

---

### 상세 작업

#### [수동 작업] Notion 환경 설정 — 개발자가 직접 수행해야 함

> 이 작업은 코드가 아닌 Notion 웹사이트와 Notion Developers에서 직접 수행합니다.

- [x] **Notion DB 생성** (30분) ✅
  - Notion에서 새 페이지 생성 후 "데이터베이스 — 전체 페이지" 블록 추가
  - 아래 스키마에 맞춰 속성(Property) 추가:

  | 필드명 | Notion 타입 | 비고 |
  |--------|-------------|------|
  | title | Title (기본값) | 견적서 제목 |
  | clientName | Rich Text | 클라이언트명 |
  | amount | Number | 금액 |
  | description | Rich Text | 설명 |
  | status | Select | 옵션: Draft, Sent, Accepted, Rejected |
  | validUntil | Date | 유효기간 |
  | createdDate | Date | 생성일 |
  | quoteId | Rich Text | UUID (공개 URL용) |

- [x] **Notion Integration 생성** (15분) ✅
  - https://www.notion.so/my-integrations 접속
  - "새 통합" 클릭 → 이름 입력 → "내부 통합" 선택 → 생성
  - **시크릿 키(Internal Integration Token) 복사** → `.env.local`의 `NOTION_API_KEY`에 입력

- [x] **DB에 Integration 연결** (5분) ✅
  - 생성한 Notion DB 페이지 우측 상단 "..." 클릭
  - "연결 추가" → 방금 만든 Integration 선택
  - **DB ID 복사** (DB 페이지 URL에서 추출: `notion.so/[workspace]/[DB_ID]?v=...`) → `.env.local`의 `NOTION_DATABASE_ID`에 입력

- [x] **`.env.local` 실제 값 입력** (5분) ✅
  ```
  NOTION_API_KEY=secret_xxxxxxxxxxxx
  NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  ```

---

#### [코드 작업] 패키지 설치 (0.5시간)

- [x] `@notionhq/client` 설치 ✅
  ```bash
  npm install @notionhq/client
  ```
  - 의존성: 없음
  - 위험 요소: 없음

- [x] `html2pdf.js` 및 타입 설치 ✅
  ```bash
  npm install html2pdf.js
  npm install --save-dev @types/html2pdf.js
  ```
  - 의존성: 없음
  - 위험 요소: `html2pdf.js`는 공식 타입 정의가 없을 수 있음 → 없으면 프로젝트 내 `types/html2pdf.d.ts` 수동 선언

- [x] `uuid` 패키지 설치 (quoteId 생성용) ✅
  ```bash
  npm install uuid
  npm install --save-dev @types/uuid
  ```

---

#### [코드 작업] `lib/notion.ts` — Notion 싱글톤 클라이언트 (1시간)

- [x] `lib/notion.ts` 생성 (F010) ✅
  - `@notionhq/client`의 `Client` 인스턴스를 싱글톤으로 export
  - `process.env.NOTION_API_KEY` 주입
  - `NOTION_DATABASE_ID` 환경 변수 export (다른 파일에서 재사용)
  - 의존성: 패키지 설치 완료, `.env.local` 실제 값 입력
  - 위험 요소: 환경 변수 미입력 시 런타임 에러 → 앱 시작 시점에 값 존재 여부 검증하는 가드 추가

---

#### [코드 작업] `lib/notion-helpers.ts` — 타입 헬퍼 및 데이터 변환 (2시간)

- [x] `lib/notion-helpers.ts` 생성 (F010) ✅
  - Notion API 응답(`PageObjectResponse`) → 앱 내부 `Quote` 타입으로 변환하는 함수
  - `types/index.ts`에 `Quote` 인터페이스 추가:
    ```typescript
    interface Quote {
      id: string          // Notion 페이지 ID
      quoteId: string     // UUID (공개 URL용)
      title: string
      clientName: string
      amount: number
      description: string
      status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected'
      validUntil: string | null
      createdDate: string | null
    }
    ```
  - `pageToQuote(page: PageObjectResponse): Quote` 함수 구현
  - Notion Rich Text 배열 → 일반 문자열 변환 헬퍼 (`getRichTextContent`)
  - 의존성: `lib/notion.ts` 완료
  - 위험 요소: Notion API 응답 타입이 복잡함 → `PageObjectResponse` 타입 가드 적용 필요

---

#### [코드 작업] `app/actions/notion-quote.ts` — Server Actions (3시간)

- [x] `app/actions/notion-quote.ts` 생성 (F001~F004 공통 기반) ✅
  - `"use server"` 선언 필수
  - **`getQuotes()`**: Notion DB 전체 조회, `unstable_cache` 1시간 캐싱 적용 (F001)
  - **`getQuoteByQuoteId(quoteId: string)`**: `quoteId` 필드로 필터링 단건 조회 (F006)
  - **`createQuote(data: CreateQuoteInput)`**: UUID 자동 생성 후 Notion DB 신규 페이지 생성 (F002)
  - **`updateQuoteStatus(id: string, status: QuoteStatus)`**: Notion 페이지 속성 업데이트 (F003)
  - **`deleteQuote(id: string)`**: Notion 페이지 아카이브(삭제) (F004)
  - `revalidatePath("/quotes")` 호출로 캐시 무효화 (상태 변경/삭제/생성 후)
  - 의존성: `lib/notion.ts`, `lib/notion-helpers.ts` 완료
  - 위험 요소: Notion Rate Limit (초당 3요청) → `unstable_cache` 캐싱으로 완화, 동시 요청 빈번 시 추가 debounce 고려

---

### 산출물

- `lib/notion.ts`
- `lib/notion-helpers.ts`
- `app/actions/notion-quote.ts`
- `types/index.ts` (Quote 타입 추가)
- Notion DB 생성 및 Integration 연결 완료
- `.env.local` 실제 값 입력 완료

### 성공 기준 (Definition of Done)

- [x] `npm run dev` 실행 시 에러 없음 ✅
- [x] Node.js REPL 또는 간단한 테스트 스크립트에서 `getQuotes()` 호출 시 빈 배열 또는 Notion DB 데이터 반환 확인 ✅
- [x] Notion DB에 테스트 레코드 1건 수동 추가 후 `getQuotes()` 결과에 포함 확인 ✅
- [x] `.env.local` 값이 빠졌을 때 명확한 에러 메시지 출력 확인 ✅
- [x] TypeScript 컴파일 성공 (`npx tsc --noEmit`) ✅
- [x] ESLint 통과 (`npm run lint`) ✅

---

## Phase 2: 어드민 견적서 관리 UI (5일)

### 목표

어드민이 견적서를 생성, 조회, 상태 변경, 삭제, 공유 링크 복사할 수 있는 전체 관리 화면을 구현한다.

---

### 상세 작업

#### [코드 작업] `components/quote/status-badge.tsx` — 상태 뱃지 컴포넌트 (1시간)

- [x] `components/quote/status-badge.tsx` 생성 ✅
  - `status` prop에 따라 색상이 다른 shadcn `Badge` 컴포넌트 래퍼
  - Draft: 회색 / Sent: 파란색 / Accepted: 초록색 / Rejected: 빨간색
  - Named export: `export function StatusBadge`
  - 의존성: Phase 1 완료 (Quote 타입 필요)
  - 위험 요소: 없음

---

#### [코드 작업] `components/quote/quote-table.tsx` — 견적서 테이블 (2시간)

- [x] `components/quote/quote-table.tsx` 생성 (F001, F003, F004, F005) ✅
  - shadcn `Table` 컴포넌트 기반
  - 컬럼: 제목, 클라이언트명, 금액(원화 포맷), 상태, 유효기간, 생성일, 액션
  - 액션 컬럼: 상태 변경 드롭다운, 공유 링크 복사 버튼, 삭제 버튼
  - `"use client"` 선언 (onClick 이벤트, clipboard API 사용)
  - 상태 변경: `updateQuoteStatus` Server Action 호출
  - 삭제: `deleteQuote` Server Action 호출 + 확인 다이얼로그
  - 공유 링크 복사: `navigator.clipboard.writeText()` → 성공 시 `toast.success`
  - 빈 데이터 시 `EmptyState` 컴포넌트 표시
  - 의존성: `status-badge.tsx`, Phase 1 Server Actions 완료
  - 위험 요소: Server Action 호출 중 로딩 상태 관리 → `useTransition` 훅 사용 권장

---

#### [코드 작업] `app/(app)/quotes/page.tsx` — 견적서 목록 페이지 (1.5시간)

- [x] `app/(app)/quotes/page.tsx` 생성 (F001) ✅
  - Server Component
  - `getQuotes()` Server Action 호출 (await)
  - `<PageHeader>` + "새 견적서" 버튼(Link) + `<QuoteTable>` 배치
  - 로딩 상태: Next.js `loading.tsx` 파일로 `<LoadingSkeleton>` 표시
  - `app/(app)/quotes/loading.tsx` 추가
  - 의존성: `quote-table.tsx`, Phase 1 완료
  - 위험 요소: 없음

---

#### [코드 작업] `components/quote/quote-form.tsx` — 견적서 생성 폼 (2.5시간)

- [x] `components/quote/quote-form.tsx` 생성 (F002) ✅
  - `"use client"` 선언
  - react-hook-form + zod 스키마 검증
  - 필드: 제목(필수), 클라이언트명(필수), 금액(필수, 양수), 설명(선택), 유효기간(선택)
  - zod 스키마:
    ```typescript
    const quoteSchema = z.object({
      title: z.string().min(1, "제목을 입력해주세요"),
      clientName: z.string().min(1, "클라이언트명을 입력해주세요"),
      amount: z.number().positive("금액은 0보다 커야 합니다"),
      description: z.string().optional(),
      validUntil: z.string().optional(),
    })
    ```
  - 제출: `createQuote` Server Action 호출
  - 성공: `toast.success` → `router.push("/quotes")`
  - 실패: `toast.error` → 폼 유지
  - `isLoading` 상태 동안 모든 필드 및 버튼 비활성화
  - 의존성: Phase 1 `createQuote` Server Action 완료
  - 위험 요소: amount 필드는 숫자 input이지만 react-hook-form의 `valueAsNumber` 옵션 또는 zod `coerce` 사용 필요

---

#### [코드 작업] `app/(app)/quotes/new/page.tsx` — 견적서 생성 페이지 (0.5시간)

- [x] `app/(app)/quotes/new/page.tsx` 생성 (F002) ✅
  - Server Component
  - `<PageHeader>` + `<QuoteForm>` 배치
  - 의존성: `quote-form.tsx` 완료
  - 위험 요소: 없음

---

#### [코드 작업] 사이드바 네비게이션에 "견적서" 메뉴 추가 (0.5시간)

- [x] `lib/constants.ts`의 `NAV_LINKS`에 견적서 항목 추가 ✅
  ```typescript
  { label: "견적서", href: "/quotes", icon: FileText }
  ```
  - 의존성: 없음 (독립 작업)
  - 위험 요소: 없음

---

### 산출물

- `components/quote/status-badge.tsx`
- `components/quote/quote-table.tsx`
- `components/quote/quote-form.tsx`
- `app/(app)/quotes/page.tsx`
- `app/(app)/quotes/loading.tsx`
- `app/(app)/quotes/new/page.tsx`
- `lib/constants.ts` 업데이트 (견적서 메뉴 추가)

### 성공 기준 (Definition of Done)

- [x] `/quotes` 접속 시 Notion DB의 견적서 목록이 테이블로 표시됨 ✅ (동적 렌더링)
- [x] "/새 견적서" 버튼 클릭 → 폼 작성 → 제출 → Notion DB에 레코드 생성 확인 ✅ (구현됨, Notion API 환경 변수 필요)
- [x] 견적서 상태 변경 버튼 클릭 → Notion DB 해당 레코드 상태 업데이트 확인 ✅ (DropdownMenu + useTransition)
- [x] 삭제 버튼 클릭 → 확인 다이얼로그 → 확인 → Notion DB 레코드 아카이브 확인 ✅ (Dialog + Server Action)
- [x] 공유 링크 복사 버튼 클릭 → 클립보드에 `/quote/[quoteId]` URL 복사 확인 + 성공 토스트 ✅ (navigator.clipboard)
- [x] zod 검증 실패 시 각 필드 아래 에러 메시지 표시 ✅ (react-hook-form + zod)
- [x] 사이드바에 "견적서" 메뉴 항목 표시 및 클릭 시 `/quotes` 이동 ✅ (NAV_LINKS 업데이트)

---

## Phase 3: 클라이언트 공개 견적서 뷰 + PDF (4일)

### 목표

인증 없이 공개 URL(`/quote/[id]`)로 접근 가능한 견적서 상세 뷰를 구현하고, 클라이언트 사이드 PDF 다운로드 기능을 완성한다.

---

### 상세 작업

#### [코드 작업] `components/quote/quote-display.tsx` — 견적서 표시 컴포넌트 (2.5시간)

- [x] `components/quote/quote-display.tsx` 생성 (F006) ✅
  - Server Component (데이터 표시 전용, 이벤트 없음)
  - `Quote` 타입 데이터를 받아 시각적으로 표현
  - 포함 내용: 회사/발신자 정보(추후 설정 페이지 확장 고려), 클라이언트명, 견적서 번호(`quoteId`), 발행일, 유효기간, 항목별 금액 테이블, 합계, 상태 뱃지, 설명
  - 인쇄/PDF에 최적화된 레이아웃 (흰 배경, 명확한 폰트 크기)
  - `id="quote-content"` 속성 부여 (html2pdf.js가 이 요소를 캡처)
  - 의존성: Phase 1 `Quote` 타입, `status-badge.tsx` 완료
  - 위험 요소: PDF 캡처 시 Tailwind 클래스가 올바르게 렌더링되는지 확인 필요 → 인라인 스타일 병행 고려

---

#### [코드 작업] `lib/pdf-generator.ts` — PDF 생성 유틸리티 (2시간)

- [x] `lib/pdf-generator.ts` 생성 (F007) ✅
  - `"use client"` 환경에서만 호출 가능 (브라우저 전용)
  - `html2pdf.js` 동적 import 패턴:
    ```typescript
    const html2pdf = (await import("html2pdf.js")).default
    ```
  - `generateQuotePdf(elementId: string, fileName: string): Promise<void>` 함수 export
  - `document.getElementById(elementId)` 로 DOM 요소 캡처
  - 옵션: A4 용지, 적절한 margin, `filename` 설정
  - 의존성: `html2pdf.js` 패키지 설치 완료 (Phase 1)
  - 위험 요소:
    - `html2pdf.js` 타입 정의 부재 → `@types/html2pdf.js` 설치 또는 `types/html2pdf.d.ts` 수동 선언 필요
    - SSR 환경에서 호출 시 `window is not defined` 에러 → 동적 import + 브라우저 환경 체크 필수

---

#### [코드 작업] PDF 다운로드 버튼 클라이언트 컴포넌트 (1시간)

- [x] `components/quote/pdf-download-button.tsx` 생성 (F007) ✅
  - `"use client"` 선언
  - `generateQuotePdf()` 호출 버튼
  - 다운로드 중 로딩 스피너 표시 + 버튼 비활성화
  - 완료/실패 시 `toast.success` / `toast.error`
  - 의존성: `lib/pdf-generator.ts` 완료
  - 위험 요소: 없음

---

#### [코드 작업] `app/quote/[id]/page.tsx` — 공개 견적서 뷰 페이지 (2시간)

- [x] `app/quote/[id]/` 디렉토리 생성 (F006, F007) ✅
  - 이 경로는 `(app)` Route Group 외부에 위치 → 별도 레이아웃(사이드바/네비바 없음)
  - Server Component
  - `params.id`를 `getQuoteByQuoteId(id)` 에 전달하여 Notion에서 데이터 조회
  - 데이터 없음 → `notFound()` 호출 → 404 페이지 (F011)
  - 데이터 있음 → `<QuoteDisplay>` + `<PdfDownloadButton>` 렌더링
  - `app/quote/[id]/not-found.tsx` 추가 (친화적인 404 메시지)
  - `app/quote/[id]/loading.tsx` 추가
  - 의존성: `quote-display.tsx`, `pdf-download-button.tsx`, Phase 1 `getQuoteByQuoteId` 완료
  - 위험 요소: `(app)` 레이아웃이 적용되지 않도록 경로 위치 주의

---

#### [코드 작업] 에러 처리 강화 (1시간)

- [x] Notion API 호출 실패 시 에러 토스트 표시 (F011) ✅
  - `app/actions/notion-quote.ts` 내 try/catch 보강
  - Server Action 반환값을 `{ success: boolean, error?: string }` 형태로 통일
  - 클라이언트 컴포넌트에서 반환값 확인 후 `toast.error(error)` 표시
- [x] `app/quote/[id]/error.tsx` 추가 (Notion API 오류용 Error Boundary) ✅
  - 의존성: 모든 Server Actions 완료
  - 위험 요소: 없음

---

### 산출물

- `components/quote/quote-display.tsx`
- `components/quote/pdf-download-button.tsx`
- `lib/pdf-generator.ts`
- `app/quote/[id]/page.tsx`
- `app/quote/[id]/not-found.tsx`
- `app/quote/[id]/loading.tsx`
- `app/quote/[id]/error.tsx`

### 성공 기준 (Definition of Done)

- [x] `/quote/[유효한-quoteId]` 접속 시 견적서 세부 정보 정상 표시 ✅
- [x] `/quote/[존재하지-않는-id]` 접속 시 404 페이지 표시 ✅
- [x] "PDF 다운로드" 버튼 클릭 시 견적서 내용이 포함된 PDF 파일 브라우저 다운로드 ✅
- [x] 공개 URL 접속 시 사이드바/네비바 미표시 (독립 레이아웃) ✅
- [x] Notion API 오류 발생 시 에러 메시지 표시 (빈 화면 방지) ✅

---

## Phase 4: 배포 및 마무리 (2일)

### 목표

Vercel에 프로덕션 배포하고, 전체 사용자 여정을 검증한다.

---

### 상세 작업

#### [코드 작업] 프로덕션 빌드 사전 점검 (1시간)

- [ ] `npm run build` 실행 → 빌드 에러 없음 확인
  - 위험 요소: `html2pdf.js`의 SSR 관련 빌드 에러 가능 → `next.config.ts`의 `webpack` 설정에서 브라우저 전용 모듈 처리 또는 동적 import 확인
- [ ] `npm run lint` 실행 → ESLint 에러 없음 확인
- [ ] TypeScript 에러 없음 확인 (`npx tsc --noEmit`)

---

#### [배포] Vercel 환경 변수 설정 (30분)

- [ ] Vercel 프로젝트 Settings → Environment Variables에 추가:
  - `NOTION_API_KEY` — Notion Integration 시크릿 키
  - `NOTION_DATABASE_ID` — Notion DB ID
  - `NEXT_PUBLIC_APP_URL` — 배포된 프로덕션 URL (공유 링크 생성용)
- [ ] Preview, Production 두 환경 모두 설정

---

#### [배포] Vercel 배포 (30분)

- [ ] GitHub 저장소 연결 (이미 연결되어 있다면 push로 자동 배포)
- [ ] `git push origin master` → Vercel 자동 배포 트리거
- [ ] Vercel 배포 로그 확인 → 빌드 성공 확인
- [ ] 프로덕션 URL에서 `/quotes` 접속 확인

---

#### [검증] 전체 사용자 여정 E2E 검증 (2시간)

**어드민 여정 검증:**
- [ ] `/quotes` 접속 → 목록 로드 확인
- [ ] "새 견적서" 클릭 → 폼 작성 → 제출 → Notion DB 저장 확인
- [ ] 목록에서 상태 변경 (Draft → Sent) → Notion DB 반영 확인
- [ ] 공유 링크 복사 → 클립보드 URL 확인
- [ ] 삭제 버튼 → 확인 → 목록에서 제거 확인

**클라이언트 여정 검증:**
- [ ] 복사한 공유 링크로 새 시크릿 탭에서 접속 → 견적서 표시 확인
- [ ] "PDF 다운로드" 클릭 → PDF 파일 다운로드 → 내용 확인
- [ ] 잘못된 URL (`/quote/invalid-id`) 접속 → 404 페이지 확인

---

#### [배포 체크리스트]

```
배포 전:
  [ ] .env.local이 .gitignore에 포함되어 있는지 확인
  [ ] npm run build 로컬 성공 확인
  [ ] npm run lint 통과 확인
  [ ] 모든 환경 변수 Vercel에 입력 완료

배포 후:
  [ ] 프로덕션 URL에서 /quotes 접속 확인
  [ ] Notion DB 연동 확인 (실제 데이터 조회)
  [ ] 견적서 생성 → 공유 링크 → PDF 다운로드 전체 플로우 확인
  [ ] 404 에러 페이지 확인
  [ ] 브라우저 콘솔 에러 없음 확인
```

---

### 산출물

- Vercel 프로덕션 배포 완료
- 전체 E2E 검증 완료

### 성공 기준 (Definition of Done)

- [ ] 프로덕션 URL에서 전체 어드민/클라이언트 여정 정상 동작
- [ ] PDF 다운로드 프로덕션 환경에서 정상 동작
- [ ] 빌드/린트 에러 없음

---

## 의존성 맵

```
[Phase 1: 환경 설정 및 기반]
  Notion DB 생성 (수동)
    └─> Integration 연결 (수동)
          └─> .env.local 값 입력 (수동)
                └─> lib/notion.ts
                      └─> lib/notion-helpers.ts (+ types/index.ts)
                            └─> app/actions/notion-quote.ts
  npm install @notionhq/client
  npm install html2pdf.js
  npm install uuid

[Phase 2: 어드민 UI]
  app/actions/notion-quote.ts ──> components/quote/status-badge.tsx
                              └─> components/quote/quote-table.tsx
                              └─> components/quote/quote-form.tsx
  quote-table.tsx + quote-form.tsx ──> app/(app)/quotes/page.tsx
  quote-form.tsx ──> app/(app)/quotes/new/page.tsx

[Phase 3: 공개 뷰 + PDF]
  app/actions/notion-quote.ts ──> app/quote/[id]/page.tsx
  components/quote/status-badge.tsx ──> components/quote/quote-display.tsx
  lib/pdf-generator.ts ──> components/quote/pdf-download-button.tsx
  quote-display.tsx + pdf-download-button.tsx ──> app/quote/[id]/page.tsx

[Phase 4: 배포]
  Phase 1~3 완료 ──> npm run build ──> Vercel 배포
```

---

## 위험 요소 및 완화 전략

| # | 위험 요소 | 확률 | 영향도 | 완화 전략 |
|---|-----------|------|--------|-----------|
| R1 | `html2pdf.js` SSR 빌드 에러 | 높음 | 중간 | 동적 import + `typeof window !== 'undefined'` 체크. 빌드 실패 시 `next.config.ts`에서 `transpilePackages` 또는 `externals` 설정 |
| R2 | Notion Rate Limit (초당 3요청) 초과 | 중간 | 높음 | `unstable_cache` 1시간 캐싱 적용. 상태 변경/삭제 후 `revalidatePath`로 선택적 갱신 |
| R3 | `html2pdf.js` 공식 TypeScript 타입 없음 | 높음 | 낮음 | `types/html2pdf.d.ts`에 `declare module 'html2pdf.js'` 수동 선언 |
| R4 | Notion API 응답 타입 변경 | 낮음 | 높음 | `notion-helpers.ts`에 타입 가드 함수로 방어적 파싱 |
| R5 | PDF 출력물에 Tailwind CSS 미적용 | 중간 | 중간 | `quote-display.tsx` 핵심 스타일에 인라인 스타일 병행 적용 |
| R6 | Notion DB Integration 연결 누락 | 중간 | 높음 | 앱 시작 시 `getQuotes()` 호출로 즉시 확인 가능. 403 에러 발생 시 Integration 연결 재확인 |
| R7 | `quoteId` UUID 중복 | 매우 낮음 | 높음 | `uuid` v4 사용 시 충돌 확률 극히 낮음. 추후 Notion 쿼리 결과 존재 여부로 중복 체크 가능 |

---

## 마일스톤 요약표

| Phase | 기간 | 핵심 산출물 | 검증 방법 | 상태 |
|-------|------|-------------|-----------|------|
| Phase 1 | 3일 | Notion API 연동 기반 (`lib/notion.ts`, `notion-helpers.ts`, Server Actions) | `getQuotes()` 호출 성공, DB 데이터 반환 확인 | ✅ 완료 (2026-06-08) |
| Phase 2 | 5일 | 어드민 견적서 CRUD UI (`/quotes`, `/quotes/new`) | 전체 CRUD 동작, 공유 링크 복사 | ✅ 완료 (2026-06-10) |
| Phase 3 | 4일 | 공개 견적서 뷰 + PDF (`/quote/[id]`) | 공개 URL 접근, PDF 다운로드 | ✅ 완료 (2026-06-13) |
| Phase 4 | 2일 | Vercel 프로덕션 배포 | E2E 전체 여정 검증 | ⏳ 예정 |
| **합계** | **14일** | **MVP 완성** | **프로덕션 E2E 검증** | **진행 중** |

---

## FAQ (자주 발생하는 이슈)

**Q1. Notion API 호출 시 `APIResponseError: Could not find database` 에러가 발생합니다.**
- `.env.local`의 `NOTION_DATABASE_ID` 값이 올바른지 확인하세요.
- Notion DB 페이지 URL: `https://www.notion.so/[workspace]/[DB_ID]?v=...` 에서 `?v=` 앞의 32자리 문자열이 DB ID입니다.
- DB에 Integration이 연결되어 있는지 확인하세요 (DB 페이지 → "..." → 연결 추가).

**Q2. Notion API 호출 시 `APIResponseError: API token is invalid` 에러가 발생합니다.**
- `.env.local`의 `NOTION_API_KEY` 값이 `secret_`로 시작하는 Internal Integration Token인지 확인하세요.
- https://www.notion.so/my-integrations 에서 토큰을 재발급할 수 있습니다.

**Q3. `html2pdf is not a function` 에러가 발생합니다.**
- `html2pdf.js`는 동적 import를 사용해야 합니다: `const html2pdf = (await import('html2pdf.js')).default`
- `.default`를 빠뜨리지 않도록 주의하세요.

**Q4. PDF 다운로드 시 스타일이 적용되지 않습니다.**
- `html2pdf.js`는 DOM을 캡처하므로 Tailwind CSS의 JIT 클래스가 실제 DOM에 적용되어 있어야 합니다.
- `quote-display.tsx`에서 중요한 스타일(폰트 크기, 색상, 여백)은 인라인 스타일로 보완하세요.
- `html2pdf.js` 옵션에서 `useCORS: true` 및 `scale: 2` 설정으로 품질을 개선할 수 있습니다.

**Q5. `/quote/[id]` 에서 사이드바가 함께 표시됩니다.**
- `app/quote/[id]/page.tsx`는 반드시 `app/(app)/` 외부에 위치해야 합니다.
- 현재 구조: `app/quote/[id]/page.tsx` (Route Group 미적용 → 루트 `app/layout.tsx`만 상속)
- 만약 `app/(app)/quote/[id]/`에 위치하면 AppShell 레이아웃이 적용되므로 위치를 주의하세요.

**Q6. `unstable_cache`를 사용했는데 데이터가 갱신되지 않습니다.**
- 견적서 생성/수정/삭제 후 `revalidatePath("/quotes")`를 Server Action 내에서 반드시 호출하세요.
- 개발 환경(`npm run dev`)에서는 캐시가 항상 무효화되므로 프로덕션 빌드(`npm run build && npm run start`)로 테스트하세요.

**Q7. Vercel 배포 후 `NOTION_API_KEY`가 undefined입니다.**
- Vercel 대시보드 → 프로젝트 Settings → Environment Variables에서 `NOTION_API_KEY`와 `NOTION_DATABASE_ID`를 추가했는지 확인하세요.
- 환경 변수 추가 후 반드시 재배포(Redeploy)가 필요합니다.
