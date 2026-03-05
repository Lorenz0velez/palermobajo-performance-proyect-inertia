import { Link, usePage } from "@inertiajs/react"
import { Home, Users, CalendarDays } from "lucide-react"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"
import CpbHeader from "@/components/cpb-header"

interface NutriLayoutProps {
  children: ReactNode
}

const navItems = [
  { label: "Inicio",    href: "/nutricionista/home",               icon: Home         },
  { label: "Plantel",   href: "/nutricionista/squad",              icon: Users        },
  { label: "Sesiones",  href: "/nutricionista/nutrition_sessions", icon: CalendarDays },
]

export default function NutriLayout({ children }: NutriLayoutProps) {
  const { url } = usePage()

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <CpbHeader profileHref="/nutricionista/profile" />
      <div className="flex flex-1 pt-14">
        {/* Sidebar */}
        <aside className="flex w-60 flex-col bg-bordo-900 text-white min-h-[calc(100vh-3.5rem)]">
          <div className="px-4 py-3 text-xs font-semibold uppercase text-bordo-400 tracking-widest mt-2 mb-1">
            Nutrición
          </div>
          <nav className="flex flex-col gap-1 px-2 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = url.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-bordo-700 text-white"
                      : "text-bordo-200 hover:bg-bordo-800 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
