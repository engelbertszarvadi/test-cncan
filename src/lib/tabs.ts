import { BookOpenIcon, HouseIcon, InfinityIcon } from "lucide-react"

export const TABS = [
  { path: "/", label: "Acasă", icon: HouseIcon },
  { path: "/infinite", label: "Infinit", icon: InfinityIcon },
  { path: "/all", label: "Întrebări", icon: BookOpenIcon },
] as const
