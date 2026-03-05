import { Head, Link } from "@inertiajs/react"

import PfLayout from "@/layouts/pf/pf-layout"

interface WellnessDay {
  date: string
  avg_sleep: number
  avg_energy: number
  avg_legs: number
  avg_pain: number
  responses: number
}

interface PlayerWellness {
  id: number
  name: string
  functional_role: string | null
  last_date: string | null
  energy: number | null
  pain: number | null
  leg_feel: number | null
  readiness: number | null
}

interface PerceptionSummary {
  training_id: number
  date: string | null
  objective: string | null
  total_players: number
  avg_rpe: number | null
  avg_fatigue: number | null
}

interface Props {
  category: { id: number; name: string } | null
  wellness_by_day: WellnessDay[]
  players_wellness: PlayerWellness[]
  perceptions_summary: PerceptionSummary[]
}

function badge(val: number | null, invert = false) {
  if (val === null) return <span className="text-gray-300">—</span>
  const isGood = invert ? val >= 4 : val <= 2
  const isMid  = val === 3
  const cls = isGood ? "bg-green-100 text-green-700" : isMid ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
  return <span className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold ${cls}`}>{val}</span>
}

function ReadinessBadge({ val }: { val: number | null }) {
  if (val === null) return <span className="text-gray-300">—</span>
  const labels = { 1: "Normal", 2: "Regulando", 3: "Liviano" }
  const colors  = { 1: "bg-green-100 text-green-700", 2: "bg-amber-100 text-amber-700", 3: "bg-orange-100 text-orange-700" }
  return <span className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold ${colors[val as 1|2|3] ?? ""}`}>{labels[val as 1|2|3] ?? val}</span>
}

export default function PfHome({ category, wellness_by_day, players_wellness, perceptions_summary }: Props) {
  return (
    <PfLayout>
      <Head title="PF — Inicio" />

      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bienestar del Plantel</h1>
          {category && <p className="text-sm text-gray-500 mt-1">Categoría {category.name}</p>}
        </div>

        {/* Wellness last 7 days table */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Promedios últimos 7 días</h2>
            <p className="text-xs text-gray-400 mt-0.5">Escala 1 (mejor) → 5 (peor)</p>
          </div>
          {wellness_by_day.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-gray-400">Sin datos de bienestar registrados</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Sueño</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Energía</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Piernas</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Dolor</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Resp.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {wellness_by_day.map((d) => (
                    <tr key={d.date} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-700">{d.date}</td>
                      <td className="px-4 py-3 text-center">{badge(d.avg_sleep)}</td>
                      <td className="px-4 py-3 text-center">{badge(d.avg_energy)}</td>
                      <td className="px-4 py-3 text-center">{badge(d.avg_legs)}</td>
                      <td className="px-4 py-3 text-center">{badge(d.avg_pain)}</td>
                      <td className="px-4 py-3 text-center text-gray-500">{d.responses}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Per-player wellness */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Estado por Jugador</h2>
            <Link href="/pf/squad" className="text-xs font-medium text-bordo-700 hover:underline">Ver plantel →</Link>
          </div>
          {players_wellness.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-gray-400">Sin jugadores en la categoría</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Jugador</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Último</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Energía</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Piernas</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Dolor</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Disponibilidad</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {players_wellness.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800">{p.name}</div>
                        {p.functional_role && <div className="text-xs text-gray-400">{p.functional_role}</div>}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-500">{p.last_date ?? <span className="text-gray-300">Sin datos</span>}</td>
                      <td className="px-4 py-3 text-center">{badge(p.energy)}</td>
                      <td className="px-4 py-3 text-center">{badge(p.leg_feel)}</td>
                      <td className="px-4 py-3 text-center">{badge(p.pain)}</td>
                      <td className="px-4 py-3 text-center"><ReadinessBadge val={p.readiness} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Latest trainings perceptions */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Percepciones de Entrenamientos</h2>
            <Link href="/pf/trainings" className="text-xs font-medium text-bordo-700 hover:underline">Ver todos →</Link>
          </div>
          {perceptions_summary.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-gray-400">Sin entrenamientos recientes</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Objetivo</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Jugadores</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">RPE Prom.</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Fatiga Prom.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {perceptions_summary.map((t) => (
                    <tr key={t.training_id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-700">{t.date ?? "—"}</td>
                      <td className="px-4 py-3 text-gray-600">{t.objective ?? <span className="text-gray-300">Sin objetivo</span>}</td>
                      <td className="px-4 py-3 text-center text-gray-600">{t.total_players}</td>
                      <td className="px-4 py-3 text-center">{t.avg_rpe ?? <span className="text-gray-300">—</span>}</td>
                      <td className="px-4 py-3 text-center">{t.avg_fatigue ?? <span className="text-gray-300">—</span>}</td>
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
