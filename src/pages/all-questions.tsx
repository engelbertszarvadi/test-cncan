import { CheckIcon, SearchIcon, XIcon } from "lucide-react"
import { useMemo, useState } from "react"

import { AppShell, PageHeader } from "@/components/app-shell"
import { BackButton } from "@/components/back-button"
import { ExplanationDetails } from "@/components/explanation-details"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  CATEGORIES,
  CATEGORY_KEYS,
  TOTAL_QUESTIONS,
  normalizeText,
  optionLetter,
  questionsFor,
  type CategoryKey,
  type Question,
} from "@/lib/questions"
import { cn } from "@/lib/utils"

type Filter = CategoryKey | "all"

type IndexedQuestion = {
  categoryKey: CategoryKey
  question: Question
  searchText: string
}

const PAGE_SIZE = 30

const indexedQuestions: IndexedQuestion[] = CATEGORY_KEYS.flatMap((categoryKey) =>
  questionsFor([categoryKey]).map((question) => ({
    categoryKey,
    question,
    searchText: normalizeText(
      `${question.id} ${question.question} ${question.options.join(" ")} ${question.explanation}`
    ),
  }))
)

export function AllQuestionsPage() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<Filter>("all")
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const trimmed = search.trim()
  const isNumeric = /^\d+$/.test(trimmed)

  const results = useMemo(() => {
    const term = normalizeText(trimmed)
    const id = isNumeric ? parseInt(trimmed, 10) : null
    return indexedQuestions.filter((item) => {
      if (filter !== "all" && item.categoryKey !== filter) return false
      if (!term) return true
      return item.question.id === id || item.searchText.includes(term)
    })
  }, [trimmed, isNumeric, filter])

  const updateSearch = (value: string) => {
    setSearch(value)
    setVisibleCount(PAGE_SIZE)
  }

  const updateFilter = (value: Filter) => {
    setFilter(value)
    setVisibleCount(PAGE_SIZE)
    window.scrollTo({ top: 0 })
  }

  const filters: { key: Filter; label: string; className: string }[] = [
    {
      key: "all",
      label: `Toate (${TOTAL_QUESTIONS})`,
      className: filter === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground",
    },
    ...CATEGORY_KEYS.map((key) => ({
      key,
      label: `${CATEGORIES[key].shortName} (${CATEGORIES[key].count})`,
      className: filter === key ? CATEGORIES[key].styles.filterActive : CATEGORIES[key].styles.filterIdle,
    })),
  ]

  return (
    <AppShell
      header={
        <PageHeader
          leading={<BackButton />}
          title="Toate întrebările"
          subtitle={`Afișate: ${results.length} din ${TOTAL_QUESTIONS}`}
        >
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              inputMode="search"
              enterKeyHint="search"
              value={search}
              onChange={(event) => updateSearch(event.target.value)}
              placeholder="Caută după text sau ID (ex: 106)..."
              className="h-10 px-9 text-base sm:text-sm [&::-webkit-search-cancel-button]:hidden"
            />
            {search && (
              <Button
                variant="ghost"
                size="icon-sm"
                className="absolute top-1/2 right-1.5 -translate-y-1/2 text-muted-foreground"
                aria-label="Șterge căutarea"
                onClick={() => updateSearch("")}
              >
                <XIcon />
              </Button>
            )}
          </div>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
            {filters.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => updateFilter(item.key)}
                className={cn(
                  "h-8 shrink-0 rounded-full px-3 text-xs font-semibold whitespace-nowrap transition-colors",
                  item.className
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </PageHeader>
      }
    >
      {results.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-lg font-medium">Nu am găsit nicio întrebare.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Încearcă un alt termen de căutare sau alege o altă categorie.
          </p>
          <Button
            variant="secondary"
            className="mt-4 h-10"
            onClick={() => {
              updateSearch("")
              updateFilter("all")
            }}
          >
            Resetează filtrele
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {results.slice(0, visibleCount).map((item) => (
            <QuestionListItem key={`${item.categoryKey}-${item.question.id}`} item={item} />
          ))}
          {visibleCount < results.length && (
            <Button
              variant="outline"
              size="lg"
              className="h-12 w-full"
              onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            >
              Afișează mai multe ({results.length - visibleCount} rămase)
            </Button>
          )}
        </div>
      )}
    </AppShell>
  )
}

function QuestionListItem({ item }: { item: IndexedQuestion }) {
  const { question, categoryKey } = item

  return (
    <article className="space-y-3 rounded-xl border bg-background p-4">
      <div className="flex items-center gap-2">
        <Badge className={cn("tracking-wide uppercase", CATEGORIES[categoryKey].styles.badge)}>
          {CATEGORIES[categoryKey].shortName}
        </Badge>
        <span className="text-xs font-semibold text-muted-foreground">Nr. #{question.id}</span>
      </div>
      <h3 className="leading-snug font-semibold">
        {question.id}. {question.question}
      </h3>
      <ul className="space-y-2">
        {question.options.map((option, index) => {
          const isAnswer = index === question.correctAnswer
          return (
            <li
              key={index}
              className={cn(
                "flex items-start gap-2 rounded-lg border p-2.5 text-sm",
                isAnswer ? "border-green-400 bg-green-50 font-medium text-green-900" : "text-muted-foreground"
              )}
            >
              <span className="font-semibold">{optionLetter(index)}.</span>
              <span className="flex-1">{option}</span>
              {isAnswer && <CheckIcon className="mt-0.5 size-4 shrink-0 text-green-600" />}
            </li>
          )
        })}
      </ul>
      {question.explanation && (
        <ExplanationDetails explanation={question.explanation} className="bg-muted/40" />
      )}
    </article>
  )
}
