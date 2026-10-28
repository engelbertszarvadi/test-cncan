import type { ComponentType } from "react"
import { HashRouter, Navigate, useLocation } from "react-router-dom"

import { AllQuestionsPage } from "@/pages/all-questions"
import { ExamPage } from "@/pages/exam"
import { InfinitePage } from "@/pages/infinite"
import { TABS } from "@/lib/tabs"

const tabPages: Record<(typeof TABS)[number]["path"], ComponentType> = {
  "/": ExamPage,
  "/infinite": InfinitePage,
  "/all": AllQuestionsPage,
}

function TabScreens() {
  const { pathname } = useLocation()

  if (!TABS.some((tab) => tab.path === pathname)) return <Navigate to="/" replace />

  return TABS.map(({ path }) => {
    const Page = tabPages[path]
    const active = pathname === path
    return (
      <div key={path} hidden={!active}>
        <Page />
      </div>
    )
  })
}

export default function App() {
  return (
    <HashRouter>
      <TabScreens />
    </HashRouter>
  )
}
