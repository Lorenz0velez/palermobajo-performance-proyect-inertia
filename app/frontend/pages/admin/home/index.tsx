import AdminLayout from "@/layouts/admin/admin-layout"
import { Link } from "@inertiajs/react"
import { Users, UserSquare2, AlertCircle } from "lucide-react"

interface Stats {
  pending_users: number
  total_players: number
  unlinked_players: number
}

interface Props {
  stats: Stats
}

export default function AdminHome({ stats }: Props) {
  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Panel de administración</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          <StatCard
            label="Usuarios pendientes"
            value={stats.pending_users}
            icon={<AlertCircle className="h-5 w-5 text-amber-500" />}
            href="/admin/users"
            accent={stats.pending_users > 0 ? "amber" : "gray"}
          />
          <StatCard
            label="Jugadores registrados"
            value={stats.total_players}
            icon={<UserSquare2 className="h-5 w-5 text-bordo-600" />}
            href="/admin/players"
            accent="bordo"
          />
          <StatCard
            label="Sin cuenta vinculada"
            value={stats.unlinked_players}
            icon={<Users className="h-5 w-5 text-gray-500" />}
            href="/admin/players"
            accent="gray"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <QuickAction
            title="Aprobar usuarios pendientes"
            description="Revisá solicitudes de registro de jugadores y entrenadores."
            href="/admin/users"
            badge={stats.pending_users > 0 ? String(stats.pending_users) : undefined}
          />
          <QuickAction
            title="Cargar jugador manualmente"
            description="Registrá un jugador nuevo con su DNI y categoría."
            href="/admin/players/new"
          />
        </div>
      </div>
    </AdminLayout>
  )
}

function StatCard({
  label, value, icon, href, accent
}: {
  label: string
  value: number
  icon: React.ReactNode
  href: string
  accent: "amber" | "bordo" | "gray"
}) {
  const border = accent === "amber" ? "border-amber-300" : accent === "bordo" ? "border-bordo-300" : "border-gray-200"
  return (
    <Link href={href} className={`flex flex-col gap-3 rounded-xl border-2 ${border} bg-white p-5 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        {icon}
      </div>
      <span className="text-4xl font-bold text-gray-900">{value}</span>
    </Link>
  )
}

function QuickAction({ title, description, href, badge }: { title: string; description: string; href: string; badge?: string }) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-1 rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-2">
        <span className="font-semibold text-gray-800">{title}</span>
        {badge && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">{badge}</span>
        )}
      </div>
      <p className="text-sm text-gray-500">{description}</p>
    </Link>
  )
}
