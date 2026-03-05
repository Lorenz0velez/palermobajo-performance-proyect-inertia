import { useState } from "react"
import { Head, Link, useForm } from "@inertiajs/react"
import { ArrowLeft, Minus, TrendingDown, TrendingUp } from "lucide-react"

import NutriLayout from "@/layouts/nutricionista/nutri-layout"
import { cn } from "@/lib/utils"

interface HistoryEntry {
  id: number
  date: string
  date_raw: string
  weight_kg: number | null
  muscle_mass_kg: number | null
  fat_mass_kg: number | null
  height_cm: number | null
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
  player: {
    id: number
    full_name: string
    dni: string
    functional_role: string | null
    birth_date: string | null
  }
  history: HistoryEntry[]
  plans: NutritionPlan[]
  today: string
}

const DIRECTION_OPTIONS = [
  { value: "",         label: "Sin indicación" },
  { value: "subir",    label: "↑ Subir"        },
  { value: "mantener", label: "→ Mantener"     },
  { value: "bajar",    label: "↓ Bajar"        },
]

const DIRECTION_CFG: Record<string, { icon: React.ReactNode; cls: string }> = {
  subir:    { icon: <TrendingUp className="h-3.5 w-3.5" />,   cls: "text-green-700 bg-green-50 border-green-200" },
  mantener: { icon: <Minus className="h-3.5 w-3.5" />,        cls: "text-blue-700 bg-blue-50 border-blue-200"   },
  bajar:    { icon: <TrendingDown className="h-3.5 w-3.5" />, cls: "text-red-700 bg-red-50 border-red-200"      },
}

function DirectionTag({ dir, label }: { dir: string | null; label: string }) {
  if (!dir || !DIRECTION_CFG[dir]) return null
  const cfg = DIRECTION_CFG[dir]
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold", cfg.cls)}>
      {cfg.icon} {label}: {dir}
    </span>
  )
}

