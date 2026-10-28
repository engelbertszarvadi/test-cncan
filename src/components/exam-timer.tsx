import { TimerIcon } from "lucide-react"
import { useEffect, useState } from "react"

import { formatDuration } from "@/lib/format"

export function ExamTimer({ startedAt }: { startedAt: number }) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(interval)
  }, [])

  return (
    <span
      className="flex items-center gap-1 text-sm leading-none font-medium text-muted-foreground tabular-nums"
      aria-label="Timp scurs"
    >
      <TimerIcon className="size-4 shrink-0" />
      <span className="translate-y-px">{formatDuration(now - startedAt)}</span>
    </span>
  )
}
