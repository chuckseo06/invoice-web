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
app/                     # Next.js App Router 페이지 및 레이아웃
├── (marketing)/         # 공개 페이지
├── (app)/              # 대시보드/앱 페이지
└── (auth)/             # 로그인 페이지

components/
├── ui/                 # shadcn/ui 컴포넌트 라이브러리
├── layout/             # Navbar, Sidebar, Footer 등 레이아웃 컴포넌트
├── landing/            # 마케팅 페이지 섹션 (Hero, Features, CTA)
├── dashboard/          # 대시보드 UI 컴포넌트
├── auth/               # 인증 폼
├── common/             # 공유 컴포넌트 (PageHeader, EmptyState 등)
├── providers/          # Context providers (ThemeProvider, Toaster)
└── theme/              # 테마 토글

hooks/                  # 커스텀 React hooks

lib/
├── utils.ts            # 유틸리티 함수 (cn() for Tailwind class 병합)
└── constants.ts        # 상수 정의

types/                  # TypeScript 타입 정의
```

## 기술 스택

### 핵심 버전
- **Next.js**: 16.2.2 (App Router)
- **React**: 19.2.4
- **TypeScript**: 5.x
- **Node**: 운영 환경 기준

### UI & 스타일링
- **Tailwind CSS**: 4.x (최신)
- **shadcn/ui**: 컴포넌트 라이브러리
- **Radix UI**: 헤드리스 UI 원시 요소
- **Lucide React**: 아이콘 라이브러리
- **class-variance-authority**: 컴포넌트 변형 관리

### 폼 & 검증
- **react-hook-form**: 7.72.1
- **@hookform/resolvers**: 폼 검증 리졸버
- **zod**: 4.3.6 — 스키마 검증

### UI 기능
- **next-themes**: 다크/라이트 테마 관리
- **sonner**: 토스트 알림 (상단 오른쪽 기본 위치)
- **react-responsive**: 반응형 레이아웃

### 상태 관리
- **use-local-storage-state**: 로컬 스토리지 상태 관리
- **usehooks-ts**: 유용한 custom hooks 라이브러리

## 주요 패턴 및 관례

### 컴포넌트 패턴
- **UI 컴포넌트** (`components/ui/`): `"use client"` 지시어 사용, shadcn/ui 기반
- **페이지 컴포넌트**: 서버 컴포넌트 (명시하지 않으면 기본값)
- **레이아웃 컴포넌트**: 서버 컴포넌트, Providers 감싸기

### 폼 처리
```typescript
// react-hook-form + zod 조합
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const schema = z.object({
  email: z.string().email(),
})

export function MyForm() {
  const form = useForm({
    resolver: zodResolver(schema),
  })
  // ...
}
```

### Tailwind 클래스 병합
클래스 충돌 해결용 `cn()` 함수를 `lib/utils.ts`에서 제공:
```typescript
import { cn } from "@/lib/utils"

<div className={cn("px-4", props.className)} />
```

### 테마 지원
`next-themes` 설정됨. 클라이언트 컴포넌트에서:
```typescript
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  // ...
}
```

## Route Groups의 레이아웃 구조

각 route group의 `layout.tsx`는 해당 섹션의 네비게이션과 UI를 담당합니다:
- `(marketing)/layout.tsx` — 공개 페이지용 Navbar + Footer
- `(app)/layout.tsx` — 대시보드용 Sidebar + AppNavbar
- `(auth)/layout.tsx` — 인증 페이지용 최소 레이아웃

최상위 `app/layout.tsx`는 모든 Route Group을 감싸며, Providers(테마, 토스트)를 제공합니다.

## Path Alias

`@/*`는 프로젝트 루트를 가리킵니다:
```typescript
import { cn } from "@/lib/utils"
import { Navbar } from "@/components/layout/navbar"
```

## 주의사항

- **Next.js 16**: 최신 버전이므로 [Next.js 16 docs](https://nextjs.org/docs)에서 현재 API 확인
- **Tailwind CSS 4**: 이전 버전과 호환성 차이 가능 — 공식 문서 참조
- **React 19**: 최신 React 기능(서버 컴포넌트, use 훅 등) 활용 가능
