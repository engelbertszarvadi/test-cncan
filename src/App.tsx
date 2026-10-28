import { HashRouter, Navigate, Route, Routes } from "react-router-dom"

import { AllQuestionsPage } from "@/pages/all-questions"
import { ExamPage } from "@/pages/exam"
import { InfinitePage } from "@/pages/infinite"

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<ExamPage />} />
        <Route path="/all" element={<AllQuestionsPage />} />
        <Route path="/infinite" element={<InfinitePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}
