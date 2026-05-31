# Invoice/Quote Management System MVP PRD

## 핵심 정보

**목적**: 프리랜서 및 1인 개발자가 Notion을 백엔드로 활용해 견적서를 생성하고, 클라이언트에게 공개 링크로 공유하여 PDF 다운로드까지 제공하는 문제를 해결한다.
**사용자**: 클라이언트에게 견적서를 발행하는 1인 개발자/프리랜서(어드민), 견적서 링크를 전달받는 외부 클라이언트

---

## 사용자 여정

### 어드민 여정

1. 견적서 목록 페이지 방문
   ↓ Notion DB에서 견적서 목록 로드

2. 견적서 목록 확인
   ↓ "새 견적서" 버튼 클릭

3. 견적서 생성 폼 작성 (제목, 클라이언트명, 금액, 설명, 유효기간)
   ↓ 폼 제출 → Server Actions → Notion DB 저장

   [저장 성공] → 성공 토스트 표시 → 견적서 목록 페이지 리다이렉트
   [저장 실패] → 에러 토스트 표시 → 폼 유지

4. 견적서 목록 페이지에서 생성된 견적서 확인
   ↓ 상태 변경 버튼 클릭 (Draft → Sent)

5. 공유 링크 복사 → 클라이언트에게 수동 전달 (이메일/메신저)
   ↓ 완료

### 클라이언트 여정

1. 어드민이 전달한 공개 링크 클릭 (`/quote/[id]`)
   ↓ Notion API에서 견적서 데이터 로드 (캐시 활용)

   [유효한 ID] → 견적서 상세 뷰 표시
   [유효하지 않은 ID] → 404 에러 페이지

2. 견적서 세부 정보 확인 (제목, 클라이언트명, 금액, 설명, 유효기간, 생성일)
   ↓ PDF 다운로드 버튼 클릭

3. PDF 클라이언트 사이드 생성 → 브라우저 네이티브 다운로드
   ↓ 완료

---

## 기능 명세

### 1. MVP 핵심 기능

| ID | 기능명 | 설명 | MVP 필수 이유 | 관련 페이지 |
|----|--------|------|-------------|------------|
| **F001** | 견적서 목록 조회 | Notion DB에서 전체 견적서를 읽어 테이블로 표시, 상태별 필터링 | 어드민의 핵심 작업 공간 | 견적서 목록 페이지 |
| **F002** | 견적서 생성 | react-hook-form + zod 검증 폼으로 Notion DB에 신규 견적서 저장 | 서비스의 핵심 입력 기능 | 견적서 생성 폼 페이지 |
| **F003** | 견적서 상태 변경 | Draft/Sent/Accepted/Rejected 상태를 Server Actions로 Notion DB 업데이트 | 견적서 라이프사이클 관리 필수 | 견적서 목록 페이지 |
| **F004** | 견적서 삭제 | 선택한 견적서를 Notion DB에서 삭제 (Server Actions) | 잘못 생성된 견적서 관리 | 견적서 목록 페이지 |
| **F005** | 공유 링크 복사 | 견적서의 공개 URL(`/quote/[id]`)을 클립보드에 복사 | 클라이언트 공유 핵심 수단 | 견적서 목록 페이지 |
| **F006** | 클라이언트 견적서 조회 | UUID 기반 공개 URL로 로그인 없이 견적서 세부 정보 표시 | 클라이언트 접근의 유일한 방법 | 클라이언트 견적서 뷰 페이지 |
| **F007** | PDF 다운로드 | 견적서를 클라이언트 사이드에서 PDF로 생성하여 네이티브 다운로드 | 클라이언트가 공식 문서 보관 필요 | 클라이언트 견적서 뷰 페이지 |

### 2. MVP 필수 지원 기능

| ID | 기능명 | 설명 | MVP 필수 이유 | 관련 페이지 |
|----|--------|------|-------------|------------|
| **F010** | Notion API 통합 | `lib/notion.ts` 싱글톤 클라이언트, `lib/notion-helpers.ts` 타입 헬퍼, `unstable_cache` 1시간 캐싱 | 모든 데이터 읽기/쓰기의 기반 | 견적서 목록 페이지, 클라이언트 견적서 뷰 페이지 |
| **F011** | 에러/로딩 상태 처리 | 잘못된 Quote ID 404 처리, Notion API 오류 에러 토스트, 로딩 스켈레톤 | 사용자 경험 최소 보장 | 견적서 목록 페이지, 클라이언트 견적서 뷰 페이지 |

### 3. MVP 이후 기능 (제외)

- 이메일 발송 자동화 (Resend, SendGrid 등)
- 고급 분석 대시보드
- 다국어 지원
- 전자 서명 기능
- 결제 링크 통합
- 견적서 수정 페이지 (현재는 Notion에서 직접 수정)
- 어드민 인증 (현재 경로 보안 없음)

---

## 메뉴 구조

