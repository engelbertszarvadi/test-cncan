import confetti from "canvas-confetti"
import {
  CheckIcon,
  ChevronLeftIcon,
  CircleXIcon,
  EllipsisVerticalIcon,
  InfinityIcon,
  ListIcon,
  PartyPopperIcon,
  RadiationIcon,
  RotateCcwIcon,
  TimerIcon,
  XIcon,
} from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { AppShell, PageHeader } from "@/components/app-shell"
import { ExamTimer } from "@/components/exam-timer"
import { ExplanationDetails } from "@/components/explanation-details"
import { QuestionActionButton, QuestionPanel } from "@/components/question-panel"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import {
  CATEGORIES,
  CATEGORY_KEYS,
  EXAM_QUESTIONS_PER_CATEGORY,
  PASS_PERCENTAGE,
  TOTAL_QUESTIONS,
  optionLetter,
  pickExamQuestions,
  type Question,
} from "@/lib/questions"
import { formatDuration } from "@/lib/format"
import { cn } from "@/lib/utils"

type ExamState = {
  questions: Question[]
  currentIndex: number
  selected: number | null
  revealed: boolean
  explanationOpen: boolean
  score: number
  answers: number[]
  complete: boolean
  startedAt: number
  finishedAt: number | null
}

type LeaveAction = "home" | "restart" | "all"

const leaveActionLabels: Record<LeaveAction, { title: string; confirm: string }> = {
  home: { title: "Ieși din test?", confirm: "Ieși" },
  restart: { title: "Repornești testul?", confirm: "Repornește" },
  all: { title: "Mergi la toate întrebările?", confirm: "Continuă" },
}

