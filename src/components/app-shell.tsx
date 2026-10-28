import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export function AppShell({
  header,
  footer,
  children,
  className,
}: {
  header?: ReactNode
  footer?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-muted/40">
      {header && (
        <header className="sticky top-0 z-40 border-b bg-background/95 pt-[env(safe-area-inset-top)] backdrop-blur">
          <div className="mx-auto w-full max-w-2xl px-4 py-2">{header}</div>
        </header>
      )}
      <main
        className={cn(
          "mx-auto w-full max-w-2xl flex-1 px-4 py-4 sm:py-8",
          !header && "pt-[max(1rem,env(safe-area-inset-top))]",
          className
        )}
      >
        {children}
      </main>
      {footer && (
        <footer className="sticky bottom-0 z-40 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
          <div className="mx-auto w-full max-w-2xl px-4 py-3">{footer}</div>
        </footer>
      )}
    </div>
  )
}

export function PageHeader({
  leading,
  title,
  subtitle,
  trailing,
  children,
}: {
  leading?: ReactNode
  title: ReactNode
  subtitle?: ReactNode
  trailing?: ReactNode
  children?: ReactNode
}) {
  return (
    <div className="space-y-2">
      <div className="flex min-h-10 items-center gap-2">
        {leading}
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold">{title}</div>
          {subtitle && <div className="truncate text-xs text-muted-foreground">{subtitle}</div>}
        </div>
        {trailing}
      </div>
      {children}
    </div>
  )
}
