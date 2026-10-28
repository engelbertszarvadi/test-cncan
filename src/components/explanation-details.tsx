import { ChevronDownIcon } from "lucide-react"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

export function ExplanationDetails({ explanation, className }: { explanation: string; className?: string }) {
  return (
    <Collapsible className={cn("group -mx-4 -mb-4 border-t text-sm", className)}>
      <CollapsibleTrigger className="flex w-full cursor-pointer items-center justify-between gap-2 px-4 py-3 font-medium text-muted-foreground outline-none select-none hover:text-foreground focus-visible:bg-muted group-data-[state=open]:text-foreground">
        Explicație
        <ChevronDownIcon className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        <p className="px-4 pb-4 leading-relaxed whitespace-pre-line">{explanation}</p>
      </CollapsibleContent>
    </Collapsible>
  )
}
