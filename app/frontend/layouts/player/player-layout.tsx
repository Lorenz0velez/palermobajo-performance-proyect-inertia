import { Link, usePage } from "@inertiajs/react"
import { Activity, Apple, Dumbbell, Home, Shield as ShieldIcon } from "lucide-react"
import { type ReactNode } from "react"

import { cn } from "@/lib/utils"
import CpbHeader from "@/components/cpb-header"

interface PlayerLayoutProps {
  children: ReactNode
}

const ALL_NAV_ITEMS = [
  { label: "Inicio",         href: "/player/home",         icon: Home,       nutrition: false },
  { label: "Partidos",       href: "/player/matches",      icon: ShieldIcon, nutrition: false },
  { label: "Entrenamientos", href: "/player/trainings",    icon: Dumbbell,   nutrition: false },
  { label: "Evaluac.",       href: "/player/evaluaciones", icon: Activity,   nutrition: false },
  { label: "Nutrición",      href: "/player/nutricion",    icon: Apple,      nutrition: true  },
]

export default function PlayerLayout({ children }: PlayerLayoutProps) {
  const { url, props } = usePage<{ nutrition_tracked: boolean }>()
  const navItems = ALL_NAV_ITEMS.filter(item => !item.nutrition || props.nutrition_tracked)

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <CpbHeader profileHref="/player/profile" />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pt-14 pb-20">
        {children}
      </main>

      {/* Bottom navigation */}
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
                  "flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors",
                  isActive
                    ? "text-bordo-700"
                    : "text-gray-400 hover:text-gray-700"
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
