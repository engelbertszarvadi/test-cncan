import { CheckIcon, ListFilterIcon, SearchIcon, XIcon } from "lucide-react"
import { useMemo, useState } from "react"

import { AppShell, PageHeader } from "@/components/app-shell"
import { ExplanationDetails } from "@/components/explanation-details"
import { NavbarPanel, NavbarPanelItem, NavbarPanelToggle } from "@/components/navbar-panel"
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
import { scrollToTop } from "@/lib/scroll"
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
  const [filtersOpen, setFiltersOpen] = useState(false)

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
    setFiltersOpen(false)
    scrollToTop()
  }

  return (
    <AppShell
      header={
        <PageHeader
          backTo="/"
          title="Toate întrebările"
          subtitle={`Afișate: ${results.length} din ${TOTAL_QUESTIONS}${filter === "all" ? "" : ` · ${CATEGORIES[filter].shortName}`}`}
          trailing={
            <NavbarPanelToggle
              icon={ListFilterIcon}
              label="Filtre"
              open={filtersOpen}
              onToggle={() => setFiltersOpen((open) => !open)}
              indicator={
                filter !== "all" && (
                  <span
                    className={cn(
                      "absolute top-2 right-2 size-2 rounded-full ring-2 ring-background",
                      CATEGORIES[filter].styles.dot
                    )}
                  />
                )
              }
            />
          }
          panel={
            <FilterPanel
              filter={filter}
              open={filtersOpen}
              onClose={() => setFiltersOpen(false)}
              onFilterChange={updateFilter}
            />
          }
        />
      }
      footer={
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-primary-foreground/60" />
          <Input
            type="search"
            inputMode="search"
            enterKeyHint="search"
            value={search}
            onChange={(event) => updateSearch(event.target.value)}
            placeholder="Caută după text sau ID (ex: 106)..."
            className="h-12 border-transparent bg-primary px-10 text-base text-primary-foreground placeholder:text-primary-foreground/60 focus-visible:border-transparent focus-visible:ring-0 sm:text-sm dark:bg-primary [&::-webkit-search-cancel-button]:hidden"
          />
          <div className="absolute inset-y-0 right-2 flex items-center">
            <Button
              variant="ghost"
              size="icon-sm"
              className={cn(
                "text-primary-foreground/70 transition-opacity duration-200 hover:bg-primary-foreground/10 hover:text-primary-foreground active:not-aria-[haspopup]:translate-y-0",
                !search && "pointer-events-none opacity-0"
              )}
              aria-label="Șterge căutarea"
              aria-hidden={!search}
              tabIndex={search ? undefined : -1}
              onClick={() => updateSearch("")}
            >
              <XIcon />
            </Button>
          </div>
        </div>
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

function FilterPanel({
  filter,
  open,
  onClose,
  onFilterChange,
}: {
  filter: Filter
  open: boolean
  onClose: () => void
  onFilterChange: (filter: Filter) => void
}) {
  const options: { key: Filter; label: string; count: number; dot: string }[] = [
    { key: "all", label: "Toate", count: TOTAL_QUESTIONS, dot: "bg-foreground" },
    ...CATEGORY_KEYS.map((key) => ({
      key,
      label: CATEGORIES[key].shortName,
      count: CATEGORIES[key].count,
      dot: CATEGORIES[key].styles.dot,
    })),
  ]

  return (
    <NavbarPanel open={open} onClose={onClose} role="radiogroup" aria-label="Categorie">
      {options.map((option) => {
        const isActive = filter === option.key
        return (
          <NavbarPanelItem
            key={option.key}
            role="radio"
            aria-checked={isActive}
            active={isActive}
            onClick={() => onFilterChange(option.key)}
          >
            <span className={cn("size-2 shrink-0 rounded-full", option.dot)} />
            <span className="flex-1">{option.label}</span>
            <span className="text-xs text-muted-foreground tabular-nums">{option.count}</span>
            <CheckIcon className={cn("size-4 shrink-0", !isActive && "invisible")} />
          </NavbarPanelItem>
        )
      })}
    </NavbarPanel>
  )
}

function QuestionListItem({ item }: { item: IndexedQuestion }) {
  const { question, categoryKey } = item

  return (
    <article className="space-y-3 overflow-hidden rounded-xl border bg-background p-4">
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
        <ExplanationDetails explanation={question.explanation} className="bg-muted/50" />
      )}
    </article>
  )
}
