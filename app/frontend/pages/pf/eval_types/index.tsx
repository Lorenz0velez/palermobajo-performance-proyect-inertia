import { Head, Link, router } from "@inertiajs/react"

import PfLayout from "@/layouts/pf/pf-layout"

interface EvalType {
  id: number
  name: string
  unit: string | null
  active: boolean
}

interface Props {
  types: EvalType[]
}

export default function PfEvalTypesIndex({ types }: Props) {
  function toggle(id: number) {
    router.patch(`/pf/eval_types/${id}/toggle`, {}, { preserveScroll: true })
  }

  const active   = types.filter((t) => t.active)
  const inactive = types.filter((t) => !t.active)

  return (
    <PfLayout>
      <Head title="PF — Tipos de Evaluacion" />

      <div className="max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Tipos de Evaluacion</h1>
          <Link
            href="/pf/eval_types/new"
            className="rounded-lg bg-bordo-700 px-4 py-2 text-sm font-semibold text-white hover:bg-bordo-600 transition-colors shadow-sm"
          >
            + Nuevo
          </Link>
        </div>

        {types.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <p className="text-sm text-gray-400">No hay tipos de evaluacion configurados.</p>
            <Link href="/pf/eval_types/new" className="mt-2 inline-block text-sm font-medium text-bordo-700 hover:underline">
              Crear el primero
            </Link>
          </div>
        ) : (
          <>
            {/* Active */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Activos ({active.length})
                </span>
                <span className="text-xs text-gray-400">Se muestran en el plantel</span>
              </div>
              {active.length === 0 ? (
                <p className="px-6 py-6 text-sm text-gray-400 text-center">Ningun tipo activo.</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {active.map((t) => (
                    <li key={t.id} className="flex items-center justify-between px-4 py-3">
                      <div>
                        <span className="font-medium text-gray-800">{t.name}</span>
                        {t.unit && <span className="ml-2 text-xs text-gray-400">({t.unit})</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/pf/eval_types/${t.id}/edit`}
                          className="text-xs font-medium text-gray-500 hover:text-gray-700 rounded-md border border-gray-200 px-2.5 py-1"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => toggle(t.id)}
                          className="text-xs font-medium text-gray-500 hover:text-red-600 transition-colors rounded-md border border-gray-200 px-2.5 py-1 hover:border-red-200"
                        >
                          Ocultar
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Inactive */}
            {inactive.length > 0 && (
              <div className="rounded-xl border border-gray-200 bg-gray-50 shadow-sm overflow-hidden">
                <div className="px-4 py-3 bg-gray-100 border-b border-gray-200">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Ocultos ({inactive.length})
                  </span>
                </div>
                <ul className="divide-y divide-gray-200">
                  {inactive.map((t) => (
                    <li key={t.id} className="flex items-center justify-between px-4 py-3">
                      <div>
                        <span className="font-medium text-gray-400">{t.name}</span>
                        {t.unit && <span className="ml-2 text-xs text-gray-300">({t.unit})</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/pf/eval_types/${t.id}/edit`}
                          className="text-xs font-medium text-gray-400 hover:text-gray-600 rounded-md border border-gray-200 px-2.5 py-1"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => toggle(t.id)}
                          className="text-xs font-medium text-bordo-700 hover:text-bordo-600 transition-colors rounded-md border border-bordo-200 bg-bordo-50 px-2.5 py-1 hover:bg-bordo-100"
                        >
                          Activar
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </PfLayout>
  )
}
