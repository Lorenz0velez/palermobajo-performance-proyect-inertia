import AdminLayout from "@/layouts/admin/admin-layout"
import { Link } from "@inertiajs/react"
import { Plus, Link2, Link2Off } from "lucide-react"

interface Player {
  id: number
  first_name: string
  last_name: string
  full_name: string
  dni: string
  birth_date: string | null
  active: boolean
  functional_role: string | null
  categories: string[]
  linked_user: { id: number; email: string } | null
}

interface Props {
  players: Player[]
}

export default function AdminPlayersIndex({ players }: Props) {
  const active   = players.filter((p) => p.active)
  const inactive = players.filter((p) => !p.active)

  return (
    <AdminLayout>
      <div className="max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Jugadores</h1>
          <Link
            href="/admin/players/new"
            className="flex items-center gap-2 rounded-lg bg-bordo-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-bordo-800 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nuevo jugador
          </Link>
        </div>

        <PlayerTable players={active} title={`Activos (${active.length})`} />

        {inactive.length > 0 && (
          <div className="mt-8">
            <PlayerTable players={inactive} title={`Inactivos (${inactive.length})`} muted />
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

function PlayerTable({ players, title, muted = false }: { players: Player[]; title: string; muted?: boolean }) {
  if (players.length === 0) return null

  return (
    <div>
      <h2 className={`text-sm font-semibold uppercase tracking-widest mb-3 ${muted ? "text-gray-400" : "text-gray-600"}`}>
        {title}
      </h2>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Jugador</th>
              <th className="px-4 py-3 text-left font-medium">DNI</th>
              <th className="px-4 py-3 text-left font-medium">Puesto</th>
              <th className="px-4 py-3 text-left font-medium">Categorías</th>
              <th className="px-4 py-3 text-left font-medium">Cuenta</th>
              <th className="px-4 py-3 text-left font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {players.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{p.full_name}</td>
                <td className="px-4 py-3 text-gray-500 font-mono">{p.dni}</td>
                <td className="px-4 py-3 text-gray-500">{p.functional_role ?? "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {p.categories.length > 0
                      ? p.categories.map((c) => (
                          <span key={c} className="rounded-full bg-bordo-100 px-2 py-0.5 text-xs font-medium text-bordo-700">{c}</span>
                        ))
                      : <span className="text-gray-400">—</span>
                    }
                  </div>
                </td>
                <td className="px-4 py-3">
                  {p.linked_user ? (
                    <span className="flex items-center gap-1 text-green-600 text-xs">
                      <Link2 className="h-3.5 w-3.5" />
                      {p.linked_user.email}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-gray-400 text-xs">
                      <Link2Off className="h-3.5 w-3.5" />
                      Sin cuenta
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/players/${p.id}/edit`} className="text-xs text-bordo-600 hover:underline">
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
