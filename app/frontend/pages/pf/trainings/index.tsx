import { Head, Link, router } from "@inertiajs/react"

import PfLayout from "@/layouts/pf/pf-layout"

interface Training {
  id: number
  date: string | null
  date_raw: string | null
  training_type: string | null
  objective: string | null
  duration_min: number | null
  perceptions: number
  for_all: boolean
  all_forwards: boolean
  all_backs: boolean
  target_roles: { name: string; group: string | null }[]
}

interface Props {
  trainings: Training[]
  category: { id: number; name: string } | null
}

function TargetBadge({ t }: { t: Training }) {
  if (t.for_all) {
    return (
      <span className="inline-block rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 text-xs font-semibold">
        Todo el plantel
      </span>
    )
  }

  const fwdRoles   = t.target_roles.filter((r) => r.group === "forward")
  const bckRoles   = t.target_roles.filter((r) => r.group === "back")
  const otherRoles = t.target_roles.filter((r) => r.group !== "forward" && r.group !== "back")

  return (
    <div className="flex flex-wrap gap-1">
      {t.all_forwards
        ? <span className="inline-block rounded-full bg-bordo-50 text-bordo-700 border border-bordo-200 px-2 py-0.5 text-xs font-semibold">Forwards</span>
        : fwdRoles.map((r) => <span key={r.name} className="inline-block rounded-full bg-bordo-50 text-bordo-700 border border-bordo-200 px-2 py-0.5 text-xs font-medium">{r.name}</span>)
      }
      {t.all_backs
        ? <span className="inline-block rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 text-xs font-semibold">Backs</span>
        : bckRoles.map((r) => <span key={r.name} className="inline-block rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 text-xs font-medium">{r.name}</span>)
      }
      {otherRoles.map((r) => (
        <span key={r.name} className="inline-block rounded-full bg-gray-100 text-gray-600 px-2 py-0.5 text-xs font-medium">{r.name}</span>
      ))}
    </div>
  )
}

export default function PfTrainingsIndex({ trainings, category }: Props) {
  return (
    <PfLayout>
      <Head title="PF — Entrenamientos" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Entrenamientos</h1>
            {category && <p className="text-sm text-gray-500 mt-1">Categoría {category.name}</p>}
          </div>
          <Link
            href="/pf/trainings/new"
            className="rounded-lg bg-bordo-700 px-4 py-2 text-sm font-semibold text-white hover:bg-bordo-600 transition-colors shadow-sm"
          >
            + Nuevo
          </Link>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {trainings.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-gray-400">No hay entrenamientos registrados.</p>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Objetivo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Dirigido a
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Duración
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Percepciones
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {trainings.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-700">{t.date ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block rounded-md bg-bordo-50 text-bordo-700 px-2 py-0.5 text-xs font-semibold capitalize">
                        {t.training_type ?? "físico"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{t.objective ?? <span className="text-gray-300">—</span>}</td>
                    <td className="px-4 py-3">
                      <TargetBadge t={t} />
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">
                      {t.duration_min ? `${t.duration_min} min` : "—"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold ${
                          t.perceptions > 0 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {t.perceptions}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {t.date_raw && t.date_raw > new Date().toISOString().slice(0, 10) && (
                          <>
                            <button
                              onClick={() => {
                                if (confirm("¿Eliminar este entrenamiento?")) {
                                  router.delete(`/pf/trainings/${t.id}`, { preserveScroll: true })
                                }
                              }}
                              className="text-xs font-medium text-red-500 hover:text-red-700"
                            >
                              Eliminar
                            </button>
                            <Link
                              href={`/pf/trainings/${t.id}/edit`}
                              className="text-xs font-medium text-gray-500 hover:text-gray-700"
                            >
                              Editar
                            </Link>
                          </>
                        )}
                        <Link
                          href={`/pf/trainings/${t.id}`}
                          className="text-xs font-medium text-bordo-700 hover:underline"
                        >
                          Ver →
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </PfLayout>
  )
}
