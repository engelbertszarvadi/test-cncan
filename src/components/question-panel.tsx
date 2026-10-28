import { CircleCheckIcon, CircleXIcon } from "lucide-react"

import { AnswerOption, type AnswerState } from "@/components/answer-option"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Question } from "@/lib/questions"
import { cn } from "@/lib/utils"

function answerState(
  index: number,
  selected: number | null,
  correct: number,
  revealed: boolean
): AnswerState {
  if (revealed && index === correct) return "correct"
  if (revealed && index === selected) return "wrong"
  if (index === selected) return "selected"
  return "idle"
}

export function QuestionPanel({
  question,
  selected,
  revealed,
  explanationOpen,
  onSelect,
  onShowExplanation,
}: {
  question: Question
  selected: number | null
  revealed: boolean
  explanationOpen: boolean
  onSelect: (index: number) => void
  onShowExplanation: () => void
}) {
  const isCorrect = selected === question.correctAnswer

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <Badge variant="secondary" className="h-auto tracking-wide whitespace-normal uppercase">
          {question.category}
        </Badge>
        <h2 className="text-lg leading-snug font-semibold sm:text-2xl">
          {question.id}. {question.question}
        </h2>
      </div>

      <div className="space-y-2.5">
        {question.options.map((option, index) => (
          <AnswerOption
            key={index}
            index={index}
            text={option}
            state={answerState(index, selected, question.correctAnswer, revealed)}
            disabled={revealed}
            onSelect={() => onSelect(index)}
          />
        ))}
      </div>

      {revealed && (
        <Alert
          className={cn(
            "p-4",
            isCorrect
              ? "border-green-200 bg-green-50 text-green-900"
              : "border-destructive/30 bg-destructive/5 text-destructive"
          )}
        >
          {isCorrect ? <CircleCheckIcon /> : <CircleXIcon />}
          <AlertTitle className="text-base font-semibold">
            {isCorrect ? "Răspuns corect!" : "Răspuns incorect!"}
          </AlertTitle>
          {question.explanation && (
            <AlertDescription className="text-foreground">
              {explanationOpen ? (
                <p className="mt-2 border-t pt-3 leading-relaxed whitespace-pre-line">
                  <strong>Explicație:</strong> {question.explanation}
                </p>
              ) : (
                <Button variant="outline" className="mt-2 h-9" onClick={onShowExplanation}>
                  Vezi explicația
                </Button>
              )}
            </AlertDescription>
          )}
        </Alert>
      )}
    </div>
  )
}

export function QuestionActionButton({
  selected,
  revealed,
  nextLabel,
  onSubmit,
  onNext,
}: {
  selected: number | null
  revealed: boolean
  nextLabel: string
  onSubmit: () => void
  onNext: () => void
}) {
  if (revealed) {
    return (
      <Button size="lg" className="h-12 w-full text-base" onClick={onNext}>
        {nextLabel}
      </Button>
    )
  }
  return (
    <Button size="lg" className="h-12 w-full text-base" disabled={selected === null} onClick={onSubmit}>
      {selected === null ? "Selectează un răspuns" : "Trimite Răspunsul"}
    </Button>
  )
}
