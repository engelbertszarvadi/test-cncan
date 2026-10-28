import { CheckIcon, XIcon } from "lucide-react"

import { optionLetter } from "@/lib/questions"
import { cn } from "@/lib/utils"

export type AnswerState = "idle" | "selected" | "correct" | "wrong"

const stateStyles: Record<AnswerState, string> = {
  idle: "border-border hover:border-foreground/20 hover:bg-muted/50",
  selected: "border-primary bg-primary/5 font-medium ring-3 ring-primary/10",
  correct: "border-green-500 bg-green-50 font-medium text-green-900",
  wrong: "border-destructive bg-destructive/5 font-medium text-destructive",
}

export function AnswerOption({
  index,
  text,
  state,
  disabled,
  onSelect,
}: {
  index: number
  text: string
  state: AnswerState
  disabled: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        "flex w-full items-start gap-3 rounded-xl border-2 bg-background p-4 text-left text-[15px] transition-all active:scale-[0.99] outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-default sm:text-base",
        stateStyles[state]
      )}
    >
      <span className="font-semibold">{optionLetter(index)}.</span>
      <span className="flex-1 leading-normal">{text}</span>
      {state === "correct" && <CheckIcon className="mt-0.5 size-5 shrink-0 text-green-600" />}
      {state === "wrong" && <XIcon className="mt-0.5 size-5 shrink-0 text-destructive" />}
    </button>
  )
}
