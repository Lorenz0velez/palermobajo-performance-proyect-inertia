import { Head, Link, useForm } from "@inertiajs/react"
import { ArrowLeft, TrendingDown, TrendingUp, Minus } from "lucide-react"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, ReferenceArea,
} from "recharts"

import PfLayout from "@/layouts/pf/pf-layout"

interface TestType {
  id: number
  name: string
  unit: string | null
}

interface EvalEntry {
  date: string
  value: number
}

interface Objective {
  red:            number | null
  yellow:         number | null
  green:          number | null
  threshold_type: "min" | "max"
  formula:        string
}

interface Props {
  player: {
    id: number
    full_name: string
    dni: string
    functional_role: string | null
    birth_date: string | null
    weight_kg: number | null
  }
  test_types:         TestType[]
  history_by_test:    Record<string, EvalEntry[]>
  objectives_by_test: Record<string, Objective>
  today: string
}

function EvalForm({ playerId, testTypes, today }: { playerId: number; testTypes: TestType[]; today: string }) {
  const { data, setData, post, processing, reset } = useForm({
    physical_test_id: "",
    date: today,
    value: "",
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post(`/pf/squad/${playerId}/evaluate`, {
      onSuccess: () => reset(),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Tipo de Evaluación</label>
          <select
            value={data.physical_test_id}
            onChange={(e) => setData("physical_test_id", e.target.value)}
            required
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:border-bordo-500 focus:outline-none"
          >
            <option value="">Seleccionar...</option>
            {testTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}{t.unit ? ` (${t.unit})` : ""}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Fecha</label>
          <input
            type="date"
            value={data.date}
            onChange={(e) => setData("date", e.target.value)}
            required
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:border-bordo-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Valor</label>
          <input
            type="number"
            step="0.01"
            value={data.value}
            onChange={(e) => setData("value", e.target.value)}
            required
            placeholder="0.00"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:border-bordo-500 focus:outline-none"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={processing}
        className="rounded-lg bg-bordo-700 px-5 py-2 text-sm font-semibold text-white hover:bg-bordo-600 transition-colors disabled:opacity-60"
      >
        {processing ? "Guardando..." : "Guardar Evaluación"}
      </button>
    </form>
  )
}

/** Returns green | yellow | red status for a value given an objective */
function evalStatus(value: number, obj: Objective): "green" | "yellow" | "red" {
  const { red: _red, yellow, green, threshold_type: type } = obj
  if (type === "max") {
    // lower = better
    if (green != null && value <= green) return "green"
    if (yellow != null && value <= yellow) return "yellow"
    return "red"
  }
  // higher = better
  if (green != null && value >= green) return "green"
  if (yellow != null && value >= yellow) return "yellow"
  return "red"
}

const STATUS_COLORS = {
  green:  "text-green-600",
  yellow: "text-amber-500",
  red:    "text-red-500",
} as const

export default function PfSquadShow({ player, test_types, history_by_test, objectives_by_test, today }: Props) {
  return (
    <PfLayout>
      <Head title={`PF — ${player.full_name}`} />

      <div className="space-y-6">
        {/* Back + header */}
        <div className="flex items-center gap-4">
          <Link href="/pf/squad" className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors shadow-sm">
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

        {/* Cargar evaluación */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Nueva Evaluación</h2>
          {test_types.length === 0 ? (
            <p className="text-sm text-gray-400">
              No hay tipos de evaluación.{" "}
              <Link href="/pf/eval_types/new" className="text-bordo-700 hover:underline">Crear uno →</Link>
            </p>
          ) : (
            <EvalForm playerId={player.id} testTypes={test_types} today={today} />
          )}
        </div>

        {/* History by test */}
        {test_types.map((t) => {
          const entries = history_by_test[String(t.id)] || []
          // entries come desc from controller → reverse for chart (oldest → newest)
          const chronological = [...entries].reverse()
          const chartData = chronological.map((e) => ({
            label: e.date.slice(0, 5), // "dd/mm"
            value: Number(e.value),
          }))

          // Objectives for this test
          const obj = objectives_by_test[String(t.id)] as Objective | undefined
          const isMax = obj?.threshold_type === "max" // lower = better

          // Y domain: include all data values + all threshold values
          const threshVals = obj
            ? [obj.red, obj.yellow, obj.green].filter((v): v is number => v != null)
            : []
          const allForDomain = [...chartData.map((d) => d.value), ...threshVals]
          const yMin = allForDomain.length ? Math.floor(Math.min(...allForDomain) * 0.92) : 0
          const yMax = allForDomain.length ? Math.ceil(Math.max(...allForDomain)  * 1.08) : 100

          // Trend: compare last vs first
          const first = chartData[0]?.value
          const last  = chartData[chartData.length - 1]?.value
          const diff  = chartData.length >= 2 ? last - first : null
          const pct   = diff !== null && first !== 0 ? ((diff / Math.abs(first)) * 100).toFixed(1) : null

          const TrendIcon =
            diff === null ? null
            : diff > 0 ? TrendingUp
            : diff < 0 ? TrendingDown
            : Minus

          const trendColor =
            diff === null ? ""
            : diff > 0 ? "text-green-600"
            : diff < 0 ? "text-red-500"
            : "text-gray-400"

          const trendBg =
            diff === null ? ""
            : diff > 0 ? "bg-green-50 border-green-100"
            : diff < 0 ? "bg-red-50 border-red-100"
            : "bg-gray-50 border-gray-100"

          return (
            <div key={t.id} className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="font-semibold text-gray-800">{t.name}</h2>
                  {t.unit && (
                    <span className="text-xs text-gray-400 bg-gray-100 rounded-md px-2 py-0.5">{t.unit}</span>
                  )}
                </div>
                {TrendIcon && diff !== null && (
                  <div className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${trendBg} ${trendColor}`}>
                    <TrendIcon className="h-3.5 w-3.5" />
                    {diff > 0 ? "+" : ""}{diff.toFixed(1)}{t.unit ? ` ${t.unit}` : ""}
                    {pct && ` (${diff > 0 ? "+" : ""}${pct}%)`}
                  </div>
                )}
              </div>

              {entries.length === 0 ? (
                <p className="px-6 py-6 text-center text-sm text-gray-400">Sin registros</p>
              ) : (
                <>
                  {/* Objetivo legend */}
                  {obj && (
                    <div className="px-6 pt-4 pb-1 flex items-center gap-3 flex-wrap">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Objetivos:</span>
                      {obj.red    != null && <span className="text-xs font-medium text-red-500">Mín {obj.red}{t.unit ? ` ${t.unit}` : ""}</span>}
                      {obj.yellow != null && <span className="text-xs font-medium text-amber-500">● {isMax ? "↓" : "↑"}{obj.yellow}{t.unit ? ` ${t.unit}` : ""}</span>}
                      {obj.green  != null && <span className="text-xs font-medium text-green-600">● {isMax ? "↓" : "↑"}{obj.green}{t.unit ? ` ${t.unit}` : ""}</span>}
                    </div>
                  )}

                  {/* Chart — only if 2+ points */}
                  {chartData.length >= 2 && (
                    <div className="px-4 pt-3 pb-2">
                      <ResponsiveContainer width="100%" height={180}>
                        <LineChart data={chartData} margin={{ top: 4, right: 32, left: -10, bottom: 0 }}>
                          {/* Zone shading — render before Line so it stays behind */}
                          {obj && !isMax && (
                            <>
                              {/* red zone: below yellow threshold */}
                              {obj.yellow != null && <ReferenceArea y1={yMin}       y2={obj.yellow} fill="rgba(239,68,68,0.07)"  ifOverflow="hidden" />}
                              {/* yellow zone: between yellow and green thresholds */}
                              {obj.yellow != null && obj.green != null && <ReferenceArea y1={obj.yellow} y2={obj.green}  fill="rgba(234,179,8,0.10)" ifOverflow="hidden" />}
                              {/* green zone: above green threshold */}
                              {obj.green  != null && <ReferenceArea y1={obj.green}  y2={yMax}       fill="rgba(34,197,94,0.09)" ifOverflow="hidden" />}
                            </>
                          )}
                          {obj && isMax && (
                            <>
                              {/* green zone: below green threshold */}
                              {obj.green  != null && <ReferenceArea y1={yMin}       y2={obj.green}  fill="rgba(34,197,94,0.09)" ifOverflow="hidden" />}
                              {/* yellow zone: between green and yellow thresholds */}
                              {obj.green  != null && obj.yellow != null && <ReferenceArea y1={obj.green} y2={obj.yellow}  fill="rgba(234,179,8,0.10)" ifOverflow="hidden" />}
                              {/* red zone: above yellow threshold */}
                              {obj.yellow != null && <ReferenceArea y1={obj.yellow} y2={yMax}       fill="rgba(239,68,68,0.07)" ifOverflow="hidden" />}
                            </>
                          )}

                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis
                            dataKey="label"
                            tick={{ fontSize: 11, fill: "#9ca3af" }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis
                            tick={{ fontSize: 11, fill: "#9ca3af" }}
                            axisLine={false}
                            tickLine={false}
                            domain={[yMin, yMax]}
                          />
                          <Tooltip
                            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
                            formatter={(val: number | undefined) => [`${val ?? ""}${t.unit ? ` ${t.unit}` : ""}`, t.name]}
                          />
                          {/* Hard threshold reference lines */}
                          {obj?.red    != null && <ReferenceLine y={obj.red}    stroke="#ef4444" strokeDasharray="4 3" strokeWidth={1.5} />}
                          {obj?.yellow != null && <ReferenceLine y={obj.yellow} stroke="#eab308" strokeDasharray="4 3" strokeWidth={1.5} />}
                          {obj?.green  != null && <ReferenceLine y={obj.green}  stroke="#22c55e" strokeDasharray="4 3" strokeWidth={1.5} />}
                          {/* Baseline (first measurement) */}
                          <ReferenceLine
                            y={chartData[0].value}
                            stroke="#d1d5db"
                            strokeDasharray="4 4"
                            strokeWidth={1}
                          />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#8b1a2d"
                            strokeWidth={2.5}
                            dot={{ r: 4, fill: "#8b1a2d", strokeWidth: 0 }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {/* Table */}
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 border-t border-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Valor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {entries.map((e, i) => {
                        const status = obj ? evalStatus(Number(e.value), obj) : null
                        return (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="px-6 py-3 text-gray-700">{e.date}</td>
                            <td className="px-6 py-3 text-right">
                              <span className={`font-semibold ${status ? STATUS_COLORS[status] : "text-gray-800"}`}>
                                {e.value}
                              </span>
                              {t.unit ? <span className="text-xs text-gray-400 ml-1 font-normal">{t.unit}</span> : null}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          )
        })}
      </div>
    </PfLayout>
  )
}
