import { ChevronLeftIcon } from "lucide-react"
import { useLayoutEffect, useRef, useState, type ReactNode } from "react"
import { Link } from "react-router-dom"

import { SCROLL_CONTAINER_ID } from "@/lib/scroll"
import { cn } from "@/lib/utils"

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
  const headerRef = useRef<HTMLElement>(null)
  const [headerHeight, setHeaderHeight] = useState(0)

  useLayoutEffect(() => {
    const headerElement = headerRef.current
    if (!headerElement) return
    const update = () => {
      const panel = headerElement.querySelector<HTMLElement>("[data-slot=navbar-panel]")
      setHeaderHeight(headerElement.offsetHeight - (panel?.offsetHeight ?? 0))
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(headerElement)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-muted/40">
      {header && (
        <header
          ref={headerRef}
          className="pointer-events-none absolute inset-x-0 top-0 z-40 mx-auto w-full max-w-2xl px-1 pt-[max(0.25rem,env(safe-area-inset-top))]"
        >
          <div className="pointer-events-auto rounded-2xl border bg-background/95 px-4 py-2 shadow-lg shadow-black/5 backdrop-blur">
            {header}
          </div>
        </header>
      )}
      <main
        id={SCROLL_CONTAINER_ID}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
        style={header ? { paddingTop: headerHeight } : undefined}
      >
        <div
          className={cn(
            "mx-auto w-full max-w-2xl px-4 py-4 sm:py-8 motion-safe:animate-in motion-safe:duration-300 motion-safe:fade-in motion-safe:slide-in-from-bottom-3",
            !header && "pt-[max(1rem,env(safe-area-inset-top))]",
            className
          )}
        >
          {children}
        </div>
      </main>
      {footer && (
        <footer className="relative z-40 mx-auto w-full max-w-2xl shrink-0 px-1 pb-[max(0.25rem,env(safe-area-inset-bottom))]">
          {aboveFooter}
          <div className="rounded-lg shadow-lg shadow-black/15 [&_[data-slot=button]]:bg-clip-border">{footer}</div>
        </footer>
      )}
    </div>
  )
}

const backClassName =
  "-ml-2 mr-auto flex min-h-10 min-w-0 items-center gap-1.5 rounded-lg py-1 pr-5 pl-2 text-left outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 active:bg-muted"

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
      {subtitle && <div className="truncate text-xs text-muted-foreground">{subtitle}</div>}
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
          <button type="button" aria-label="Înapoi" onClick={onBack} className={backClassName}>
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
