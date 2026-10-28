import { RadiationIcon, ShareIcon, SquarePlusIcon, XIcon } from "lucide-react"
import { useLayoutEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { useInstallPrompt } from "@/hooks/use-install-prompt"
import { cn } from "@/lib/utils"

export function InstallPrompt({ className }: { className?: string }) {
  const { mode, install, dismiss } = useInstallPrompt()
  const [closing, setClosing] = useState(false)
  const textRef = useRef<HTMLDivElement>(null)
  const [iconSize, setIconSize] = useState(0)

  useLayoutEffect(() => {
    const text = textRef.current
    if (!text) return
    const update = () => setIconSize(text.offsetHeight)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(text)
    return () => observer.disconnect()
  }, [mode])

  if (!mode) return null

  const close = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) dismiss()
    else setClosing(true)
  }

  return (
    <div
      className={cn(
        "flex gap-3 rounded-lg border bg-background p-3 duration-300",
        closing
          ? "pointer-events-none animate-out fade-out fill-mode-forwards"
          : "motion-safe:animate-in motion-safe:fade-in",
        className
      )}
      onAnimationEnd={() => closing && dismiss()}
    >
      <div
        className="flex shrink-0 items-center justify-center rounded-[22%] bg-yellow-400 text-neutral-950"
        style={{ width: iconSize, height: iconSize }}
      >
        <RadiationIcon className="size-[66%]" fill="currentColor" aria-hidden />
      </div>
      <div ref={textRef} className="min-w-0 flex-1 space-y-2">
        <div>
          <p className="text-sm font-semibold">Instalează aplicația</p>
          {mode === "native" ? (
            <p className="text-xs text-muted-foreground">
              Adaug-o pe ecranul principal pentru acces rapid, chiar și fără internet.
            </p>
          ) : (
            <p className="text-xs leading-relaxed text-muted-foreground">
              Apasă <ShareIcon className="inline size-3.5 -translate-y-px" aria-label="Partajează" /> în bara
              Safari, apoi alege <span className="font-medium text-foreground">„Adaugă pe ecranul principal”</span>{" "}
              <SquarePlusIcon className="inline size-3.5 -translate-y-px" aria-hidden />.
            </p>
          )}
        </div>
        {mode === "native" && (
          <Button size="sm" className="h-8" onClick={install}>
            Instalează
          </Button>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        className="-mt-1 -mr-1 self-start text-muted-foreground"
        aria-label="Închide"
        onClick={close}
      >
        <XIcon />
      </Button>
    </div>
  )
}
