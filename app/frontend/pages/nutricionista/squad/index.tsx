import { Head, Link, router } from "@inertiajs/react"
import { useState } from "react"
import { BookmarkPlus, BookmarkX, Scale, Users } from "lucide-react"

import NutriLayout from "@/layouts/nutricionista/nutri-layout"

interface Player {
  id: number
  full_name: string
  functional_role: string | null
  weight_kg: number | null
  muscle_mass_kg: number | null
  fat_mass_kg: number | null
  last_date: string | null
}

interface Props {
  players: Player[]   // not tracked
  tracking: Player[]  // tracked
}

function addTracking(id: number) {
  router.post(`/nutricionista/squad/${id}/add_tracking`, {}, { preserveScroll: true })
}

function removeTracking(id: number, name: string) {
  if (confirm(`¿Quitar a ${name} del seguimiento?`)) {
    router.delete(`/nutricionista/squad/${id}/remove_tracking`, { preserveScroll: true })
  }
}

function PlayerRow({ p, onAction, actionIcon, actionClass }: {
  p: Player
  onAction: () => void
  actionIcon: React.ReactNode
  actionClass: string
}) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3">
        <div className="font-medium text-gray-800">{p.full_name}</div>
        {p.functional_role && <div className="text-xs text-gray-400">{p.functional_role}</div>}
      </td>
      <td className="px-4 py-3 text-center font-semibold text-gray-800">
        {p.weight_kg ?? <span className="text-gray-300">—</span>}
      </td>
      <td className="px-4 py-3 text-center text-gray-600">
        {p.muscle_mass_kg ?? <span className="text-gray-300">—</span>}
      </td>
      <td className="px-4 py-3 text-center text-gray-600">
        {p.fat_mass_kg ?? <span className="text-gray-300">—</span>}
      </td>
      <td className="px-4 py-3 text-center">
        {p.last_date ? (
          <span className="text-gray-600">{p.last_date}</span>
        ) : (
          <span className="text-xs text-red-400 font-medium">Sin pesaje</span>
        )}
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-2">
          <Link href={`/nutricionista/squad/${p.id}`} className="text-xs font-medium text-bordo-700 hover:underline flex items-center gap-1">
            <Scale className="h-3.5 w-3.5" /> Ver
          </Link>
          <button
            onClick={onAction}
            className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-colors ${actionClass}`}
          >
            {actionIcon}
          </button>
        </div>
      </td>
    </tr>
  )
}

export default function NutriSquadIndex({ players, tracking }: Props) {
  const [tab, setTab] = useState<"plantel" | "seguimiento">("plantel")

  return (
    <NutriLayout>
      <Head title="Nutrición — Plantel" />

      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Plantel</h1>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200">
          {(["plantel", "seguimiento"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium capitalize border-b-2 -mb-px transition-colors ${
                tab === t
                  ? "border-bordo-700 text-bordo-800"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {t === "plantel"
                ? `Todos (${players.length})`
                : `Seguimiento (${tracking.length})`}
            </button>
          ))}
        </div>

        {/* PLANTEL — todos los no seguidos */}
        {tab === "plantel" && (
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            {players.length === 0 ? (
              <p className="px-6 py-10 text-center text-sm text-gray-400">
                Todos los jugadores están en seguimiento.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Jugador</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Peso</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">M. Musc.</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Grasa</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Último pesaje</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {players.map((p) => (
                      <PlayerRow
                        key={p.id}
                        p={p}
                        onAction={() => addTracking(p.id)}
                        actionIcon={<BookmarkPlus className="h-3.5 w-3.5" />}
                        actionClass="bg-bordo-50 text-bordo-700 hover:bg-bordo-100"
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* SEGUIMIENTO — jugadores seleccionados */}
        {tab === "seguimiento" && (
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            {tracking.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <Users className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-400">No hay jugadores en seguimiento.</p>
                <p className="text-xs text-gray-300 mt-1">Agregá desde la pestaña Todos.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-green-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Jugador</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-green-700 uppercase tracking-wider">Peso</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-green-700 uppercase tracking-wider">M. Musc.</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-green-700 uppercase tracking-wider">Grasa</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-green-700 uppercase tracking-wider">Último pesaje</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {tracking.map((p) => (
                      <PlayerRow
                        key={p.id}
                        p={p}
                        onAction={() => removeTracking(p.id, p.full_name)}
                        actionIcon={<BookmarkX className="h-3.5 w-3.5" />}
                        actionClass="bg-red-50 text-red-500 hover:bg-red-100"
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </NutriLayout>
  )
}
