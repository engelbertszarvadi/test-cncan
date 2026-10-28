import { CheckIcon, ChevronLeftIcon, ChevronRightIcon, SettingsIcon } from "lucide-react"
import { useState } from "react"

import { AppShell, PageHeader } from "@/components/app-shell"
import { NavbarPanel, NavbarPanelToggle } from "@/components/navbar-panel"
import { QuestionActionButton, QuestionPanel } from "@/components/question-panel"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import {
  CATEGORIES,
  CATEGORY_KEYS,
  questionKey,
  questionsFor,
  type CategoryKey,
  type Question,
} from "@/lib/questions"
import { scrollToTop } from "@/lib/scroll"
import { cn } from "@/lib/utils"

type Entry = {
  question: Question
  selected: number | null
  revealed: boolean
}

type Session = {
  pool: Question[]
  random: boolean
  history: Entry[]
  index: number
  seen: Set<string>
  correct: number
  answered: number
}

function newEntry(question: Question): Entry {
  return { question, selected: null, revealed: false }
}

function withNextQuestion(session: Session): Session {
  if (session.index < session.history.length - 1) {
    return { ...session, index: session.index + 1 }
  }

  let question: Question
  let seen = session.seen
  if (session.random) {
    let unseen = session.pool.filter((q) => !seen.has(questionKey(q)))
    if (unseen.length === 0) {
      seen = new Set()
      unseen = session.pool
    }
    question = unseen[Math.floor(Math.random() * unseen.length)]
    seen = new Set(seen).add(questionKey(question))
  } else {
    question = session.pool[session.history.length % session.pool.length]
  }

  return {
    ...session,
    seen,
    history: [...session.history, newEntry(question)],
    index: session.index + 1,
  }
}

export function InfinitePage() {
  const [selectedCategories, setSelectedCategories] = useState<CategoryKey[]>(CATEGORY_KEYS)
  const [random, setRandom] = useState(true)
  const [session, setSession] = useState<Session | null>(null)

  const toggleCategory = (key: CategoryKey) => {
    setSelectedCategories((current) =>
      current.includes(key) ? current.filter((k) => k !== key) : [...current, key]
    )
  }

  const start = () => {
    const pool = questionsFor(CATEGORY_KEYS.filter((key) => selectedCategories.includes(key)))
    if (pool.length === 0) return
    setSession(
      withNextQuestion({ pool, random, history: [], index: -1, seen: new Set(), correct: 0, answered: 0 })
    )
  }

  if (!session) {
    return (
      <InfiniteSetup
        selectedCategories={selectedCategories}
        random={random}
        onToggleCategory={toggleCategory}
        onRandomChange={setRandom}
        onStart={start}
      />
    )
  }

  const entry = session.history[session.index]
  const { question } = entry
  const poolSize = session.pool.length
  const progress = Math.min(
    100,
    ((session.random ? session.seen.size : session.history.length) / poolSize) * 100
  )

  const updateEntry = (changes: Partial<Entry>) => {
    const history = [...session.history]
    history[session.index] = { ...entry, ...changes }
    setSession({ ...session, history })
  }

  const submit = () => {
    if (entry.selected === null) return
    const history = [...session.history]
    history[session.index] = { ...entry, revealed: true }
    setSession({
      ...session,
      history,
      answered: session.answered + 1,
      correct: session.correct + (entry.selected === question.correctAnswer ? 1 : 0),
    })
  }

  const next = () => {
    setSession(withNextQuestion(session))
    scrollToTop()
  }

  const previous = () => {
    if (session.index <= 0) return
    setSession({ ...session, index: session.index - 1 })
    scrollToTop()
  }

  return (
    <AppShell
      header={
        <PageHeader
          backTo="/"
          title={`Răspunsuri corecte: ${session.correct}/${session.answered}`}
          subtitle={
            session.random
              ? `Întrebări unice parcurse: ${session.seen.size}/${poolSize}`
              : `Întrebarea curentă: ${session.history.length}/${poolSize}`
          }
          trailing={
            <div className="flex gap-1.5">
              <Button
                variant="outline"
                size="icon-lg"
                className="size-10"
                disabled={session.index <= 0}
                onClick={previous}
                aria-label="Întrebarea anterioară"
              >
                <ChevronLeftIcon className="size-5" />
              </Button>
              <Button
                variant="outline"
                size="icon-lg"
                className="size-10"
                onClick={next}
                aria-label="Următoarea întrebare"
              >
                <ChevronRightIcon className="size-5" />
              </Button>
            </div>
          }
        >
          <Progress value={progress} className="h-1" />
        </PageHeader>
      }
      footer={
        <QuestionActionButton
          selected={entry.selected}
          revealed={entry.revealed}
          nextLabel="Următoarea întrebare"
          onSubmit={submit}
          onNext={next}
        />
      }
    >
      <QuestionPanel
        question={question}
        selected={entry.selected}
        revealed={entry.revealed}
        onSelect={(index) => !entry.revealed && updateEntry({ selected: index })}
      />
    </AppShell>
  )
}

function InfiniteSetup({
  selectedCategories,
  random,
  onToggleCategory,
  onRandomChange,
  onStart,
}: {
  selectedCategories: CategoryKey[]
  random: boolean
  onToggleCategory: (key: CategoryKey) => void
  onRandomChange: (random: boolean) => void
  onStart: () => void
}) {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const closeSettings = () => setSettingsOpen(false)

  return (
    <AppShell
      header={
        <PageHeader
          backTo="/"
          title="Mod infinit"
          trailing={
            <NavbarPanelToggle
              icon={SettingsIcon}
              label="Setări"
              open={settingsOpen}
              onToggle={() => setSettingsOpen((open) => !open)}
            />
          }
          panel={
            <NavbarPanel open={settingsOpen} onClose={closeSettings}>
              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted">
                <div>
                  <h3 className="text-sm font-semibold">Ordinea întrebărilor</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {random
                      ? "Întrebările vor fi afișate în ordine aleatorie"
                      : "Întrebările vor fi afișate pe categorii (toate din prima categorie, apoi toate din a doua, etc.)"}
                  </p>
                </div>
                <Switch checked={random} onCheckedChange={onRandomChange} aria-label="Schimbă ordinea întrebărilor" />
              </label>
            </NavbarPanel>
          }
        />
      }
      footer={
        <Button
          size="lg"
          className="h-12 w-full text-base"
          disabled={selectedCategories.length === 0}
          onClick={onStart}
        >
          Începe testul infinit
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Selectează categoriile pentru testul infinit</h1>
          <p className="text-muted-foreground">Alege categoriile din care vrei să primești întrebări:</p>
        </div>

        <div className="space-y-2.5">
          {CATEGORY_KEYS.map((key) => {
            const category = CATEGORIES[key]
            const isSelected = selectedCategories.includes(key)
            return (
              <button
                key={key}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onToggleCategory(key)}
                className={cn(
                  "flex w-full items-center justify-between gap-4 rounded-xl border-2 bg-background p-4 text-left transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.99]",
                  isSelected ? category.styles.selected : "border-border hover:bg-muted/50"
                )}
              >
                <div>
                  <h3 className="leading-snug font-semibold">{category.name}</h3>
                  <p className="text-sm opacity-75">{category.count} întrebări</p>
                </div>
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                    isSelected ? cn("border-transparent text-white", category.styles.dot) : "border-input"
                  )}
                >
                  {isSelected && <CheckIcon className="size-3.5" strokeWidth={3} />}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </AppShell>
  )
}
