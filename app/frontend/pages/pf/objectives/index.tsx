import { Head, Link } from "@inertiajs/react"

import PfLayout from "@/layouts/pf/pf-layout"

interface Objective {
  id: number
  category: string
  functional_role: string
  test_name: string
  test_unit: string | null
  green_threshold: number | null
  yellow_threshold: number | null
  threshold_type: string | null
  start_date: string | null
  end_date: string | null
}

interface Props {
  objectives: Objective[]
}

export default function PfObjectivesIndex({ objectives }: Props) {
  return (
    <PfLayout>
      <Head title="PF — Objetivos Físicos" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Objetivos Físicos</h1>
            <p className="text-sm text-gray-500 mt-1">Metas por categoría y rol funcional</p>
          </div>
          <Link
            href="/pf/objectives/new"
            className="rounded-lg bg-bordo-700 px-4 py-2 text-sm font-semibold text-white hover:bg-bordo-600 transition-colors shadow-sm"
          >
            + Nuevo objetivo
          </Link>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {objectives.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-gray-400">No hay objetivos configurados aún.</p>
              <Link href="/pf/objectives/new" className="mt-2 inline-block text-sm font-medium text-bordo-700 hover:underline">
                Crear el primero →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoría</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rol</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Prueba</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-400 mr-1" />
                      Verde (≥)
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400 mr-1" />
                      Amarillo (≥)
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Vigencia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {objectives.map((obj) => (
                    <tr key={obj.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">{obj.category}</td>
                      <td className="px-4 py-3 text-gray-600">{obj.functional_role}</td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-gray-800">{obj.test_name}</span>
                        {obj.test_unit && <span className="ml-1 text-xs text-gray-400">({obj.test_unit})</span>}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {obj.green_threshold !== null ? (
                          <span className="inline-block rounded-md bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                            {obj.green_threshold}
                          </span>
                        ) : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {obj.yellow_threshold !== null ? (
                          <span className="inline-block rounded-md bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                            {obj.yellow_threshold}
                          </span>
                        ) : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3 text-center text-xs text-gray-500">
                        {obj.start_date ?? "—"}{obj.end_date ? ` → ${obj.end_date}` : " →"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </PfLayout>
  )
}
