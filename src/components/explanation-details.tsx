import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export function ExplanationDetails({ explanation, className }: { explanation: string; className?: string }) {
  return (
    <details className={cn("group rounded-lg border text-sm", className)}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 p-3 font-semibold select-none [&::-webkit-details-marker]:hidden">
        Explicație
        <ChevronDownIcon className="size-4 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <p className="border-t p-3 leading-relaxed whitespace-pre-line">{explanation}</p>
    </details>
  )
}
