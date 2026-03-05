import { Head, router } from "@inertiajs/react"
import { Link } from "@inertiajs/react"

import PfLayout from "@/layouts/pf/pf-layout"

interface TestType {
  id: number
  name: string
  unit: string | null
}

interface PlayerData {
  id: number
  full_name: string
  functional_role: string | null
  evals: { test_id: number; value: number | null; date: string | null }[]
}

interface Props {
  players: PlayerData[]
  test_types: TestType[]
  category: { id: number; name: string } | null
}

export default function PfSquadIndex({ players, test_types, category }: Props) {
  return (
    <PfLayout>
      <Head title="PF - Plantel" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Plantel</h1>
            {category && <p className="text-sm text-gray-500 mt-1">Categoria {category.name}</p>}
          </div>
          <Link
            href="/pf/eval_types"
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            Tipos de evaluacion
          </Link>
        </div>

        {test_types.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <p className="text-gray-400 text-sm">No hay tipos de evaluacion configurados.</p>
            <Link href="/pf/eval_types/new" className="mt-3 inline-block text-sm font-medium text-bordo-700 hover:underline">
              Crear primer tipo
            </Link>
          </div>
        ) : players.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <p className="text-gray-400 text-sm">No hay jugadores en esta categoria.</p>
          </div>
        ) : (
          <>
            {/* Mobile: card list */}
            <div className="sm:hidden space-y-3">
              {players.map((p) => (
                <button
                  key={p.id}
                  onClick={() => router.visit(`/pf/squad/${p.id}`)}
                  className="w-full text-left block rounded-xl border border-gray-200 bg-white shadow-sm p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">{p.full_name}</p>
                      {p.functional_role && <p className="text-xs text-gray-400 mt-0.5">{p.functional_role}</p>}
                    </div>
                    <span className="text-gray-300 text-lg">›</span>
                  </div>
                  {test_types.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
                      {p.evals.filter((ev) => ev.value !== null).slice(0, 4).map((ev) => {
                        const tt = test_types.find((t) => t.id === ev.test_id)
                        return (
                          <div key={ev.test_id} className="text-xs">
                            <span className="text-gray-400">{tt?.name}: </span>
                            <span className="font-semibold text-gray-700">{ev.value}{tt?.unit ? ` ${tt.unit}` : ""}</span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden sm:block rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="sticky left-0 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-44">
                        Jugador
                      </th>
                      {test_types.map((t) => (
                        <th key={t.id} className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          {t.name}
                          {t.unit && <span className="font-normal normal-case text-gray-400 ml-1">({t.unit})</span>}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {players.map((p) => (
                      <tr
                        key={p.id}
                        onClick={() => router.visit(`/pf/squad/${p.id}`)}
                        className="hover:bg-gray-50 cursor-pointer"
                      >
                        <td className="sticky left-0 z-10 bg-white px-4 py-3 hover:bg-gray-50">
                          <div className="font-medium text-gray-800">{p.full_name}</div>
                          {p.functional_role && <div className="text-xs text-gray-400">{p.functional_role}</div>}
                        </td>
                        {p.evals.map((ev) => (
                          <td key={ev.test_id} className="px-4 py-3 text-center">
                            {ev.value !== null ? (
                              <div>
                                <span className="font-semibold text-gray-800">{ev.value}</span>
                                {ev.date && <div className="text-xs text-gray-400 mt-0.5">{ev.date}</div>}
                              </div>
                            ) : (
                              <span className="text-gray-300">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </PfLayout>
  )
}
