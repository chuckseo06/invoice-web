# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 개발 환경 및 명령어

### 실행 명령어
- `npm run dev` — 개발 서버 실행 (기본값: http://localhost:3000)
- `npm run build` — 프로덕션 빌드
- `npm run start` — 프로덕션 서버 실행
- `npm run lint` — ESLint 실행

## 프로젝트 구조

### 아키텍처 개요
이 프로젝트는 Next.js App Router의 **Route Groups** 기능을 사용하여 세 가지 주요 섹션으로 나뉩니다:

- **`app/(marketing)/`** — 공개 마케팅 페이지 (홈, 가격, 기능, 블로그, 보안, 약관 등)
- **`app/(app)/`** — 인증된 사용자용 대시보드 섹션 (대시보드, 분석, 사용자, 프로필, 설정)
- **`app/(auth)/`** — 인증 페이지 (로그인)

각 Route Group은 독립적인 `layout.tsx`를 가지므로 다른 UI 구조를 가질 수 있습니다.

### 폴더 구조
```
app/
├── layout.tsx                 # 루트 레이아웃 (Geist 폰트 주입, Providers)
├── globals.css                # Tailwind v4 설정 (@import, @theme inline 블록)
│
├── (marketing)/               # 공개 마케팅 페이지
│   ├── layout.tsx             # Navbar + main + Footer
│   ├── page.tsx               # 홈 (/)
│   ├── about/page.tsx
│   ├── careers/page.tsx
│   ├── blog/page.tsx
│   ├── features/page.tsx
│   ├── pricing/page.tsx
│   ├── security/page.tsx
│   ├── docs/page.tsx
│   ├── api/page.tsx
│   ├── community/page.tsx
│   ├── privacy/page.tsx
│   ├── terms/page.tsx
│   └── cookies/page.tsx
│
├── (app)/                     # 인증된 사용자용 대시보드
│   ├── layout.tsx             # AppShell만 렌더링
│   ├── dashboard/page.tsx
│   ├── analytics/page.tsx
│   ├── users/page.tsx
│   ├── profile/page.tsx
│   └── settings/page.tsx
│
└── (auth)/                    # 인증 페이지
    ├── layout.tsx             # 화면 중앙 정렬 레이아웃
    └── sign-in/page.tsx

components/
├── ui/                        # shadcn/ui 컴포넌트 라이브러리 (20개+)
│   ├── button.tsx, badge.tsx, card.tsx, avatar.tsx
│   ├── input.tsx, label.tsx, textarea.tsx, checkbox.tsx, switch.tsx
│   ├── dialog.tsx, dropdown-menu.tsx, sheet.tsx, tooltip.tsx
│   ├── table.tsx, tabs.tsx, separator.tsx, skeleton.tsx, progress.tsx
│   ├── breadcrumb.tsx, sonner.tsx
│
├── layout/
│   ├── navbar.tsx             # 마케팅 상단 네비바 (Server Component)
│   ├── footer.tsx             # 마케팅 푸터 (Server Component)
│   ├── app-shell.tsx          # 앱 전체 쉘 ("use client", useSidebar)
│   ├── app-navbar.tsx         # 앱용 상단 네비바 ("use client", 햄버거 메뉴)
│   ├── sidebar.tsx            # 데스크탑 사이드바 ("use client", sticky, 64px)
│   └── mobile-nav.tsx         # 모바일 Sheet 네비게이션 ("use client")
│
├── landing/
│   ├── hero-section.tsx       # 홈페이지 Hero
│   ├── features-section.tsx   # 기능 섹션
│   └── cta-section.tsx        # 행동 유도 섹션
│
├── dashboard/
│   ├── stats-cards.tsx        # 통계 카드 (4개, up/down 트렌드)
│   └── activity-table.tsx     # 활동 로그 테이블
│
├── auth/
│   └── sign-in-form.tsx       # 로그인 폼 (react-hook-form + zod)
│
├── common/
│   ├── page-header.tsx        # 페이지 제목/설명 헤더
│   ├── empty-state.tsx        # 빈 상태 표시
│   └── loading-skeleton.tsx   # 로딩 스켈레톤
│
├── providers/
│   └── providers.tsx          # ThemeProvider + Toaster ("use client")
│
└── theme/
    └── theme-toggle.tsx       # 다크/라이트 테마 토글 ("use client")

hooks/
├── use-sidebar.ts             # 사이드바 상태 관리 (localStorage 영속화)
└── use-breakpoint.ts          # Tailwind 브레이크포인트 감지 (md, lg)

lib/
├── utils.ts                   # cn() — clsx + tailwind-merge 조합
└── constants.ts               # NAV_LINKS, FEATURES, MOCK_STATS, MOCK_ACTIVITY

types/
└── index.ts                   # NavLink, Feature, StatCard, ActivityLog
```

## 기술 스택

### 핵심 버전
- **Next.js**: 16.2.2 (App Router)
- **React**: 19.2.4
- **TypeScript**: 5.x
- **Node**: 운영 환경 기준

### UI & 스타일링
- **Tailwind CSS**: 4.x — `tailwindcss` + `@tailwindcss/postcss` (devDependency)
- **tw-animate-css**: ^1.4.0 — Tailwind 애니메이션 유틸리티
- **shadcn**: ^4.1.2 — 컴포넌트 CLI 및 `shadcn/tailwind.css` 임포트
- **radix-ui**: ^1.4.3 — 단일 패키지 (개별 `@radix-ui/react-*`는 사용하지 않음)
- **class-variance-authority**: ^0.7.1 — 컴포넌트 변형 관리
- **clsx**: ^2.1.1 — 조건부 클래스 병합
- **tailwind-merge**: ^3.5.0 — Tailwind 클래스 충돌 해결
- **Lucide React**: ^1.7.0 — 아이콘 라이브러리

### 폼 & 검증
- **react-hook-form**: ^7.72.1 — 폼 상태 관리
- **@hookform/resolvers**: ^5.2.2 — zod 등 스키마 리졸버 연결
- **zod**: ^4.3.6 — TypeScript 우선 스키마 검증

### UI 기능
- **next-themes**: ^0.4.6 — 다크/라이트 테마 관리
- **sonner**: ^2.0.7 — 토스트 알림 (richColors 활성화, 상단 오른쪽)
- **react-responsive**: ^10.0.1 — 미디어 쿼리 기반 반응형 감지

### 상태 관리
- **use-local-storage-state**: ^19.5.0 — localStorage 상태 영속화
- **usehooks-ts**: ^3.1.1 — 유용한 custom hooks 모음 (`useIsClient` 등)

## Tailwind CSS v4 설정

### tailwind.config.ts 없음
Tailwind v4는 `tailwind.config.ts` 파일을 사용하지 않습니다.
설정은 `app/globals.css` 내 `@theme inline` 블록에서 합니다.

### globals.css 구조
```css
@import "tailwindcss";           # Tailwind v4 진입점
@import "tw-animate-css";        # 애니메이션 유틸리티
@import "shadcn/tailwind.css";   # shadcn 기본 스타일

@custom-variant dark (&:is(.dark *));

@theme inline {
  /* CSS 변수 → Tailwind 디자인 토큰 매핑 */
  --color-background: oklch(...);  # bg-background
  --color-foreground: oklch(...);  # text-foreground
  --color-sidebar-*: oklch(...);   # 사이드바 전용 (6종)
  --color-chart-*: oklch(...);     # 차트 전용 (chart-1~5)
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  --radius-*: 1rem;  # sm, md, lg, xl, 2xl, 3xl, 4xl
}
```

### oklch() 색상 시스템
- 모든 색상은 `oklch(L C H)` 함수로 정의됩니다.
- `:root` (라이트 모드) 와 `.dark` 클래스 (다크 모드)로 각각 정의됩니다.
- 이는 `@media (prefers-color-scheme)` 대신 클래스 기반 테마를 사용합니다.

### PostCSS 설정
`@tailwindcss/postcss` v4 플러그인이 활성화되어 있습니다 (`postcss.config.mjs`).

---

## 폰트 설정

`app/layout.tsx`에서 `next/font/google`으로 Geist 폰트를 로드합니다:
```typescript
import { Geist, Geist_Mono } from "next/font/google"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})
```

`<html>` 태그에 변수 주입:
```typescript
<html 
  lang="ko" 
  suppressHydrationWarning
  className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
>
```

`globals.css`의 `@theme` 블록에서 Tailwind 토큰으로 연결:
- `--font-sans: var(--font-geist-sans)` → `font-sans` 유틸리티
- `--font-mono: var(--font-geist-mono)` → `font-mono` 유틸리티

---

## 주요 패턴 및 관례

### Export 규칙
**Named export만 사용합니다.** Default export는 사용하지 않습니다.
(예외: `page.tsx`, `layout.tsx`는 Next.js 규약상 default export 필수)

```typescript
// ✅ 올바른 예
export function MyComponent() { ... }

// ❌ 사용하지 않음
export default function MyComponent() { ... }
```

### Server vs Client Component 구분

**Client Component가 필요한 경우** (`"use client"` 선언):
- React 훅: `useState`, `useEffect`, `useCallback`, `useRef`, `useContext` 등
- 브라우저 이벤트 핸들러: `onClick`, `onChange`, `onSubmit` 등
- 라우트 관련 훅: `usePathname`, `useRouter`, `useSearchParams`
- 테마 훅: `useTheme` (next-themes)
- 폼 훅: `useForm` (react-hook-form)
- 토스트: `toast.success()`, `toast.error()` (sonner)
- localStorage 훅: `useSidebarState`, `useLocalStorageState`

**Server Component** (기본값, `"use client"` 없음):
- 정적 레이아웃 및 콘텐츠 (app 및 layouts의 대부분)
- 마케팅 페이지 섹션 (HeroSection, FeaturesSection 등)
- 순수 표시용 컴포넌트 (PageHeader, EmptyState, StatsCards 등)

### Props 타입 인라인 선언
컴포넌트 파일 내에 `interface XxxProps`로 **인라인 선언**합니다.
별도 types 파일로 분리하지 않습니다 (공유 타입은 `types/index.ts` 사용).

```typescript
interface PageHeaderProps {
  title: string
  description?: string
  className?: string
  children?: React.ReactNode
}

export function PageHeader({ title, description, className, children }: PageHeaderProps) {
  return (
    <div className={className}>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
      {children}
    </div>
  )
}
```

### Lucide 아이콘 동적 렌더링
상수(`constants.ts`)에서 `LucideIcon` 타입으로 아이콘을 저장하고,
컴포넌트에서 대문자 변수로 받아 JSX로 렌더링합니다:

```typescript
// lib/constants.ts
import type { LucideIcon } from "lucide-react"
import { Home, Settings, Users } from "lucide-react"

interface NavLink {
  label: string
  href: string
  icon?: LucideIcon
}

export const NAV_LINKS: NavLink[] = [
  { label: "대시보드", href: "/dashboard", icon: Home },
  { label: "사용자", href: "/users", icon: Users },
  { label: "설정", href: "/settings", icon: Settings },
]

// components/layout/sidebar.tsx
export function Sidebar() {
  return (
    <nav>
      {NAV_LINKS.map((link) => {
        const Icon = link.icon
        return (
          <div key={link.href}>
            {Icon && <Icon className="size-5 shrink-0" />}
            <span>{link.label}</span>
          </div>
        )
      })}
    </nav>
  )
}
```

### Button asChild + Next.js Link
shadcn Button의 `asChild` prop으로 Link 컴포넌트를 감쌉니다.
Button 스타일을 유지하면서 Next.js 라우팅을 사용하는 표준 패턴입니다:

```typescript
import Link from "next/link"
import { Button } from "@/components/ui/button"

// 내부 링크 (Next.js 라우팅)
<Button size="sm" asChild>
  <Link href="/sign-in">시작하기</Link>
</Button>

// 외부 링크 (a 태그 사용)
<Button variant="outline" asChild>
  <a href="https://github.com" target="_blank" rel="noopener noreferrer">
    GitHub
  </a>
</Button>
```

### 폼 처리 (react-hook-form + zod)
```typescript
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const schema = z.object({
  email: z.string().email("유효한 이메일을 입력해주세요"),
  password: z.string().min(8, "8자 이상 입력해주세요"),
})

// z.infer로 타입 자동 추출 — 별도 타입 정의 불필요
type FormValues = z.infer<typeof schema>

export function SignInForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  })

  async function onSubmit(data: FormValues) {
    try {
      setIsLoading(true)
      // API 호출...
      toast.success("로그인 성공")
    } catch (error) {
      toast.error("로그인 실패. 다시 시도해주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input {...register("email")} disabled={isLoading} placeholder="이메일" />
        {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <Input {...register("password")} disabled={isLoading} type="password" placeholder="비밀번호" />
        {errors.password && <p className="text-sm text-destructive mt-1">{errors.password.message}</p>}
      </div>
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "처리 중..." : "로그인"}
      </Button>
    </form>
  )
}
```

### Sonner 토스트
`Toaster` 컴포넌트는 `components/providers/providers.tsx`에서 전역 등록됩니다.
(`position="top-right"`, `richColors` 옵션 활성화)

컴포넌트에서 직접 임포트하여 사용:
```typescript
import { toast } from "sonner"

// 성공 메시지
toast.success("저장되었습니다")

// 오류 메시지
toast.error("오류가 발생했습니다")

// 기타: toast.info(), toast.warning(), toast.loading(), toast.promise() 등
```

### suppressHydrationWarning 패턴
`next-themes`의 다크 모드가 서버/클라이언트 class 불일치를 일으킬 수 있으므로
루트 레이아웃의 `<html>` 태그에 `suppressHydrationWarning`을 **반드시** 추가합니다.
또한 `useIsClient()` 훅 (usehooks-ts)으로 클라이언트 하이드레이션 완료를 감지합니다.

```typescript
<html suppressHydrationWarning>
```

### Tailwind 클래스 병합
조건부 클래스 병합용 `cn()` 함수를 `lib/utils.ts`에서 제공:
```typescript
import { cn } from "@/lib/utils"

<div className={cn("px-4 py-2", isActive && "bg-blue-500", props.className)} />
```

### 테마 지원
`next-themes` 설정됨. 클라이언트 컴포넌트에서:
```typescript
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      테마 전환
    </button>
  )
}
```

## Route Groups의 레이아웃 구조

### (marketing) 섹션
- **파일**: `app/(marketing)/layout.tsx`
- **구조**: `<Navbar>` + `<main>` + `<Footer>` (Server Component)
- **Navbar**: 로고, 네비게이션 링크, 로그인/시작하기 버튼
- **Footer**: 4열 그리드 (회사, 상품, 개발자, 법률)

### (app) 섹션 (대시보드)
- **파일**: `app/(app)/layout.tsx`
- **구조**: `<AppShell>` 하나만 렌더링 (Server Component)
- **AppShell** (`components/layout/app-shell.tsx`, "use client"):
  - `useSidebar` 훅으로 사이드바 open/close 상태 관리 (localStorage 영속화)
  - `<AppNavbar>`: 상단 헤더 (로고, 햄버거 메뉴 버튼, 테마 토글, 아바타)
  - `<Sidebar>`: 데스크톱 사이드바 (`hidden md:flex`, sticky, 64px 너비)
  - `<MobileNav>`: 모바일 Sheet 기반 네비게이션 (`md:hidden`)
  - 반응형: 모바일은 AppNavbar의 햄버거 → Sheet 열림 | 데스크톱은 Sidebar 항상 표시

### (auth) 섹션
- **파일**: `app/(auth)/layout.tsx`
- **구조**: 화면 중앙 정렬 (`flex min-h-screen items-center justify-center`)
- **컨테이너**: `max-w-md` (모바일 친화적)
- **내용**: 로그인 폼만 포함

### 최상위 app/layout.tsx
- **Geist 폰트 로드**: `next/font/google` → CSS 변수 주입
- **html 설정**: `lang="ko"`, `suppressHydrationWarning`, 폰트 변수 className
- **`<Providers>`**: ThemeProvider (next-themes) + Toaster (sonner) 통합
- **body**: `min-h-full flex flex-col` (full height 레이아웃)

## 커스텀 Hooks

### use-sidebar.ts (`hooks/use-sidebar.ts`)
사이드바 열림/닫힘 상태를 localStorage에 저장합니다:
- **라이브러리**: `use-local-storage-state`
- **localStorage 키**: `"sidebar-open"`
- **기본값**: `true` (열림)
- **반환값**: `{ isOpen: boolean, toggle: () => void, close: () => void }`

```typescript
const { isOpen, toggle, close } = useSidebar()
```

### use-breakpoint.ts (`hooks/use-breakpoint.ts`)
Tailwind CSS 브레이크포인트 기반 반응형 감지:
- **라이브러리**: `react-responsive` (`useMediaQuery`)
- **isMobile**: < 768px (md 미만) — 모바일 디바이스
- **isTablet**: 768px ~ 1023px (md ~ lg) — 태블릿
- **isDesktop**: >= 1024px (lg 이상) — 데스크톱

```typescript
const { isMobile, isTablet, isDesktop } = useBreakpoint()
```

---

## Path Alias

`@/*`는 프로젝트 루트를 가리킵니다:
```typescript
import { cn } from "@/lib/utils"
import { Navbar } from "@/components/layout/navbar"
import type { NavLink } from "@/types"
```

---

## 주의사항

- **Tailwind CSS v4**: `tailwind.config.ts` 파일이 **없습니다**. 설정은 `globals.css`의 `@theme inline` 블록에서 합니다. v3 방식(config 파일, `@apply` 커스텀 토큰)과 혼용하지 마세요.
- **radix-ui 단일 패키지**: 이 프로젝트는 `@radix-ui/react-*` 개별 패키지 대신 `radix-ui` 단일 패키지를 사용합니다.
- **shadcn 컴포넌트 추가**: `npx shadcn add [component-name]`으로 추가. `components.json` 설정 기반으로 `components/ui/`에 자동 설치됩니다.
- **React 19**: 서버 컴포넌트, `use()` 훅, 자동 폼 검증 등 최신 기능 사용 가능합니다.
