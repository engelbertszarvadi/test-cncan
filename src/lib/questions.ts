import data from "@/data/questions.json"

export type CategoryKey = "radioprotectie" | "legislatie" | "operationala"

export type Question = {
  id: number
  globalId: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  category: string
}

type Category = {
  key: CategoryKey
  name: string
  shortName: string
  count: number
  styles: {
    dot: string
    badge: string
    panel: string
    selected: string
  }
}

const questionBank = data as Record<CategoryKey, Question[]>

export const CATEGORY_KEYS: CategoryKey[] = ["radioprotectie", "legislatie", "operationala"]

export const CATEGORIES: Record<CategoryKey, Category> = {
  radioprotectie: {
    key: "radioprotectie",
    name: "Întrebări de radioprotecție",
    shortName: "Radioprotecție",
    count: questionBank.radioprotectie.length,
    styles: {
      dot: "bg-blue-500",
      badge: "bg-blue-100 text-blue-800",
      panel: "border-blue-200 bg-blue-50/60",
      selected: "border-blue-500 bg-blue-50 text-blue-950",
    },
  },
  legislatie: {
    key: "legislatie",
    name: "Întrebări de legislație de bază",
    shortName: "Legislație",
    count: questionBank.legislatie.length,
    styles: {
      dot: "bg-green-500",
      badge: "bg-green-100 text-green-800",
      panel: "border-green-200 bg-green-50/60",
      selected: "border-green-500 bg-green-50 text-green-950",
    },
  },
  operationala: {
    key: "operationala",
    name: "Întrebări de radioprotecție operațională",
    shortName: "Operațională",
    count: questionBank.operationala.length,
    styles: {
      dot: "bg-purple-500",
      badge: "bg-purple-100 text-purple-800",
      panel: "border-purple-200 bg-purple-50/60",
      selected: "border-purple-500 bg-purple-50 text-purple-950",
    },
  },
}

export const TOTAL_QUESTIONS = CATEGORY_KEYS.reduce((sum, key) => sum + CATEGORIES[key].count, 0)

export const EXAM_QUESTIONS_PER_CATEGORY = 20
export const PASS_PERCENTAGE = 80

export function questionsFor(keys: CategoryKey[]): Question[] {
  return keys.flatMap((key) => questionBank[key])
}

export function shuffle<T>(items: T[]): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function pickExamQuestions(): Question[] {
  return shuffle(
    CATEGORY_KEYS.flatMap((key) => shuffle(questionBank[key]).slice(0, EXAM_QUESTIONS_PER_CATEGORY))
  )
}

export function questionKey(question: Question): string {
  return `${question.category}|${question.id}`
}

export function normalizeText(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
}

export function optionLetter(index: number): string {
  return String.fromCharCode(65 + index)
}