/* ─── Weigh Form ────────────────────────────────────────────────── */
function WeighForm({ playerId, today }: { playerId: number; today: string }) {
  const { data, setData, post, processing, reset } = useForm({
    date:             today,
    weight_kg:        "",
    muscle_mass_kg:   "",
    fat_mass_kg:      "",
    height_cm:        "",
    muscle_direction: "",
    fat_direction:    "",
    notes:            "",
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post(`/nutricionista/squad/${playerId}/weigh`, { onSuccess: () => reset() })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Row 1: Medidas */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Fecha</label>
          <input type="date" value={data.date} onChange={(e) => setData("date", e.target.value)} required
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-bordo-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Peso (kg) *</label>
          <input type="number" step="0.1" min="0" value={data.weight_kg} onChange={(e) => setData("weight_kg", e.target.value)} required
            placeholder="85.5"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-bordo-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">M. Muscular (kg)</label>
          <input type="number" step="0.1" min="0" value={data.muscle_mass_kg} onChange={(e) => setData("muscle_mass_kg", e.target.value)}
            placeholder="42.0"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-bordo-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Grasa (kg)</label>
          <input type="number" step="0.1" min="0" value={data.fat_mass_kg} onChange={(e) => setData("fat_mass_kg", e.target.value)}
            placeholder="12.0"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-bordo-500 focus:outline-none" />
        </div>
      </div>

      {/* Row 2: Height + directions */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Altura (cm)</label>
          <input type="number" step="0.1" min="0" value={data.height_cm} onChange={(e) => setData("height_cm", e.target.value)}
            placeholder="180"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-bordo-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">Objetivo Músculo</label>
          <select value={data.muscle_direction} onChange={(e) => setData("muscle_direction", e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-green-400 focus:outline-none">
            {DIRECTION_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1">Objetivo Grasa</label>
          <select value={data.fat_direction} onChange={(e) => setData("fat_direction", e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none">
            {DIRECTION_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Notas</label>
          <input type="text" value={data.notes} onChange={(e) => setData("notes", e.target.value)}
            placeholder="Observaciones..."
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-bordo-500 focus:outline-none" />
        </div>
      </div>

      <button type="submit" disabled={processing}
        className="rounded-lg bg-bordo-700 px-5 py-2 text-sm font-semibold text-white hover:bg-bordo-600 transition-colors disabled:opacity-60">
        {processing ? "Guardando..." : "Guardar Pesaje"}
      </button>
    </form>
  )
}

/* ─── Plan Form ─────────────────────────────────────────────────── */
function PlanForm({ playerId, today }: { playerId: number; today: string }) {
  const { data, setData, post, processing, reset } = useForm({
    date:            today,
    recommendations: "",
    breakfast:       "",
    lunch:           "",
    dinner:          "",
    snacks:          "",
    extra_notes:     "",
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post(`/nutricionista/squad/${playerId}/plan`, { onSuccess: () => reset() })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Fecha del plan *</label>
          <input type="date" value={data.date} onChange={(e) => setData("date", e.target.value)} required
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-bordo-500 focus:outline-none" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Recomendaciones generales</label>
        <textarea rows={3} value={data.recommendations} onChange={(e) => setData("recommendations", e.target.value)}
          placeholder="Indicaciones generales para el jugador..."
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-bordo-500 focus:outline-none resize-none" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Desayuno</label>
          <textarea rows={2} value={data.breakfast} onChange={(e) => setData("breakfast", e.target.value)}
            placeholder="Ej. Avena con leche, 2 tostadas..."
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-bordo-500 focus:outline-none resize-none" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Almuerzo</label>
          <textarea rows={2} value={data.lunch} onChange={(e) => setData("lunch", e.target.value)}
            placeholder="Ej. Arroz con pollo, ensalada..."
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-bordo-500 focus:outline-none resize-none" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Cena</label>
          <textarea rows={2} value={data.dinner} onChange={(e) => setData("dinner", e.target.value)}
            placeholder="Ej. Pasta, proteína..."
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-bordo-500 focus:outline-none resize-none" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Colaciones</label>
          <textarea rows={2} value={data.snacks} onChange={(e) => setData("snacks", e.target.value)}
            placeholder="Ej. Fruta, yogur, barrita..."
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-bordo-500 focus:outline-none resize-none" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Notas extra</label>
        <textarea rows={2} value={data.extra_notes} onChange={(e) => setData("extra_notes", e.target.value)}
          placeholder="Suplementación, hidratación, advertencias..."
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-bordo-500 focus:outline-none resize-none" />
      </div>

      <button type="submit" disabled={processing}
        className="rounded-lg bg-emerald-700 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-600 transition-colors disabled:opacity-60">
        {processing ? "Guardando..." : "Guardar Plan Nutricional"}
      </button>
    </form>
  )
}

/* ─── Plan card ────────────────────────────────────────────────── */
function PlanCard({ plan }: { plan: NutritionPlan }) {
  const [expanded, setExpanded] = useState(false)
  const hasMeals = !!(plan.breakfast ?? plan.lunch ?? plan.dinner ?? plan.snacks)

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-gray-800 text-sm">Plan: {plan.date}</p>
        {(hasMeals || !!plan.extra_notes) && (
          <button onClick={() => setExpanded(!expanded)} className="text-xs text-bordo-600 font-medium hover:underline">
            {expanded ? "Ocultar" : "Ver detalle"}
          </button>
        )}
      </div>
      {plan.recommendations && <p className="text-sm text-gray-600 mt-1">{plan.recommendations}</p>}
      {expanded && (
        <div className="mt-3 space-y-2 border-t border-gray-100 pt-3 text-sm text-gray-700">
          {plan.breakfast  && <p><span className="font-semibold">Desayuno:</span> {plan.breakfast}</p>}
          {plan.lunch      && <p><span className="font-semibold">Almuerzo:</span> {plan.lunch}</p>}
          {plan.dinner     && <p><span className="font-semibold">Cena:</span> {plan.dinner}</p>}
          {plan.snacks     && <p><span className="font-semibold">Colaciones:</span> {plan.snacks}</p>}
          {plan.extra_notes && <p><span className="font-semibold">Notas:</span> {plan.extra_notes}</p>}
        </div>
      )}
    </div>
  )
}

/* ─── Main ──────────────────────────────────────────────────────── */
export default function NutriSquadShow({ player, history, plans, today }: Props) {
  const latest = history[0]

  return (
    <NutriLayout>
      <Head title={`Nutrición — ${player.full_name}`} />

      <div className="space-y-6">
        {/* Back + header */}
        <div className="flex items-center gap-4">
          <Link href="/nutricionista/squad" className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 shadow-sm">
            <ArrowLeft className="h-4 w-4 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{player.full_name}</h1>
            <p className="text-sm text-gray-500">
              {player.functional_role ?? "Sin rol"} · DNI {player.dni}
              {player.birth_date && ` · Nacido ${player.birth_date}`}
            </p>
          </div>
        </div>

        {/* Latest stats */}
        {latest && (
          <div>
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5 text-center">
                <p className="text-3xl font-bold text-bordo-700">{latest.weight_kg ?? "—"}</p>
                <p className="text-xs text-gray-500 mt-1">Peso (kg)</p>
                <p className="text-xs text-gray-400">{latest.date}</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5 text-center">
                <p className="text-3xl font-bold text-blue-600">{latest.muscle_mass_kg ?? "—"}</p>
                <p className="text-xs text-gray-500 mt-1">M. Muscular (kg)</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5 text-center">
                <p className="text-3xl font-bold text-amber-500">{latest.fat_mass_kg ?? "—"}</p>
                <p className="text-xs text-gray-500 mt-1">Grasa (kg)</p>
              </div>
            </div>
            {(latest.muscle_direction ?? latest.fat_direction) && (
              <div className="mt-2 flex flex-wrap gap-2">
                <DirectionTag dir={latest.muscle_direction} label="Músculo" />
                <DirectionTag dir={latest.fat_direction}    label="Grasa"   />
              </div>
            )}
          </div>
        )}

        {/* Weigh form */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Nuevo Pesaje</h2>
          <WeighForm playerId={player.id} today={today} />
        </div>

        {/* Plan form */}
        <div className="rounded-xl border border-emerald-200 bg-white shadow-sm p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Plan Nutricional</h2>
          <PlanForm playerId={player.id} today={today} />
        </div>

        {/* Existing plans */}
        {plans.length > 0 && (
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Planes registrados</h2>
            </div>
            <div className="p-4 space-y-3">
              {plans.map((p) => <PlanCard key={p.id} plan={p} />)}
            </div>
          </div>
        )}

        {/* History table */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Historial de Pesajes</h2>
          </div>
          {history.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-gray-400">Sin historial de pesajes.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {["Fecha","Peso (kg)","M. Muscular (kg)","Grasa (kg)","Altura (cm)","Objetivos"].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {history.map((h) => (
                    <tr key={h.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 font-medium text-gray-700">{h.date}</td>
                      <td className="px-6 py-3 text-center font-semibold text-gray-800">{h.weight_kg ?? "—"}</td>
                      <td className="px-6 py-3 text-center text-gray-600">{h.muscle_mass_kg ?? "—"}</td>
                      <td className="px-6 py-3 text-center text-gray-600">{h.fat_mass_kg ?? "—"}</td>
                      <td className="px-6 py-3 text-center text-gray-500">{h.height_cm ?? "—"}</td>
                      <td className="px-6 py-3">
                        <div className="flex flex-wrap gap-1">
                          <DirectionTag dir={h.muscle_direction} label="Músc." />
                          <DirectionTag dir={h.fat_direction}    label="Grasa" />
                        </div>
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
