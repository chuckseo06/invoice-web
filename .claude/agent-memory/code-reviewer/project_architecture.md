---
name: Project Architecture
description: Next.js 16 starter kit using Route Groups, shadcn/ui, Tailwind CSS 4, React 19
type: project
---

Route Groups: (marketing) with Navbar+Footer, (app) with Sidebar+AppNavbar, (auth) minimal layout.
Root layout wraps all groups with ThemeProvider + Toaster (Providers component).
(app)/layout.tsx is "use client" due to useSidebar hook — this pushes client boundary up to layout level.

Key files:
- lib/constants.ts — NAV_LINKS, FEATURES, MOCK_STATS, MOCK_ACTIVITY (all typed via types/index.ts)
- lib/utils.ts — cn() using clsx + tailwind-merge
- hooks/use-sidebar.ts — useLocalStorageState for sidebar open state
- hooks/use-breakpoint.ts — useMediaQuery (react-responsive) for responsive detection

**Why:** Starter kit template project, not production app — mock data and placeholder pages are intentional.
**How to apply:** Review suggestions should treat placeholder pages as expected and focus on structural/pattern issues.
