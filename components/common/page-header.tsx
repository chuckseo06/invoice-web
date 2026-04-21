interface PageHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
}

export function PageHeader({
  title,
  description,
  children,
}: PageHeaderProps) {
  return (
    <div className="space-y-4 mb-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-2">{description}</p>
          )}
        </div>
      </div>
      {children && <div>{children}</div>}
    </div>
  )
}
