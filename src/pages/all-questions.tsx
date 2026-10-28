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
import { IS_INSTALLED_APP } from "@/lib/display-mode"
import { cn } from "@/lib/utils"


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
  const [selectedCategories, setSelectedCategories] = useState<CategoryKey[]>([])
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const trimmed = search.trim()
  const isNumeric = /^\d+$/.test(trimmed)

  const results = useMemo(() => {
    const term = normalizeText(trimmed)
    const id = isNumeric ? parseInt(trimmed, 10) : null
    return indexedQuestions.filter((item) => {
      if (selectedCategories.length > 0 && !selectedCategories.includes(item.categoryKey)) return false
      if (!term) return true
      return item.question.id === id || item.searchText.includes(term)
    })
  }, [trimmed, isNumeric, selectedCategories])

  const updateSearch = (value: string) => {
    setSearch(value)
    setVisibleCount(PAGE_SIZE)
  }

  const updateCategories = (categories: CategoryKey[]) => {
    setSelectedCategories(categories.length === CATEGORY_KEYS.length ? [] : categories)
    setVisibleCount(PAGE_SIZE)
    scrollToTop()
  }

  const toggleCategory = (key: CategoryKey) => {
    updateCategories(
      selectedCategories.includes(key)
        ? selectedCategories.filter((selected) => selected !== key)
        : CATEGORY_KEYS.filter((category) => category === key || selectedCategories.includes(category))
    )
  }

  const filterSummary = selectedCategories.map((key) => CATEGORIES[key].shortName).join(", ")

  return (
    <AppShell
      header={
        <PageHeader
          backTo={IS_INSTALLED_APP ? undefined : "/"}
          title="Toate întrebările"
          subtitle={`Afișate: ${results.length} din ${TOTAL_QUESTIONS}${filterSummary ? ` · ${filterSummary}` : ""}`}
          trailing={
            <NavbarPanelToggle
              icon={ListFilterIcon}
              label="Filtre"
              open={filtersOpen}
              onToggle={() => setFiltersOpen((open) => !open)}
              indicator={
                selectedCategories.length > 0 && (
                  <span className="absolute top-1.5 right-1 flex -space-x-0.5">
                    {selectedCategories.map((key) => (
                      <span
                        key={key}
                        className={cn("size-2 rounded-full ring-2 ring-background", CATEGORIES[key].styles.dot)}
                      />
                    ))}
                  </span>
                )
              }
            />
          }
          panel={
            <FilterPanel
              selectedCategories={selectedCategories}
              open={filtersOpen}
              onClose={() => setFiltersOpen(false)}
              onShowAll={() => updateCategories([])}
              onToggleCategory={toggleCategory}
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
              updateCategories([])
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
  selectedCategories,
  open,
  onClose,
  onShowAll,
  onToggleCategory,
}: {
  selectedCategories: CategoryKey[]
  open: boolean
  onClose: () => void
  onShowAll: () => void
  onToggleCategory: (key: CategoryKey) => void
}) {
  const showingAll = selectedCategories.length === 0
  const options = [
    { key: "all", label: "Toate", count: TOTAL_QUESTIONS, dot: "bg-foreground", checked: showingAll, onClick: onShowAll },
    ...CATEGORY_KEYS.map((key) => ({
      key,
      label: CATEGORIES[key].shortName,
      count: CATEGORIES[key].count,
      dot: CATEGORIES[key].styles.dot,
      checked: selectedCategories.includes(key),
      onClick: () => onToggleCategory(key),
    })),
  ]

  return (
    <NavbarPanel open={open} onClose={onClose} role="group" aria-label="Categorii">
      {options.map((option) => (
        <NavbarPanelItem
          key={option.key}
          role="checkbox"
          aria-checked={option.checked}
          active={option.checked}
          onClick={option.onClick}
        >
          <span className={cn("size-2 shrink-0 rounded-full", option.dot)} />
          <span className="flex-1">{option.label}</span>
          <span className="text-xs text-muted-foreground tabular-nums">{option.count}</span>
          <CheckIcon className={cn("size-4 shrink-0", !option.checked && "invisible")} />
        </NavbarPanelItem>
      ))}
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
