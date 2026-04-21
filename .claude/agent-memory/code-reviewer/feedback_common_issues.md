---
name: Common Issues Found
description: Recurring anti-patterns and issues observed in this codebase during initial review
type: feedback
---

1. (app)/layout.tsx uses "use client" unnecessarily at layout level — forces entire app subtree to be client-rendered. Should extract sidebar state to a child wrapper component.

2. useBreakpoint (react-responsive) used alongside Tailwind CSS responsive classes — dual responsibility. AppNavbar uses both isMobile check AND md:hidden class simultaneously. Prefer CSS-only approach where possible.

3. console.log("Form data:", data) left in sign-in-form.tsx onSubmit — credential data logging, security issue.

4. EmptyState component uses <a href> instead of Next.js <Link> for internal navigation action button.

5. Footer.tsx uses new Date().getFullYear() directly in Server Component render — fine for static, but worth noting this runs at build time in static export.

6. AppNavbar has hardcoded user info ("John Doe", "john@example.com", GitHub avatar URL) — expected for starter kit but should be documented.

7. MobileNav imports SheetTrigger but never uses it (Sheet is controlled externally via isOpen prop).

8. sidebar-hover CSS variable used in Sidebar/MobileNav but not defined in globals.css — potential styling bug.

9. StatsCards uses hardcoded green-600/red-600 colors instead of semantic Tailwind theme tokens for dark mode compatibility.

10. LoadingSkeleton uses array index as key — acceptable since list is static/non-reorderable.

**Why:** First full review pass on 2026-04-21.
**How to apply:** Prioritize (app)/layout.tsx "use client" issue and console.log security issue in future reviews.
