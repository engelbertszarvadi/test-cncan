import { XIcon, type LucideIcon } from "lucide-react"
import { useEffect, useRef, type ComponentProps, type ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

export function NavbarPanelToggle({
  icon: Icon,
  label,
  open,
  onToggle,
  indicator,
}: {
  icon: LucideIcon
  label: string
  open: boolean
  onToggle: () => void
  indicator?: ReactNode
}) {
  return (
    <Button
      variant="ghost"
      size="icon-lg"
      className={cn("relative -mr-2 size-10", open && "bg-muted")}
      aria-label={label}
      aria-expanded={open}
      onClick={onToggle}
    >
      <Icon
        className={cn(
          "size-5 transition-all duration-200",
          open && "scale-50 rotate-90 opacity-0"
        )}
      />
      <XIcon
        className={cn(
          "absolute size-5 transition-all duration-200",
          !open && "scale-50 -rotate-90 opacity-0"
        )}
      />
      {!open && indicator}
    </Button>
  )
}

export function NavbarPanel({
  open,
  onClose,
  children,
  ...props
}: { open: boolean; onClose: () => void; children: ReactNode } & ComponentProps<"div">) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const closeOnOutsidePointer = (event: PointerEvent) => {
      const header = rootRef.current?.closest("header")
      if (header && !header.contains(event.target as Node)) onClose()
    }
    document.addEventListener("pointerdown", closeOnOutsidePointer)
    return () => document.removeEventListener("pointerdown", closeOnOutsidePointer)
  }, [open, onClose])

  return (
    <Collapsible ref={rootRef} open={open} data-slot="navbar-panel" className="absolute inset-x-[-1px] top-full">
      <CollapsibleContent className="overflow-hidden rounded-b-2xl border border-t-0 bg-background shadow-lg shadow-black/5 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        <div className="space-y-1 px-2 pt-1 pb-3" {...props}>
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export function NavbarPanelItem({ active, className, ...props }: { active?: boolean } & ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 [&_svg:not([class*='size-'])]:size-4",
        active && "bg-muted font-semibold",
        className
      )}
      {...props}
    />
  )
}
