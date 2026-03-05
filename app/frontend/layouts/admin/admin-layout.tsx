import type { ReactNode } from "react"
import { Link, usePage } from "@inertiajs/react"
import { Home, Users, UserSquare2, LogOut } from "lucide-react"
import { router } from "@inertiajs/react"
import { cn } from "@/lib/utils"

interface AdminLayoutProps {
  children: ReactNode
}

const navItems = [
  { label: "Inicio",    href: "/admin/home",    icon: Home        },
  { label: "Usuarios",  href: "/admin/users",   icon: Users       },
  { label: "Jugadores", href: "/admin/players", icon: UserSquare2 },
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { url } = usePage()

  const handleLogout = () => {
    router.delete("/sessions/0", { preserveState: false })
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="flex w-60 flex-col bg-bordo-900 text-white">
        <div className="flex items-center gap-2 px-6 py-5 border-b border-bordo-700">
          <span className="text-xl font-bold tracking-tight">Palermo Bajo</span>
        </div>
        <div className="px-4 py-2 text-xs font-semibold uppercase text-bordo-400 tracking-widest mt-4 mb-1">
          Admin
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
                <Icon className="h-4.5 w-4.5" />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-bordo-700">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-bordo-300 hover:bg-bordo-800 hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="flex flex-1 flex-col min-h-screen overflow-auto">
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
