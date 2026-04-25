export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background px-4 py-12 sm:px-6 lg:px-8">
      {/* 배경 장식 블롭 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 size-[500px] rounded-full bg-primary/5 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-40 size-[500px] rounded-full bg-primary/5 blur-3xl"
      />

      <div className="relative w-full max-w-md">{children}</div>
    </div>
  )
}