export function ExamPage() {
  const navigate = useNavigate()
  const [exam, setExam] = useState<ExamState | null>(null)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [pendingLeave, setPendingLeave] = useState<LeaveAction | null>(null)

  const startExam = () => {
    setExam({
      questions: pickExamQuestions(),
      currentIndex: 0,
      selected: null,
      revealed: false,
      explanationOpen: false,
      score: 0,
      answers: [],
      complete: false,
      startedAt: Date.now(),
      finishedAt: null,
    })
    setReviewOpen(false)
    window.scrollTo({ top: 0 })
  }

  const goHome = () => {
    setExam(null)
    setReviewOpen(false)
    window.scrollTo({ top: 0 })
  }

  const confirmLeave = () => {
    if (pendingLeave === "restart") startExam()
    if (pendingLeave === "home") goHome()
    if (pendingLeave === "all") navigate("/all")
    setPendingLeave(null)
  }

  if (!exam) return <ExamHome onStart={startExam} />

  if (exam.complete) {
    return (
      <ExamResults
        exam={exam}
        reviewOpen={reviewOpen}
        onToggleReview={() => setReviewOpen((open) => !open)}
        onRestart={startExam}
        onHome={goHome}
      />
    )
  }

  const question = exam.questions[exam.currentIndex]
  const isLast = exam.currentIndex === exam.questions.length - 1

  const submit = () => {
    if (exam.selected === null) return
    const selected = exam.selected
    setExam({
      ...exam,
      revealed: true,
      score: selected === question.correctAnswer ? exam.score + 1 : exam.score,
      answers: [...exam.answers, selected],
    })
  }

  const next = () => {
    window.scrollTo({ top: 0 })
    if (!isLast) {
      setExam({
        ...exam,
        currentIndex: exam.currentIndex + 1,
        selected: null,
        revealed: false,
        explanationOpen: false,
      })
      return
    }
    if (Math.round((exam.score / exam.questions.length) * 100) >= PASS_PERCENTAGE) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
    }
    setExam({ ...exam, complete: true, finishedAt: Date.now() })
  }

  return (
    <AppShell
      header={
        <PageHeader
          leading={
            <Button
              variant="ghost"
              size="icon-lg"
              className="-ml-2 size-10"
              aria-label="Pagina principală"
              onClick={() => setPendingLeave("home")}
            >
              <XIcon className="size-5" />
            </Button>
          }
          title={`Întrebarea ${exam.currentIndex + 1} din ${exam.questions.length}`}
          subtitle={`Scor: ${exam.score}/${exam.currentIndex + (exam.revealed ? 1 : 0)}`}
          trailing={
            <div className="flex items-center gap-1">
              <ExamTimer key={exam.startedAt} startedAt={exam.startedAt} />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-lg" className="-mr-2 size-10" aria-label="Mai multe opțiuni">
                    <EllipsisVerticalIcon className="size-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-52">
                  <DropdownMenuItem className="py-2.5" onSelect={() => setPendingLeave("restart")}>
                    <RotateCcwIcon /> Repornește testul
                  </DropdownMenuItem>
                  <DropdownMenuItem className="py-2.5" onSelect={() => setPendingLeave("all")}>
                    <ListIcon /> Vezi toate întrebările
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          }
        >
          <Progress value={((exam.currentIndex + 1) / exam.questions.length) * 100} className="h-1" />
        </PageHeader>
      }
      footer={
        <QuestionActionButton
          selected={exam.selected}
          revealed={exam.revealed}
          nextLabel={isLast ? "Finalizează Testul" : "Următoarea întrebare"}
          onSubmit={submit}
          onNext={next}
        />
      }
    >
      <QuestionPanel
        question={question}
        selected={exam.selected}
        revealed={exam.revealed}
        explanationOpen={exam.explanationOpen}
        onSelect={(index) => !exam.revealed && setExam({ ...exam, selected: index })}
        onShowExplanation={() => setExam({ ...exam, explanationOpen: true })}
      />

      <AlertDialog open={pendingLeave !== null} onOpenChange={(open) => !open && setPendingLeave(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{pendingLeave && leaveActionLabels[pendingLeave].title}</AlertDialogTitle>
            <AlertDialogDescription>Progresul testului curent se va pierde.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel size="lg" className="h-11 text-base sm:min-w-32">Anulează</AlertDialogCancel>
            <AlertDialogAction size="lg" className="h-11 text-base sm:min-w-32" onClick={confirmLeave}>
              {pendingLeave && leaveActionLabels[pendingLeave].confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  )
}

function ExamHome({ onStart }: { onStart: () => void }) {
  const examSize = EXAM_QUESTIONS_PER_CATEGORY * CATEGORY_KEYS.length

  return (
    <AppShell
      header={
        <PageHeader
          leading={
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-yellow-400 text-neutral-950">
              <RadiationIcon className="size-5" />
            </span>
          }
          title={<span className="sr-only sm:not-sr-only">Test CNCAN</span>}
          trailing={
            <div className="flex gap-2">
              <Button asChild variant="secondary" className="h-9">
                <Link to="/infinite">
                  <InfinityIcon data-icon="inline-start" /> Mod infinit
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-9">
                <Link to="/all">
                  <ListIcon data-icon="inline-start" /> Toate întrebările
                </Link>
              </Button>
            </div>
          }
        />
      }
      footer={
        <Button size="lg" className="h-12 w-full text-base" onClick={onStart}>
          Începe Testul
        </Button>
      }
    >
      <div className="space-y-6 py-2">
        <div className="space-y-3">
          <Badge variant="secondary" className="tracking-wide uppercase">
            Examen CNCAN – Nivel 2
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Test CNCAN - MRIVX_M</h1>
          <p className="text-muted-foreground">
            Montare, reparare, întreținere, verificare – instalații medicale
          </p>
        </div>

        <div className="rounded-xl border bg-background p-4">
          <p className="font-medium">
            Acest test conține {examSize} de întrebări ({EXAM_QUESTIONS_PER_CATEGORY} din fiecare
            categorie).
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Prag de promovare: {PASS_PERCENTAGE}% · Total întrebări: {TOTAL_QUESTIONS}
          </p>
        </div>

        <div className="space-y-2.5">
          {CATEGORY_KEYS.map((key) => {
            const category = CATEGORIES[key]
            return (
              <div
                key={key}
                className={cn("flex items-center gap-3 rounded-xl border p-4", category.styles.panel)}
              >
                <span className={cn("size-2.5 shrink-0 rounded-full", category.styles.dot)} />
                <div className="min-w-0 flex-1">
                  <h3 className="leading-snug font-semibold">{category.name}</h3>
                  <p className="text-xs text-muted-foreground">Fond total: {category.count} întrebări</p>
                </div>
                <Badge className={cn("shrink-0", category.styles.badge)}>
                  {EXAM_QUESTIONS_PER_CATEGORY}
                </Badge>
              </div>
            )
          })}
        </div>
      </div>
    </AppShell>
  )
}

function ExamResults({
  exam,
  reviewOpen,
  onToggleReview,
  onRestart,
  onHome,
}: {
  exam: ExamState
  reviewOpen: boolean
  onToggleReview: () => void
  onRestart: () => void
  onHome: () => void
}) {
  const total = exam.questions.length
  const percentage = Math.round((exam.score / total) * 100)
  const passed = percentage >= PASS_PERCENTAGE
  const passMark = Math.ceil((total * PASS_PERCENTAGE) / 100)

  return (
    <AppShell
      header={
        <PageHeader
          leading={
            <Button
              variant="ghost"
              size="icon-lg"
              className="-ml-2 size-10"
              aria-label="Pagina principală"
              onClick={onHome}
            >
              <ChevronLeftIcon className="size-5" />
            </Button>
          }
          title="Test Finalizat!"
        />
      }
      footer={
        <Button size="lg" className="h-12 w-full text-base" onClick={onRestart}>
          Începe Test Nou
        </Button>
      }
    >
      <div className="space-y-6 py-2">
        <div className="text-center">
          <div className="text-6xl font-bold tabular-nums">
            {exam.score}/{total}
          </div>
          <div className="mt-1 text-xl font-medium text-muted-foreground">{percentage}% corect</div>
          {exam.finishedAt !== null && (
            <div className="mt-2 flex items-center justify-center gap-1.5 text-sm text-muted-foreground tabular-nums">
              <TimerIcon className="size-4" /> Timp: {formatDuration(exam.finishedAt - exam.startedAt)}
            </div>
          )}
        </div>

        <Alert
          className={cn(
            "p-4",
            passed
              ? "border-green-200 bg-green-50 text-green-900"
              : "border-destructive/30 bg-destructive/5 text-destructive"
          )}
        >
          {passed ? <PartyPopperIcon /> : <CircleXIcon />}
          <AlertTitle className="text-lg font-bold">
            {passed ? "Felicitări! Ai trecut testul!" : "Nu ai trecut testul. Încearcă din nou!"}
          </AlertTitle>
          <AlertDescription className={cn(passed && "text-green-800")}>
            {passed
              ? `Ai obținut peste pragul minim de promovare de ${PASS_PERCENTAGE}% (${passMark}/${total}).`
              : `Pragul minim de promovare pentru examenul CNCAN este de ${PASS_PERCENTAGE}% (${passMark}/${total}).`}
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-2 gap-2">
          <Button size="lg" variant="secondary" className="h-11" onClick={onToggleReview}>
            {reviewOpen ? "Ascunde revizuirea" : `Revizuire (${total})`}
          </Button>
          <Button asChild size="lg" variant="outline" className="h-11">
            <Link to="/all">Toate întrebările</Link>
          </Button>
        </div>

        {reviewOpen && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Revizuire Întrebări Test</h2>
            {exam.questions.map((question, index) => (
              <ReviewItem
                key={`${question.category}-${question.id}`}
                question={question}
                position={index + 1}
                selected={exam.answers[index] ?? null}
              />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}

function ReviewItem({
  question,
  position,
  selected,
}: {
  question: Question
  position: number
  selected: number | null
}) {
  const isCorrect = selected === question.correctAnswer

  return (
    <div
      className={cn(
        "space-y-3 rounded-xl border p-4",
        isCorrect ? "border-green-200 bg-green-50/40" : "border-destructive/30 bg-destructive/5"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          {question.category} • #{question.id}
        </span>
        <Badge
          className={cn(
            "shrink-0",
            isCorrect ? "bg-green-100 text-green-800" : "bg-destructive/10 text-destructive"
          )}
        >
          {isCorrect ? "Corect (+1)" : "Greșit (0)"}
        </Badge>
      </div>
      <p className="leading-snug font-semibold">
        {position}. {question.question}
      </p>
      <div className="space-y-2">
        {question.options.map((option, index) => {
          const isAnswer = index === question.correctAnswer
          const isWrongPick = index === selected && !isAnswer
          return (
            <div
              key={index}
              className={cn(
                "flex items-start gap-2 rounded-lg border bg-background p-2.5 text-sm",
                isAnswer && "border-green-400 bg-green-100/70 font-medium text-green-900",
                isWrongPick && "border-destructive/50 bg-destructive/10 text-destructive"
              )}
            >
              <span className="font-semibold">{optionLetter(index)}.</span>
              <span className={cn("flex-1", isWrongPick && "line-through")}>{option}</span>
              {isAnswer && <CheckIcon className="mt-0.5 size-4 shrink-0" aria-label="Răspuns corect" />}
              {isWrongPick && <XIcon className="mt-0.5 size-4 shrink-0" aria-label="Ales de tine" />}
            </div>
          )
        })}
      </div>
      {question.explanation && (
        <ExplanationDetails explanation={question.explanation} className="bg-background/80" />
      )}
    </div>
  )
}
