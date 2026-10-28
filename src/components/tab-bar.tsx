import { NavLink } from "react-router-dom"

import { TABS } from "@/lib/tabs"
import { cn } from "@/lib/utils"

export function TabBar() {
  return (
    <nav aria-label="Navigare principală" className="border-t bg-background px-1 pt-1 pb-[18px]">
      <div className="mx-auto grid max-w-2xl grid-cols-3 gap-1">
        {TABS.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end
            className={({ isActive }) =>
              cn(
                "group/tab flex flex-col items-center gap-0.5 rounded-xl py-1.5 text-[11px] font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                isActive ? "active text-foreground" : "text-muted-foreground"
              )
            }
          >
            <tab.icon className="size-5 fill-background group-[.active]/tab:fill-yellow-400" />
            {tab.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
