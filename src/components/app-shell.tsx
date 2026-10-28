import { ChevronLeftIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { TabBar } from '@/components/tab-bar'
import { IS_INSTALLED_APP } from '@/lib/display-mode'
import { cn } from '@/lib/utils'

export function AppShell({
  header,
  footer,
  aboveFooter,
  children,
  className,
}: {
  header?: ReactNode
  footer?: ReactNode
  aboveFooter?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <div className="fixed inset-x-0 top-(--viewport-top,0px) flex h-(--viewport-height,100dvh) flex-col overflow-hidden bg-muted/40">
      {header && (
        <header className="relative z-40 mx-auto w-full max-w-2xl shrink-0 px-1 pt-[calc(env(safe-area-inset-top)+1.2rem)]">
          <div className="relative rounded-2xl border bg-background px-4 py-2 shadow-lg shadow-black/5 has-[[data-slot=collapsible-content]]:rounded-b-none has-[[data-slot=collapsible-content]]:border-b-transparent">
            {header}
          </div>
        </header>
      )}
      <main
        data-scroll-container
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
      >
        <div
          className={cn(
            'mx-auto w-full max-w-2xl px-4 py-4 sm:py-8',
            !header && 'pt-[max(1rem,env(safe-area-inset-top))]',
            className,
          )}
        >
          {children}
        </div>
      </main>
      <footer className="relative z-40 w-full shrink-0">
        <div className="mx-auto w-full max-w-2xl space-y-2 px-1 pb-2 in-data-keyboard-open:pb-1">
          {aboveFooter}
          {footer && (
            <div className="rounded-lg shadow-lg shadow-black/15 [&_[data-slot=button]]:bg-clip-border">
              {footer}
            </div>
          )}
        </div>
        {IS_INSTALLED_APP && (
          <div className="in-data-keyboard-open:hidden">
            <TabBar />
          </div>
        )}
      </footer>
    </div>
  )
}

const backClassName =
  '-ml-2 mr-auto flex min-h-10 min-w-0 items-center gap-1.5 rounded-lg py-1 pr-5 pl-2 text-left outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 active:bg-muted'

export function PageHeader({
  leading,
  title,
  subtitle,
  backTo,
  onBack,
  trailing,
  panel,
  children,
}: {
  leading?: ReactNode
  title: ReactNode
  subtitle?: ReactNode
  backTo?: string
  onBack?: () => void
  trailing?: ReactNode
  panel?: ReactNode
  children?: ReactNode
}) {
  const heading = (
    <div className="min-w-0 flex-1">
      <div className="truncate text-sm font-semibold">{title}</div>
      {subtitle && (
        <div className="truncate text-xs text-muted-foreground">{subtitle}</div>
      )}
    </div>
  )
  const backContent = (
    <>
      <ChevronLeftIcon className="size-5 shrink-0" />
      {heading}
    </>
  )

  return (
    <div>
      <div className="flex min-h-10 items-center gap-2">
        {leading}
        {backTo !== undefined ? (
          <Link to={backTo} aria-label="Înapoi" className={backClassName}>
            {backContent}
          </Link>
        ) : onBack ? (
          <button
            type="button"
            aria-label="Înapoi"
            onClick={onBack}
            className={backClassName}
          >
            {backContent}
          </button>
        ) : (
          heading
        )}
        {trailing}
      </div>
      {children && <div className="mt-2">{children}</div>}
      {panel}
    </div>
  )
}
