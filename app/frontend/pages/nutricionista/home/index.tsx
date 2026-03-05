import { Head, Link } from "@inertiajs/react"

import NutriLayout from "@/layouts/nutricionista/nutri-layout"

interface PlayerSummary {
  id: number
  full_name: string
  functional_role: string | null
  weight_kg: number | null
  muscle_mass_kg: number | null
  fat_mass_kg: number | null
  last_date: string | null
}

interface Props {
  players_summary: PlayerSummary[]
  total: number
  weighed_today: number
}

export default function NutriHome({ players_summary, total, weighed_today }: Props) {
  return (
    <NutriLayout>
      <Head title="Nutrición — Inicio" />

      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Panel de Nutrición</h1>
          <p className="text-sm text-gray-500 mt-1">Seguimiento de composición corporal del plantel</p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5 text-center">
            <p className="text-4xl font-bold text-bordo-700">{total}</p>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">Jugadores activos</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5 text-center">
            <p className="text-4xl font-bold text-green-600">{weighed_today}</p>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">Pesados hoy</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5 text-center">
            <p className="text-4xl font-bold text-gray-700">{total - weighed_today}</p>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">Pendientes</p>
          </div>
        </div>

        {/* Squad table */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Estado del Plantel</h2>
            <Link href="/nutricionista/squad" className="text-xs font-medium text-bordo-700 hover:underline">Ver plantel →</Link>
          </div>
          {players_summary.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-gray-400">No hay jugadores registrados.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Jugador</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Peso (kg)</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">M. Muscular (kg)</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Grasa (kg)</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Último pesaje</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {players_summary.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800">{p.full_name}</div>
                        {p.functional_role && <div className="text-xs text-gray-400">{p.functional_role}</div>}
                      </td>
                      <td className="px-4 py-3 text-center font-semibold text-gray-800">{p.weight_kg ?? <span className="text-gray-300">—</span>}</td>
                      <td className="px-4 py-3 text-center text-gray-600">{p.muscle_mass_kg ?? <span className="text-gray-300">—</span>}</td>
                      <td className="px-4 py-3 text-center text-gray-600">{p.fat_mass_kg ?? <span className="text-gray-300">—</span>}</td>
                      <td className="px-4 py-3 text-center text-gray-500">{p.last_date ?? <span className="text-gray-300">Sin datos</span>}</td>
                      <td className="px-4 py-3 text-right">
                        <Link href={`/nutricionista/squad/${p.id}`} className="text-xs font-medium text-bordo-700 hover:underline">Ver →</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </NutriLayout>
  )
}