```
어드민 내비게이션 (인증 없음, 내부 접근 전제)
├── 견적서 목록
│   └── 기능: F001 (견적서 목록 조회), F003 (상태 변경), F004 (삭제), F005 (링크 복사)
└── 새 견적서
    └── 기능: F002 (견적서 생성)

클라이언트 공개 접근 (인증 불필요)
└── 견적서 뷰 (/quote/[id])
    └── 기능: F006 (견적서 조회), F007 (PDF 다운로드), F011 (에러 처리)

공통 인프라 (UI에 노출되지 않음)
└── Notion API 레이어
    └── 기능: F010 (Notion API 통합)
```

---

## 페이지별 상세 기능

### 견적서 목록 페이지

> **구현 기능:** `F001`, `F003`, `F004`, `F005`, `F010`, `F011` | **접근:** 어드민 전용

| 항목 | 내용 |
|------|------|
| **역할** | 어드민이 모든 견적서를 한눈에 관리하는 핵심 작업 공간 |
| **진입 경로** | 직접 URL 입력(`/quotes`) 또는 사이드바 내비게이션 |
| **사용자 행동** | 견적서 목록 확인, 상태 필터 적용, 상태 변경, 공유 링크 복사, 견적서 삭제, 새 견적서 생성 페이지 이동 |
| **주요 기능** | - Notion DB에서 전체 견적서 조회 (`unstable_cache` 캐싱 적용)<br>- 테이블 표시: 제목, 클라이언트명, 금액(₩), 상태 뱃지, 유효기간, 생성일<br>- 상태 필터 탭 (전체 / Draft / Sent / Accepted / Rejected)<br>- 상태 변경 드롭다운 (Select 컴포넌트, Server Actions 호출)<br>- 공유 링크 복사 버튼 (클립보드 API, 성공 토스트)<br>- 삭제 버튼 (확인 다이얼로그 → Server Actions 호출)<br>- **"새 견적서"** 버튼 → 견적서 생성 폼 페이지 이동<br>- 로딩 스켈레톤 (Skeleton 컴포넌트) |
| **다음 이동** | "새 견적서" 클릭 → 견적서 생성 폼 페이지, 삭제 성공 → 목록 갱신, 상태 변경 성공 → 인라인 갱신 |

---

### 견적서 생성 폼 페이지

> **구현 기능:** `F002`, `F010`, `F011` | **접근:** 어드민 전용

| 항목 | 내용 |
|------|------|
| **역할** | 새 견적서를 입력받아 Notion DB에 저장하는 전용 폼 페이지 |
| **진입 경로** | 견적서 목록 페이지의 "새 견적서" 버튼 클릭 |
| **사용자 행동** | 폼 필드 입력 후 제출, 실패 시 에러 확인 후 수정 |
| **주요 기능** | - 폼 필드: 견적서 제목(필수), 클라이언트명(필수), 금액(숫자, 필수), 프로젝트 설명(텍스트에리어), 유효기간(날짜 피커, 필수)<br>- react-hook-form + zod 클라이언트 검증 (필수값, 금액 양수 검증)<br>- 제출 시 UUID 자동 생성 → Server Actions → Notion DB 저장<br>- 초기 상태 자동 설정 (Draft)<br>- 성공: 성공 토스트 → 견적서 목록 페이지 리다이렉트<br>- 실패: 에러 토스트 → 폼 유지<br>- **"저장"** 버튼 (로딩 스피너 포함)<br>- **"취소"** 버튼 → 견적서 목록 페이지 이동 |
| **다음 이동** | 저장 성공 → 견적서 목록 페이지, 취소 → 견적서 목록 페이지 |

---

### 클라이언트 견적서 뷰 페이지

> **구현 기능:** `F006`, `F007`, `F010`, `F011` | **인증:** 불필요 (공개 URL)

| 항목 | 내용 |
|------|------|
| **역할** | 어드민이 공유한 링크로 클라이언트가 견적서를 확인하고 PDF를 다운로드하는 전용 공개 페이지 |
| **진입 경로** | 어드민이 전달한 공개 URL (`/quote/[id]`) 직접 접근 |
| **사용자 행동** | 견적서 세부 정보 확인, PDF 다운로드 버튼 클릭 |
| **주요 기능** | - UUID(`id`)로 Notion DB 조회 (`unstable_cache` 캐싱 적용)<br>- 유효하지 않은 ID → Next.js `notFound()` → 404 페이지<br>- 세부 정보 표시: 견적서 제목, 견적서 번호(Quote ID), 클라이언트명, 금액(₩, 포맷팅), 프로젝트 설명, 유효기간, 생성일<br>- 세련된 카드 레이아웃 (회사 로고 자리 표시, shadcn Card 컴포넌트)<br>- 상태 뱃지 (Accepted/Rejected/Sent 등)<br>- **"PDF 다운로드"** 버튼 → html2pdf.js 클라이언트 사이드 실행 → 네이티브 파일 다운로드<br>- PDF 레이아웃: 회사 로고 영역, 견적서 제목, 견적서 번호, 생성일, 클라이언트명, 금액 테이블, 설명, 유효기간 |
| **다음 이동** | PDF 다운로드 성공 → 페이지 유지 (새 탭 열지 않음), 유효하지 않은 ID → 404 페이지 |

