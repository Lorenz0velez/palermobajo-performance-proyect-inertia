import { Head } from "@inertiajs/react"
import { ChevronDown, ChevronUp, Minus, Scale, TrendingDown, TrendingUp, Utensils } from "lucide-react"
import { useState } from "react"

import PlayerLayout from "@/layouts/player/player-layout"
import { cn } from "@/lib/utils"

interface HistoryEntry {
  id: number
  date: string
  weight: number | null
  muscle_mass: number | null
  fat_percentage: number | null
  muscle_direction: string | null
  fat_direction: string | null
  notes: string | null
}

interface NutritionPlan {
  id: number
  date: string
  recommendations: string | null
  breakfast: string | null
  lunch: string | null
  dinner: string | null
  snacks: string | null
  extra_notes: string | null
}

interface Props {
  history: HistoryEntry[]
  latest: HistoryEntry | null
  plans: NutritionPlan[]
  latest_plan: NutritionPlan | null
}

const DIRECTION_CONFIG: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  subir:    { icon: <TrendingUp className="h-4 w-4"  />, label: "Subir",    color: "text-green-600 bg-green-50" },
  mantener: { icon: <Minus       className="h-4 w-4"  />, label: "Mantener", color: "text-blue-600 bg-blue-50"   },
  bajar:    { icon: <TrendingDown className="h-4 w-4" />, label: "Bajar",    color: "text-red-600 bg-red-50"     },
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("es-AR", {
    day: "numeric", month: "short", year: "numeric"
  })
}

function DirectionPill({ direction, label }: { direction: string | null; label: string }) {
  if (!direction) return null
  const cfg = DIRECTION_CONFIG[direction]
  if (!cfg) return null
  return (
    <div className={cn("flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold", cfg.color)}>
      {cfg.icon}
      <span className="text-gray-500 font-normal">{label}:</span>
      <span>{cfg.label}</span>
    </div>
  )
}

function Stat({ label, value, unit }: { label: string; value: number | null; unit: string }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold text-gray-900">
        {value !== null ? Number(value).toFixed(1) : "—"}
      </p>
      <p className="text-xs text-gray-400 mt-0.5">{unit}</p>
      <p className="text-xs text-gray-500 font-medium mt-0.5">{label}</p>
    </div>
  )
}

function MealSection({ label, content }: { label: string; content: string | null }) {
  if (!content) return null
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">{label}</p>
      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{content}</p>
    </div>
  )
}

function PlanCard({ plan }: { plan: NutritionPlan }) {
  const [expanded, setExpanded] = useState(false)
  const hasMeals = !!(plan.breakfast ?? plan.lunch ?? plan.dinner ?? plan.snacks)

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-900">
            Plan: {formatDate(plan.date)}
          </p>
          {(hasMeals || plan.extra_notes) && (
            <button onClick={() => setExpanded(!expanded)}
              className="text-gray-400 hover:text-gray-600">
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          )}
        </div>

        {plan.recommendations && (
          <p className="text-sm text-gray-700 mt-2 leading-relaxed">{plan.recommendations}</p>
        )}

        {expanded && (
          <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
            <MealSection label="Desayuno" content={plan.breakfast} />
            <MealSection label="Almuerzo" content={plan.lunch} />
            <MealSection label="Cena" content={plan.dinner} />
            <MealSection label="Colaciones" content={plan.snacks} />
            <MealSection label="Notas extra" content={plan.extra_notes} />
          </div>
        )}
      </div>
    </div>
  )
}

export default function PlayerNutricion({ history, latest, plans, latest_plan }: Props) {
  const [showAllHistory, setShowAllHistory] = useState(false)
  const displayedHistory = showAllHistory ? history : history.slice(0, 3)

  return (
    <PlayerLayout>
      <Head title="Mi Nutrición" />

      {/* Header */}
      <div className="bg-bordo-900 px-5 pt-10 pb-6">
        <h1 className="text-xl font-bold text-white">Mi Nutrición</h1>
        <p className="text-bordo-300 text-sm mt-1">Mediciones y plan nutricional</p>
      </div>

      <div className="px-5 py-5 space-y-5">

        {/* Latest measurements */}
        {latest ? (
          <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-bordo-700" />
                <span className="text-sm font-semibold text-gray-900">Última medición</span>
              </div>
              <span className="text-xs text-gray-400">
                {formatDate(latest.date)}
              </span>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-2 divide-x divide-gray-100">
              <Stat label="Peso" value={latest.weight}          unit="kg"  />
              <Stat label="Músculo" value={latest.muscle_mass}  unit="kg"  />
              <Stat label="Grasa" value={latest.fat_percentage} unit="%"   />
            </div>

            {/* Directions */}
            {(latest.muscle_direction ?? latest.fat_direction) && (
              <div className="mt-3 flex flex-wrap gap-2 border-t border-gray-50 pt-3">
                <DirectionPill direction={latest.muscle_direction} label="Músculo" />
                <DirectionPill direction={latest.fat_direction}    label="Grasa"   />
              </div>
            )}

            {latest.notes && (
              <p className="mt-3 text-xs text-gray-500 border-t border-gray-50 pt-3">{latest.notes}</p>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-6 text-center">
            <Scale className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No hay mediciones registradas</p>
          </div>
        )}

        {/* Latest plan */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Utensils className="h-4 w-4 text-bordo-700" />
            <h2 className="text-sm font-semibold text-gray-900">Plan nutricional</h2>
          </div>

          {latest_plan ? (
            <PlanCard plan={latest_plan} />
          ) : (
            <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-6 text-center">
              <p className="text-sm text-gray-400">No hay un plan nutricional cargado todavía</p>
            </div>
          )}
        </div>

        {/* History */}
        {history.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Historial de mediciones</p>
            <div className="space-y-2">
              {displayedHistory.map((h) => (
                <div key={h.id} className="rounded-xl border border-gray-100 bg-white shadow-sm px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">
                      {formatDate(h.date)}
                    </span>
                    <div className="flex items-center gap-3 text-xs text-gray-700">
                      {h.weight !== null && <span><b>{Number(h.weight).toFixed(1)}</b> kg</span>}
                      {h.muscle_mass !== null && <span><b>{Number(h.muscle_mass).toFixed(1)}</b> kg músc.</span>}
                      {h.fat_percentage !== null && <span><b>{Number(h.fat_percentage).toFixed(1)}</b>% grasa</span>}
                    </div>
                  </div>
                  {(h.muscle_direction ?? h.fat_direction) && (
                    <div className="mt-1.5 flex gap-2">
                      <DirectionPill direction={h.muscle_direction} label="Músculo" />
                      <DirectionPill direction={h.fat_direction}    label="Grasa"   />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {history.length > 3 && (
              <button
                onClick={() => setShowAllHistory(!showAllHistory)}
                className="mt-2 w-full rounded-lg bg-gray-50 py-2 text-xs font-medium text-gray-500 hover:bg-gray-100 transition-colors"
              >
                {showAllHistory ? "Mostrar menos" : `Ver todo el historial (${history.length})`}
              </button>
            )}
          </div>
        )}

        {/* Older plans */}
        {plans.length > 1 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Planes anteriores</p>
            <div className="space-y-3">
              {plans.slice(1).map((p) => <PlanCard key={p.id} plan={p} />)}
            </div>
          </div>
        )}
      </div>
    </PlayerLayout>
  )
}
