import { Head } from "@inertiajs/react"
import { ChevronDown, ChevronUp, Minus, TrendingDown, TrendingUp } from "lucide-react"
import { useState } from "react"

import PlayerLayout from "@/layouts/player/player-layout"
import { cn } from "@/lib/utils"

interface HistoryEntry {
  date: string
  value: number
}

interface Evaluation {
  test_id: number
  test_name: string
  test_unit: string | null
  latest_value: number | null
  latest_date: string | null
  green_threshold: number | null
  yellow_threshold: number | null
  threshold_type: string
  status: "green" | "yellow" | "red" | null
  history: HistoryEntry[]
}

interface Props {
  evaluations: Evaluation[]
  category_name: string | null
  functional_role: string | null
}

const STATUS_CONFIG = {
  green:  { bg: "bg-green-100",  text: "text-green-800",  label: "Óptimo",    dot: "bg-green-500"  },
  yellow: { bg: "bg-amber-100",  text: "text-amber-800",  label: "Aceptable", dot: "bg-amber-400"  },
  red:    { bg: "bg-red-100",    text: "text-red-800",    label: "A mejorar", dot: "bg-red-500"    },
}

function StatusBadge({ status }: { status: "green" | "yellow" | "red" | null }) {
  if (!status) return <span className="text-xs text-gray-400">Sin objetivo</span>
  const cfg = STATUS_CONFIG[status]
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", cfg.bg, cfg.text)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
      {cfg.label}
    </span>
  )
}

function TrendIcon({ history }: { history: HistoryEntry[] }) {
  if (history.length < 2) return <Minus className="h-4 w-4 text-gray-400" />
  const last = history[0].value
  const prev = history[1].value
  if (last > prev) return <TrendingUp className="h-4 w-4 text-green-500" />
  if (last < prev) return <TrendingDown className="h-4 w-4 text-red-500" />
  return <Minus className="h-4 w-4 text-gray-400" />
}

function EvalCard({ ev }: { ev: Evaluation }) {
  const [expanded, setExpanded] = useState(false)

  const showThresholds = ev.green_threshold !== null

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      {/* Top color bar */}
      {ev.status && (
        <div className={cn(
          "h-1",
          ev.status === "green" ? "bg-green-400" : ev.status === "yellow" ? "bg-amber-400" : "bg-red-400"
        )} />
      )}

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-gray-900 text-sm">{ev.test_name}</p>
            {ev.test_unit && <p className="text-xs text-gray-400">{ev.test_unit}</p>}
          </div>
          <StatusBadge status={ev.status} />
        </div>

        {/* Value */}
        <div className="mt-3 flex items-end gap-3">
          {ev.latest_value !== null ? (
            <>
              <span className="text-3xl font-bold text-gray-900">
                {Number(ev.latest_value).toFixed(1)}
              </span>
              {ev.test_unit && <span className="text-sm text-gray-500 mb-1">{ev.test_unit}</span>}
              <TrendIcon history={ev.history} />
            </>
          ) : (
            <span className="text-sm text-gray-400 italic">Sin evaluación</span>
          )}
        </div>

        {ev.latest_date && (
          <p className="text-xs text-gray-400 mt-1">
            Última eval: {new Date(ev.latest_date).toLocaleDateString("es-AR")}
          </p>
        )}

        {/* Thresholds */}
        {showThresholds && (
          <div className="mt-3 flex gap-3 text-xs">
            {ev.green_threshold !== null && (
              <span className="flex items-center gap-1 text-green-700">
                <span className="h-2 w-2 rounded-full bg-green-400" />
                Óptimo: {ev.threshold_type === "min" ? "≥" : "≤"} {ev.green_threshold}
              </span>
            )}
            {ev.yellow_threshold !== null && (
              <span className="flex items-center gap-1 text-amber-700">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                Aceptable: {ev.threshold_type === "min" ? "≥" : "≤"} {ev.yellow_threshold}
              </span>
            )}
          </div>
        )}

        {/* History toggle */}
        {ev.history.length > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 flex w-full items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-xs font-medium text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <span>Historial ({ev.history.length} registros)</span>
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        )}

        {expanded && (
          <div className="mt-2 space-y-1">
            {ev.history.map((h, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-gray-50 text-xs">
                <span className="text-gray-500">{new Date(h.date).toLocaleDateString("es-AR")}</span>
                <span className="font-semibold text-gray-800">{Number(h.value).toFixed(1)} {ev.test_unit ?? ""}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function PlayerEvaluaciones({ evaluations, category_name, functional_role }: Props) {
  const withEvals = evaluations.filter((e) => e.latest_value !== null)
  const withoutEvals = evaluations.filter((e) => e.latest_value === null)

  return (
    <PlayerLayout>
      <Head title="Mis Evaluaciones" />

      {/* Header */}
      <div className="bg-bordo-900 px-5 pt-10 pb-6">
        <h1 className="text-xl font-bold text-white">Mis Evaluaciones</h1>
        {(category_name ?? functional_role) && (
          <p className="text-bordo-300 text-sm mt-1">
            {[category_name, functional_role].filter(Boolean).join(" · ")}
          </p>
        )}
      </div>

      <div className="px-5 py-5 space-y-4">
        {evaluations.length === 0 && (
          <div className="rounded-xl border border-gray-100 bg-white p-8 text-center">
            <p className="text-gray-400 text-sm">No hay evaluaciones ni objetivos configurados para tu categoría y rol.</p>
          </div>
        )}

        {withEvals.length > 0 && (
          <div className="space-y-3">
            {withEvals.map((ev) => <EvalCard key={ev.test_id} ev={ev} />)}
          </div>
        )}

        {withoutEvals.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Pendientes de evaluación</p>
            <div className="space-y-3">
              {withoutEvals.map((ev) => <EvalCard key={ev.test_id} ev={ev} />)}
            </div>
          </div>
        )}
      </div>
    </PlayerLayout>
  )
}
