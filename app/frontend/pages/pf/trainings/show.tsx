import { Head, Link } from "@inertiajs/react"
import { ArrowLeft, FileText } from "lucide-react"

import PfLayout from "@/layouts/pf/pf-layout"

interface Training {
  id: number
  date: string | null
  date_raw: string | null
  training_type: string | null
  objective: string | null
  notes: string | null
  duration_min: number | null
  perceptions: number
  for_all: boolean
  all_forwards: boolean
  all_backs: boolean
  target_roles: { name: string; group: string | null }[]
  pdf_url: string | null
}

interface Perception {
  player_name: string
  group: string | null
  rpe: number | null
  perceived_load: number | null
  fatigue_level: number | null
  injury_impact: number | null
  comments: string | null
}

interface Props {
  training: Training
  perceptions: Perception[]
}

function TargetBadges({ training }: { training: Training }) {
  if (training.for_all) {
    return (
      <span className="inline-block rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 text-xs font-semibold">
        Todo el plantel
      </span>
    )
  }
  const forwards = training.target_roles.filter((r) => r.group === "forward")
  const backs    = training.target_roles.filter((r) => r.group === "back")
  return (
    <>
      {training.all_forwards
        ? <span className="inline-block rounded-full bg-bordo-50 text-bordo-700 border border-bordo-200 px-2 py-0.5 text-xs font-semibold">Forwards</span>
        : forwards.map((r) => <span key={r.name} className="inline-block rounded-full bg-bordo-50 text-bordo-700 border border-bordo-200 px-2 py-0.5 text-xs font-medium">{r.name}</span>)
      }
      {training.all_backs
        ? <span className="inline-block rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 text-xs font-semibold">Backs</span>
        : backs.map((r) => <span key={r.name} className="inline-block rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 text-xs font-medium">{r.name}</span>)
      }
    </>
  )
}

export default function PfTrainingsShow({ training, perceptions }: Props) {
  const today = new Date().toISOString().slice(0, 10)
  const isFuture = !!training.date_raw && training.date_raw > today

  const forwards = perceptions.filter((p) => p.group === "forward")
  const backs    = perceptions.filter((p) => p.group === "back")
  const other    = perceptions.filter((p) => p.group !== "forward" && p.group !== "back")

  function groupAvg(list: Perception[], key: keyof Perception) {
    const vals = list.map((p) => p[key]).filter((v): v is number => typeof v === "number")
    if (vals.length === 0) return null
    return (vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(1)
  }

  return (
    <PfLayout>
      <Head title={`PF — Entrenamiento ${training.date ?? ""}`} />

      <div className="space-y-6">
        {/* Back + header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/pf/trainings"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 shadow-sm"
            >
              <ArrowLeft className="h-4 w-4 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Entrenamiento — {training.date ?? "Sin fecha"}
              </h1>
              <p className="text-sm text-gray-500 capitalize">
                {training.training_type ?? "físico"}
                {training.duration_min && ` · ${training.duration_min} min`}
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1">
                <TargetBadges training={training} />
              </div>
            </div>
          </div>
          <Link
            href={`/pf/trainings/${training.id}/edit`}
            className={`shrink-0 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors ${isFuture ? "" : "hidden"}`}
          >
            Editar
          </Link>
        </div>

        {/* Info card */}
        {(training.objective || training.notes || training.pdf_url) && (
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 space-y-4">
            {training.objective && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Objetivo
                </label>
                <p className="text-gray-700">{training.objective}</p>
              </div>
            )}
            {training.notes && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Notas
                </label>
                <p className="text-gray-600 text-sm">{training.notes}</p>
              </div>
            )}
            {training.pdf_url && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Planificación
                </label>
                <a
                  href={training.pdf_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-bordo-200 bg-bordo-50 px-4 py-2.5 text-sm font-medium text-bordo-700 hover:bg-bordo-100 transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  Ver PDF de planificación
                </a>
              </div>
            )}
          </div>
        )}

        {/* Stats summary */}
        {perceptions.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5 text-center">
              <p className="text-3xl font-bold text-bordo-700">{perceptions.length}</p>
              <p className="text-xs text-gray-500 mt-1">Percepciones</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5 text-center">
              <p className="text-3xl font-bold text-gray-800">{groupAvg(perceptions, "rpe") ?? "—"}</p>
              <p className="text-xs text-gray-500 mt-1">RPE Promedio</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5 text-center">
              <p className="text-3xl font-bold text-gray-800">
                {perceptions.filter((p) => p.injury_impact !== null && p.injury_impact > 1).length}
              </p>
              <p className="text-xs text-gray-500 mt-1">Con impacto físico</p>
            </div>
          </div>
        )}

        {/* Perceptions grouped by forward / back */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Percepciones por grupo</h2>
          </div>
          {perceptions.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-gray-400">
              No hay percepciones registradas para este entrenamiento.
            </p>
          ) : (
            <div className="divide-y divide-gray-100">
              {([
                { label: "Forwards", list: forwards, headerCls: "bg-bordo-50", labelCls: "text-bordo-700", metaCls: "text-bordo-500" },
                { label: "Backs",    list: backs,    headerCls: "bg-blue-50",   labelCls: "text-blue-700",  metaCls: "text-blue-500"  },
                { label: "Otros",    list: other,    headerCls: "bg-gray-50",   labelCls: "text-gray-600",  metaCls: "text-gray-400"  },
              ]).filter(({ list }) => list.length > 0).map(({ label, list, headerCls, labelCls, metaCls }) => {
                const comments = list.map((p) => p.comments).filter(Boolean) as string[]
                return (
                  <div key={label} className="px-6 py-5 space-y-4">
                    {/* Group title */}
                    <span className={`text-xs font-bold uppercase tracking-wider ${labelCls}`}>
                      {label} · {list.length} respuesta{list.length !== 1 ? "s" : ""}
                    </span>

                    {/* Metric cards */}
                    <div className={`grid grid-cols-4 gap-3 rounded-xl p-4 ${headerCls}`}>
                      {[
                        { label: "RPE",          key: "rpe"            },
                        { label: "Carga",        key: "perceived_load" },
                        { label: "Fatiga",       key: "fatigue_level"  },
                        { label: "Imp. físico",  key: "injury_impact"  },
                      ].map(({ label: ml, key }) => (
                        <div key={key} className="text-center">
                          <p className={`text-2xl font-bold ${labelCls}`}>
                            {groupAvg(list, key as keyof Perception) ?? "—"}
                          </p>
                          <p className={`text-xs mt-0.5 ${metaCls}`}>{ml}</p>
                        </div>
                      ))}
                    </div>

                    {/* Comments */}
                    {comments.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Comentarios</p>
                        {comments.map((c, i) => (
                          <p key={i} className="rounded-lg bg-gray-50 border border-gray-100 px-4 py-2.5 text-sm text-gray-600 italic">
                            "{c}"
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </PfLayout>
  )
}
