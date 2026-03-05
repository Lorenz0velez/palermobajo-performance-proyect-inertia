import { Head, Link, useForm } from "@inertiajs/react"
import { ArrowLeft, Upload, X } from "lucide-react"

import CoachLayout from "@/layouts/coach/coach-layout"

interface FunctionalRole {
  id: number
  name: string
  group: "forward" | "back" | null
}

interface Props {
  today: string
  functional_roles: FunctionalRole[]
}

const TRAINING_TYPES = [
  "Fisico", "Tecnica", "Tactica", "Fisico + Tecnica",
  "Tecnica + Linea", "Fisico + Scrum", "Match practice", "Recuperacion"
]

export default function CoachTrainingsNew({ today, functional_roles }: Props) {
  const { data, setData, post, processing } = useForm<{
    date: string
    start_time: string
    end_time: string
    duration_min: string
    training_type: string
    objective: string
    notes: string
    functional_role_ids: number[]
    pdf_file: File | null
  }>({
    date:                today,
    start_time:          "19:00",
    end_time:            "21:00",
    duration_min:        "",
    training_type:       "Fisico",
    objective:           "",
    notes:               "",
    functional_role_ids: [],
    pdf_file:            null,
  })

  const forwards   = functional_roles.filter((fr) => fr.group === "forward")
  const backs      = functional_roles.filter((fr) => fr.group === "back")
  const forwardIds = forwards.map((fr) => fr.id)
  const backIds    = backs.map((fr) => fr.id)
  const forwardsOn = forwardIds.length > 0 && forwardIds.every((id) => data.functional_role_ids.includes(id))
  const backsOn    = backIds.length > 0 && backIds.every((id) => data.functional_role_ids.includes(id))
  const anyForward = forwards.some((fr) => data.functional_role_ids.includes(fr.id))
  const anyBack    = backs.some((fr) => data.functional_role_ids.includes(fr.id))

  const total = data.functional_role_ids.length
  const targetLabel =
    total === 0 ? "Todo el plantel"
    : forwardsOn && backsOn ? "Forwards + Backs"
    : forwardsOn ? "Forwards"
    : backsOn ? "Backs"
    : `${total} rol${total !== 1 ? "es" : ""}`

  function toggleGroup(groupIds: number[], isOn: boolean) {
    if (isOn) {
      setData("functional_role_ids", data.functional_role_ids.filter((id) => !groupIds.includes(id)))
    } else {
      setData("functional_role_ids", [...new Set([...data.functional_role_ids, ...groupIds])])
    }
  }

  function toggleRole(id: number) {
    if (data.functional_role_ids.includes(id)) {
      setData("functional_role_ids", data.functional_role_ids.filter((r) => r !== id))
    } else {
      setData("functional_role_ids", [...data.functional_role_ids, id])
    }
  }

  return (
    <CoachLayout>
      <Head title="Nuevo Entrenamiento" />

      <div className="bg-white border-b border-gray-100 px-4 pb-4 pt-10">
        <div className="flex items-center gap-3">
          <Link href="/coach/trainings" className="text-gray-400 hover:text-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Nuevo Entrenamiento</h1>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); post("/coach/trainings") }} className="px-4 pt-5 pb-8 space-y-4">

        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5 space-y-4">

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Fecha *</label>
            <input type="date" value={data.date} onChange={(e) => setData("date", e.target.value)} required
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-bordo-400 focus:outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Inicio</label>
              <input type="time" value={data.start_time} onChange={(e) => setData("start_time", e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-bordo-400 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Fin</label>
              <input type="time" value={data.end_time} onChange={(e) => setData("end_time", e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-bordo-400 focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Tipo</label>
            <select value={data.training_type} onChange={(e) => setData("training_type", e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-bordo-400 focus:outline-none">
              {TRAINING_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Objetivo</label>
            <input type="text" value={data.objective} onChange={(e) => setData("objective", e.target.value)}
              placeholder="Ej: Trabajo de scrum y lineout"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-bordo-400 focus:outline-none" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Notas</label>
            <textarea value={data.notes} onChange={(e) => setData("notes", e.target.value)}
              rows={3} placeholder="Observaciones adicionales..."
              className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-bordo-400 focus:outline-none" />
          </div>
        </div>

        {/* PDF de planificacion */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5 space-y-3">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">PDF de planificación</label>
          <label className="flex items-center gap-3 cursor-pointer rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3 hover:border-bordo-400 hover:bg-bordo-50 transition-colors">
            <Upload className="h-4 w-4 text-gray-400 shrink-0" />
            <span className="text-sm text-gray-500 truncate">
              {data.pdf_file ? data.pdf_file.name : "Seleccionar PDF..."}
            </span>
            <input
              type="file"
              accept="application/pdf"
              className="sr-only"
              onChange={(e) => setData("pdf_file", e.target.files?.[0] ?? null)}
            />
          </label>
          {data.pdf_file && (
            <button
              type="button"
              onClick={() => setData("pdf_file", null)}
              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700"
            >
              <X className="h-3 w-3" /> Quitar archivo
            </button>
          )}
        </div>

        {/* Dirigido a */}
        {functional_roles.length > 0 && (
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Dirigido a</label>
              <span className="text-xs font-medium text-gray-400">{targetLabel}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {forwards.length > 0 && (
                <button type="button" onClick={() => toggleGroup(forwardIds, forwardsOn)}
                  className={`rounded-xl border py-3 text-sm font-bold transition-all ${
                    forwardsOn ? "border-bordo-600 bg-bordo-700 text-white" : "border-gray-200 bg-gray-50 text-gray-700"
                  }`}>
                  Forwards
                </button>
              )}
              {backs.length > 0 && (
                <button type="button" onClick={() => toggleGroup(backIds, backsOn)}
                  className={`rounded-xl border py-3 text-sm font-bold transition-all ${
                    backsOn ? "border-blue-600 bg-blue-600 text-white" : "border-gray-200 bg-gray-50 text-gray-700"
                  }`}>
                  Backs
                </button>
              )}
            </div>

            {(anyForward || anyBack) && (
              <div className="space-y-2 pt-1 border-t border-gray-100">
                {[
                  { label: "Forwards", roles: forwards, hasAny: anyForward },
                  { label: "Backs",    roles: backs,    hasAny: anyBack },
                ].map(({ label, roles, hasAny }) =>
                  hasAny ? (
                    <div key={label}>
                      <p className="text-xs text-gray-400 mb-1.5 pt-1">{label}</p>
                      <div className="flex flex-wrap gap-2">
                        {roles.map((fr) => {
                          const sel = data.functional_role_ids.includes(fr.id)
                          return (
                            <button key={fr.id} type="button" onClick={() => toggleRole(fr.id)}
                              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                                sel
                                  ? label === "Forwards"
                                    ? "border-bordo-600 bg-bordo-700 text-white"
                                    : "border-blue-600 bg-blue-600 text-white"
                                  : "border-gray-200 bg-gray-50 text-gray-500"
                              }`}>
                              {fr.name}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            )}

            <p className="text-xs text-gray-400">Sin seleccion = todo el plantel.</p>
          </div>
        )}

        <button type="submit" disabled={processing}
          className="w-full rounded-2xl bg-bordo-800 py-4 text-base font-bold text-white shadow-lg hover:bg-bordo-700 transition-colors disabled:opacity-50">
          {processing ? "Guardando..." : "Guardar Entrenamiento"}
        </button>
      </form>
    </CoachLayout>
  )
}