---

## 데이터 모델

### Quote (Notion 데이터베이스 스키마)

| 필드 | 설명 | 타입/관계 |
|------|------|----------|
| id | Notion 페이지 고유 ID | UUID (Notion 자동) |
| title | 견적서 제목 | Title (Notion) |
| clientName | 클라이언트명 | Rich Text |
| amount | 총 금액 (₩) | Number |
| description | 프로젝트 설명 및 항목 | Rich Text |
| status | 견적서 상태 | Select (Draft / Sent / Accepted / Rejected) |
| validUntil | 유효기간 | Date |
| createdDate | 생성일 | Date |
| quoteId | 공유용 고유 ID (공개 URL용) | Rich Text (UUID, 수동 생성) |

### QuoteRow (TypeScript 타입 - `lib/notion-helpers.ts`)

| 필드 | 설명 | 타입/관계 |
|------|------|----------|
| id | Notion 페이지 ID | string |
| quoteId | 공개 URL용 UUID | string |
| title | 견적서 제목 | string |
| clientName | 클라이언트명 | string |
| amount | 금액 | number |
| description | 설명 | string |
| status | 상태 | "Draft" / "Sent" / "Accepted" / "Rejected" |
| validUntil | 유효기간 | string (ISO 8601) |
| createdDate | 생성일 | string (ISO 8601) |

---

## 기술 스택 (최신 버전)

### 프론트엔드 프레임워크

- **Next.js 16.2.2** (App Router) - Server Components, Server Actions, `unstable_cache` 활용
- **TypeScript 5.x** - 타입 안전성 (`@notionhq/client` 스키마 호환)
- **React 19** - 서버 컴포넌트, `use()` 훅 등 최신 기능

### 스타일링 & UI

- **Tailwind CSS v4** - 설정 파일 없는 CSS 엔진 (`globals.css` @theme 블록)
- **shadcn/ui** - Card, Table, Badge, Select, Dialog, Skeleton, Button, Input, Textarea, Tabs 컴포넌트
- **Lucide React** - 아이콘 (Copy, Download, Trash2, Plus 등)

### 폼 & 검증

- **React Hook Form 7.x** - 견적서 생성 폼 상태 관리
- **Zod** - 스키마 검증 (제목 필수, 금액 양수, 날짜 유효성)
- **@hookform/resolvers** - zod 리졸버 연결

### 외부 API & 데이터

- **@notionhq/client** - Notion 공식 SDK (`lib/notion.ts` 싱글톤 클라이언트)
- **Next.js `unstable_cache`** - Notion API 쿼리 캐싱 (1시간 revalidate)

### PDF 생성

- **html2pdf.js** - 클라이언트 사이드 HTML-to-PDF 변환 및 네이티브 다운로드

### 알림

- **sonner** - 성공/에러 토스트 (richColors, position="top-right")

### 배포 & 호스팅

- **Vercel** - Next.js 16 최적화 배포 플랫폼

---

## 환경 변수 설정

```
# .env.local
NOTION_TOKEN=secret_xxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 파일 구조 (신규 추가)

```
app/
├── (app)/
│   └── quotes/
│       ├── page.tsx              # F001, F003, F004, F005 - 어드민 목록
│       └── new/
│           └── page.tsx          # F002 - 견적서 생성 폼
│
└── quote/
    └── [id]/
        └── page.tsx              # F006, F007 - 클라이언트 공개 뷰

app/actions/
└── notion-quote.ts               # Server Actions (생성/삭제/상태변경)

lib/
├── notion.ts                     # Notion 클라이언트 싱글톤
├── notion-helpers.ts             # Notion 응답 → QuoteRow 타입 변환
└── pdf-generator.ts              # html2pdf.js 래퍼 유틸

components/
└── quote/
    ├── quote-form.tsx            # 생성 폼 컴포넌트 ("use client")
    ├── quote-display.tsx         # 클라이언트 뷰 컴포넌트 (PDF 포함, "use client")
    ├── quote-table.tsx           # 어드민 목록 테이블 컴포넌트
    └── status-badge.tsx          # 상태 뱃지 컴포넌트
```

---

## 구현 시 주의사항

- Notion 데이터베이스는 사용자가 직접 생성 후 Integration에 공유 권한 부여 필요
- `quoteId` (UUID)는 Notion DB의 Rich Text 필드로 저장하며, 공개 URL 조회 시 이 값으로 필터링
- PDF 생성은 `"use client"` 컴포넌트에서 처리 (브라우저 환경에서만 동작)
- Notion API Rate Limiting: 초당 3 요청 제한 → `unstable_cache`로 불필요한 API 호출 최소화
- 클라이언트 공개 URL(`/quote/[id]`)은 어드민 Route Group(`(app)`) 외부에 위치하여 별도 인증 레이아웃 적용 없음
- `html2pdf.js`는 서버 사이드 번들 제외 필요 → 동적 import(`import()`) 패턴 사용
