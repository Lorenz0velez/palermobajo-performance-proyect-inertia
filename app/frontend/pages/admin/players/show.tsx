import { Head, Link } from "@inertiajs/react"
import { ArrowLeft } from "lucide-react"

import AdminLayout from "@/layouts/admin/admin-layout"

interface Player {
  id: number
  first_name: string | null
  last_name: string | null
  full_name: string
  dni: string
  birth_date: string | null
  birth_date_display: string | null
  active: boolean
  functional_role: string | null
  categories: string[]
  linked_user: { id: number; email: string } | null
}

interface Props {
  player: Player
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-800">{value ?? <span className="text-gray-300">—</span>}</dd>
    </div>
  )
}

export default function AdminPlayersShow({ player }: Props) {
  return (
    <AdminLayout>
      <Head title={`Admin — ${player.full_name}`} />

      <div className="max-w-2xl space-y-6">
        {/* Back + header */}
        <div className="flex items-center gap-4">
          <Link
            href="/admin/players"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 shadow-sm"
          >
            <ArrowLeft className="h-4 w-4 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{player.full_name}</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {player.active ? (
                <span className="text-green-600 font-medium">Activo</span>
              ) : (
                <span className="text-red-500 font-medium">Inactivo</span>
              )}
            </p>
          </div>
        </div>

        {/* Datos básicos */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Datos del jugador</h2>
          <dl className="grid grid-cols-2 gap-5">
            <Field label="DNI"              value={player.dni} />
            <Field label="Fecha de nacimiento" value={player.birth_date_display} />
            <Field label="Rol funcional"    value={player.functional_role} />
            <Field label="Categorías"       value={player.categories.length > 0 ? player.categories.join(", ") : "Sin categoría"} />
          </dl>
        </div>

        {/* Usuario vinculado */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Usuario del sistema</h2>
          {player.linked_user ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">{player.linked_user.email}</p>
                <p className="text-xs text-gray-400">ID #{player.linked_user.id}</p>
              </div>
              <Link
                href={`/admin/users/${player.linked_user.id}`}
                className="text-xs font-medium text-bordo-700 hover:underline"
              >
                Ver usuario →
              </Link>
            </div>
          ) : (
            <p className="text-sm text-gray-400">Sin usuario vinculado.</p>
          )}
        </div>

        {/* Acciones */}
        <div className="flex gap-3">
          <Link
            href={`/admin/players/${player.id}/edit`}
            className="rounded-lg bg-bordo-700 px-5 py-2 text-sm font-semibold text-white hover:bg-bordo-600 transition-colors"
          >
            Editar jugador
          </Link>
          <Link
            href="/admin/players"
            className="rounded-lg border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Volver al listado
          </Link>
        </div>
      </div>
    </AdminLayout>
  )
}
