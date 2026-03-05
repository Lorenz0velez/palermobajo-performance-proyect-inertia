import { Link } from "@inertiajs/react"
import { FileText, Upload, X } from "lucide-react"

export interface FunctionalRole {
  id: number
  name: string
  group: "forward" | "back" | null
}

export interface TrainingFormData {
  date: string
  start_time: string
  end_time: string
  duration_min: string
  training_type: string
  objective: string
  notes: string
  functional_role_ids: number[]
  pdf_file: File | null
}

interface Props {
  data: TrainingFormData
  setField: (key: Exclude<keyof TrainingFormData, "functional_role_ids" | "pdf_file">, value: string) => void
  setRoleIds: (ids: number[]) => void
  setPdfFile: (file: File | null) => void
  existing_pdf_url?: string | null
  onSubmit: (e: React.FormEvent) => void
  processing: boolean
  functional_roles: FunctionalRole[]
  submitLabel: string
  cancelHref: string
}

const TRAINING_TYPES = ["fisico", "tecnico", "tactico", "mixto", "regenerativo"]

export default function TrainingForm({
  data,
  setField,
  setRoleIds,
  setPdfFile,
  existing_pdf_url,
  onSubmit,
  processing,
  functional_roles,
  submitLabel,
  cancelHref,
}: Props) {
  const forwards   = functional_roles.filter((fr) => fr.group === "forward")
  const backs      = functional_roles.filter((fr) => fr.group === "back")
  const forwardIds = forwards.map((fr) => fr.id)
  const backIds    = backs.map((fr) => fr.id)

  const forwardsOn = forwardIds.length > 0 && forwardIds.every((id) => data.functional_role_ids.includes(id))
  const backsOn    = backIds.length > 0 && backIds.every((id) => data.functional_role_ids.includes(id))
  const anyForward = forwards.some((fr) => data.functional_role_ids.includes(fr.id))
  const anyBack    = backs.some((fr) => data.functional_role_ids.includes(fr.id))

  function toggleGroup(groupIds: number[], isOn: boolean) {
    if (isOn) {
      setRoleIds(data.functional_role_ids.filter((id) => !groupIds.includes(id)))
    } else {
      setRoleIds([...new Set([...data.functional_role_ids, ...groupIds])])
    }
  }

  function toggleRole(id: number) {
    if (data.functional_role_ids.includes(id)) {
      setRoleIds(data.functional_role_ids.filter((r) => r !== id))
    } else {
      setRoleIds([...data.functional_role_ids, id])
    }
  }

  const total = data.functional_role_ids.length
  const targetLabel =
    total === 0
      ? "Todo el plantel"
      : forwardsOn && backsOn
        ? "Forwards + Backs"
        : forwardsOn
          ? "Forwards"
          : backsOn
            ? "Backs"
            : `${total} rol${total !== 1 ? "es" : ""}`

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Date + Type */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Fecha *</label>
          <input
            type="date"
            value={data.date}
            onChange={(e) => setField("date", e.target.value)}
            required
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-bordo-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Tipo</label>
          <select
            value={data.training_type}
            onChange={(e) => setField("training_type", e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-bordo-500 focus:outline-none"
          >
            {TRAINING_TYPES.map((t) => (
              <option key={t} value={t} className="capitalize">{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Times + Duration */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Inicio</label>
          <input
            type="time"
            value={data.start_time}
            onChange={(e) => setField("start_time", e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-bordo-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Fin</label>
          <input
            type="time"
            value={data.end_time}
            onChange={(e) => setField("end_time", e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-bordo-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Min</label>
          <input
            type="number"
            min="0"
            value={data.duration_min}
            onChange={(e) => setField("duration_min", e.target.value)}
            placeholder="90"
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-bordo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Objective */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Objetivo</label>
        <input
          type="text"
          value={data.objective}
          onChange={(e) => setField("objective", e.target.value)}
          placeholder="Ej. Potencia de tren inferior"
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-bordo-500 focus:outline-none"
        />
      </div>

      {/* Target audience */}
      {functional_roles.length > 0 && (
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Dirigido a</label>
            <span className="text-xs font-medium text-gray-500">{targetLabel}</span>
          </div>

          {/* Group toggles */}
          <div className="grid grid-cols-2 gap-2">
            {forwards.length > 0 && (
              <button
                type="button"
                onClick={() => toggleGroup(forwardIds, forwardsOn)}
                className={`rounded-lg border py-2.5 text-sm font-semibold transition-all ${
                  forwardsOn
                    ? "border-bordo-600 bg-bordo-700 text-white shadow-sm"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
              >
                Forwards
              </button>
            )}
            {backs.length > 0 && (
              <button
                type="button"
                onClick={() => toggleGroup(backIds, backsOn)}
                className={`rounded-lg border py-2.5 text-sm font-semibold transition-all ${
                  backsOn
                    ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
              >
                Backs
              </button>
            )}
          </div>

          {/* Individual role breakdown */}
          {(anyForward || anyBack) && (
            <div className="space-y-2 pt-1 border-t border-gray-200">
              {[
                { label: "Forwards", roles: forwards, hasAny: anyForward, isOn: forwardsOn },
                { label: "Backs",    roles: backs,    hasAny: anyBack,    isOn: backsOn    },
              ].map(({ label, roles, hasAny }) =>
                hasAny ? (
                  <div key={label}>
                    <p className="text-xs text-gray-400 mb-1.5 pt-1">{label}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {roles.map((fr) => {
                        const sel = data.functional_role_ids.includes(fr.id)
                        return (
                          <button
                            key={fr.id}
                            type="button"
                            onClick={() => toggleRole(fr.id)}
                            className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-all ${
                              sel
                                ? label === "Forwards"
                                  ? "border-bordo-600 bg-bordo-700 text-white"
                                  : "border-blue-600 bg-blue-600 text-white"
                                : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                            }`}
                          >
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

      {/* Notes */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Notas</label>
        <textarea
          value={data.notes}
          onChange={(e) => setField("notes", e.target.value)}
          rows={3}
          placeholder="Observaciones adicionales..."
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-bordo-500 focus:outline-none resize-none"
        />
      </div>
      {/* PDF de planificacion */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">PDF de planificación</label>
        <label className="flex items-center gap-3 cursor-pointer rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-3 hover:border-bordo-400 hover:bg-bordo-50 transition-colors">
          <Upload className="h-4 w-4 text-gray-400 shrink-0" />
          <span className="text-sm text-gray-500 truncate">
            {data.pdf_file ? data.pdf_file.name : "Seleccionar PDF..."}
          </span>
          <input
            type="file"
            accept="application/pdf"
            className="sr-only"
            onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
          />
        </label>
        {data.pdf_file && (
          <button
            type="button"
            onClick={() => setPdfFile(null)}
            className="mt-1.5 flex items-center gap-1 text-xs text-red-500 hover:text-red-700"
          >
            <X className="h-3 w-3" /> Quitar archivo
          </button>
        )}
        {!data.pdf_file && existing_pdf_url && (
          <a
            href={existing_pdf_url}
            target="_blank"
            rel="noreferrer"
            className="mt-1.5 flex items-center gap-1.5 text-xs text-bordo-600 hover:text-bordo-800"
          >
            <FileText className="h-3.5 w-3.5" /> Ver PDF actual
          </a>
        )}
      </div>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center pt-2">
        <Link href={cancelHref} className="text-center text-sm text-gray-500 hover:text-gray-700 py-2">
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={processing}
          className="flex-1 rounded-lg bg-bordo-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-bordo-600 transition-colors disabled:opacity-60 sm:flex-none"
        >
          {processing ? "Guardando..." : submitLabel}
        </button>
      </div>
    </form>
  )
}
