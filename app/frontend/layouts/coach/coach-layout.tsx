import type { ReactNode } from "react"
import { Link, usePage } from "@inertiajs/react"
import { Home, Users, Dumbbell, BarChart2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface CoachLayoutProps {
  children: ReactNode
}

const navItems = [
  { label: "Inicio",         href: "/coach/home",      icon: Home     },
  { label: "Plantel",        href: "/coach/squad",     icon: Users    },
  { label: "Entrenamientos", href: "/coach/trainings", icon: Dumbbell },
  { label: "Estadísticas",   href: "/coach/stats",     icon: BarChart2},
]

export default function CoachLayout({ children }: CoachLayoutProps) {
  const { url } = usePage()

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white">
        <div className="flex">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = url.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors",
                  isActive ? "text-bordo-700" : "text-gray-400 hover:text-gray-700"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive && "text-bordo-700")} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 h-0.5 w-10 rounded-full bg-bordo-700" />
                )}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
