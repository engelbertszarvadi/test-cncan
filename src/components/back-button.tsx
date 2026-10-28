import { ChevronLeftIcon } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"

export function BackButton({ to = "/" }: { to?: string }) {
  return (
    <Button asChild variant="ghost" size="icon-lg" className="-ml-2 size-10">
      <Link to={to} aria-label="Înapoi">
        <ChevronLeftIcon className="size-5" />
      </Link>
    </Button>
  )
}
