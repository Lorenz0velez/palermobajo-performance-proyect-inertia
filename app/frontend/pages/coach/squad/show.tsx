import { Head, Link } from "@inertiajs/react"
import { Activity, AlertTriangle, Apple, ArrowLeft, BarChart2, Dumbbell, Minus, TrendingDown, TrendingUp } from "lucide-react"
import { useState } from "react"

import CoachLayout from "@/layouts/coach/coach-layout"
import { cn } from "@/lib/utils"

interface Physical {
  weight_kg: number; height_cm: number; muscle_mass_kg: number; fat_mass_kg: number
}
interface Injury {
  type: string; body_zone: string; start_date: string; active: boolean
}
interface Player {
  id: number; first_name: string; last_name: string; functional_role: string
  physical: Physical; injuries: Injury[]
}
interface PfEvalHistory { date: string; value: number }
interface PfEval {
  test_id: number; test_name: string; test_unit: string | null
  latest_value: number | null; latest_date: string | null
  history: PfEvalHistory[]
}
interface NutritionHistoryEntry {
  id: number; date: string; weight_kg: number | null; muscle_mass_kg: number | null
  fat_mass_kg: number | null
  muscle_direction: string | null; fat_direction: string | null; notes: string | null
}
interface NutritionPlan {
  id: number; date: string; recommendations: string | null
  breakfast: string | null; lunch: string | null; dinner: string | null
  snacks: string | null; extra_notes: string | null
}
interface SeasonStats {
  id: number; matches: number; minutes: number
  tries: number; tackles: number; tackles_missed: number
  carries: number; meters: number; rucks: number; turnovers: number
}
interface MatchBreakdown {
  match_id: number; category: string; opponent: string
  date: string; result: string; home: boolean
  minutes: number; starter: boolean; absent?: boolean
  tries: number; tackles: number; tackles_missed: number
  carries: number; meters: number; rucks: number; turnovers: number
}
interface Props {
  player: Player
  pf_evals: PfEval[]
  nutrition_history: NutritionHistoryEntry[]
  nutrition_plans: NutritionPlan[]
  season_stats: SeasonStats | null
  match_breakdown: MatchBreakdown[]
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-3 text-center shadow-sm">
      <p className="text-xl font-bold text-bordo-800">{value}</p>
      <p className="text-xs text-gray-400 mt-0.5 leading-tight">{label}</p>
    </div>
  )
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })
}

const DIRECTION_CFG: Record<string, { icon: React.ReactNode; label: string; cls: string }> = {
  subir:    { icon: <TrendingUp className="h-3.5 w-3.5" />,   label: "Subir",    cls: "text-green-700 bg-green-50" },
  mantener: { icon: <Minus className="h-3.5 w-3.5" />,        label: "Mantener", cls: "text-blue-700 bg-blue-50"   },
  bajar:    { icon: <TrendingDown className="h-3.5 w-3.5" />, label: "Bajar",    cls: "text-red-700 bg-red-50"     },
}

function DirectionTag({ dir, label }: { dir: string | null; label: string }) {
  if (!dir || !DIRECTION_CFG[dir]) return null
  const cfg = DIRECTION_CFG[dir]
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold", cfg.cls)}>
      {cfg.icon} {label}: {cfg.label}
    </span>
  )
}

/* ─── Tabs ─────────────────────────────────────────────────────── */
type Tab = "resumen" | "pf" | "nutricion" | "stats"

function TabButton({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: React.ElementType; label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-semibold transition-colors border-b-2",
        active ? "border-bordo-700 text-bordo-700" : "border-transparent text-gray-400 hover:text-gray-600"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )
}

/* ─── PF Evaluaciones tab ───────────────────────────────────────── */
function PfTab({ pf_evals }: { pf_evals: PfEval[] }) {
  if (pf_evals.length === 0) {
    return <p className="text-center text-sm text-gray-400 py-8">Sin evaluaciones físicas registradas.</p>
  }
  return (
    <div className="space-y-3">
      {pf_evals.map((ev) => (
        <div key={ev.test_id} className="rounded-xl border border-gray-100 bg-white shadow-sm p-4">
          <div className="flex items-start justify-between">
            <p className="font-semibold text-gray-900 text-sm">{ev.test_name}</p>
            {ev.latest_date && (
              <span className="text-xs text-gray-400">{new Date(ev.latest_date).toLocaleDateString("es-AR")}</span>
            )}
          </div>
          <div className="mt-2 flex items-end gap-2">
            {ev.latest_value !== null ? (
              <>
                <span className="text-2xl font-bold text-bordo-700">{Number(ev.latest_value).toFixed(1)}</span>
                {ev.test_unit && <span className="text-sm text-gray-400 mb-0.5">{ev.test_unit}</span>}
              </>
            ) : (
              <span className="text-sm text-gray-400 italic">Sin registro</span>
            )}
          </div>
          {ev.history.length > 1 && (
            <div className="mt-2 flex gap-2 overflow-x-auto">
              {ev.history.slice(0, 5).map((h, i) => (
                <div key={i} className="flex-none rounded-lg bg-gray-50 px-2 py-1 text-xs text-center">
                  <p className="font-semibold text-gray-700">{Number(h.value).toFixed(1)}</p>
                  <p className="text-gray-400">{new Date(h.date).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" })}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

/* ─── Nutrición tab ─────────────────────────────────────────────── */
function NutriTab({ nutrition_history, nutrition_plans }: { nutrition_history: NutritionHistoryEntry[]; nutrition_plans: NutritionPlan[] }) {
  const latest = nutrition_history[0]
  return (
    <div className="space-y-4">
      {/* Latest measurements */}
      {latest ? (
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
            Última medición — {new Date(latest.date).toLocaleDateString("es-AR")}
          </p>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { label: "Peso", value: latest.weight_kg,       unit: "kg" },
              { label: "Músculo", value: latest.muscle_mass_kg, unit: "kg" },
              { label: "Grasa", value: latest.fat_mass_kg,   unit: "kg" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-lg font-bold text-gray-900">{s.value !== null ? Number(s.value).toFixed(1) : "—"}</p>
                <p className="text-xs text-gray-400">{s.unit}</p>
                <p className="text-xs text-gray-500 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
          {(latest.muscle_direction ?? latest.fat_direction) && (
            <div className="mt-3 flex flex-wrap gap-2 pt-3 border-t border-gray-50">
              <DirectionTag dir={latest.muscle_direction} label="Músculo" />
              <DirectionTag dir={latest.fat_direction}    label="Grasa"   />
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-400 text-center py-4">Sin mediciones.</p>
      )}

      {/* Nutrition plans */}
      {nutrition_plans.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Planes nutricionales</p>
          <div className="space-y-3">
            {nutrition_plans.map((p) => (
              <div key={p.id} className="rounded-xl border border-gray-100 bg-white shadow-sm p-4">
                <p className="text-sm font-semibold text-gray-800 mb-1">
                  Plan: {new Date(p.date).toLocaleDateString("es-AR")}
                </p>
                {p.recommendations && <p className="text-sm text-gray-700">{p.recommendations}</p>}
                {!!(p.breakfast ?? p.lunch ?? p.dinner ?? p.snacks) && (
                  <div className="mt-2 space-y-1 text-xs text-gray-600">
                    {p.breakfast && <p><b>Desayuno:</b> {p.breakfast}</p>}
                    {p.lunch     && <p><b>Almuerzo:</b> {p.lunch}</p>}
                    {p.dinner    && <p><b>Cena:</b> {p.dinner}</p>}
                    {p.snacks    && <p><b>Colaciones:</b> {p.snacks}</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History table */}
      {nutrition_history.length > 1 && (
        <div>
          <p className="text-xs font-semibind uppercase tracking-wide text-gray-400 mb-2">Historial de mediciones</p>
          <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-gray-50">
                <tr>
                  {["Fecha","Peso","Músculo","Grasa","Direcciones"].map(h => (
                    <th key={h} className="px-3 py-2 text-left text-gray-500 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {nutrition_history.map((h) => (
                  <tr key={h.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-gray-600">{new Date(h.date).toLocaleDateString("es-AR")}</td>
                    <td className="px-3 py-2 font-semibold">{h.weight_kg ?? "—"}</td>
                    <td className="px-3 py-2">{h.muscle_mass_kg ?? "—"}</td>
                    <td className="px-3 py-2">{h.fat_mass_kg ?? "—"}</td>
                    <td className="px-3 py-2">
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
        </div>
      )}
    </div>
  )
}

/* ─── Stats tab ────────────────────────────────────────────────── */
function StatsTab({ season_stats, match_breakdown }: { season_stats: SeasonStats | null; match_breakdown: MatchBreakdown[] }) {
  if (!season_stats && match_breakdown.length === 0) {
    return <p className="text-center text-sm text-gray-400 py-8">Sin estadísticas registradas.</p>
  }

  return (
    <div className="space-y-5">
      {/* Season totals */}
      {season_stats && (
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Temporada 2026</h2>
          <div className="grid grid-cols-3 gap-2">
            <StatCard label="Partidos"  value={season_stats.matches}        />
            <StatCard label="Minutos"   value={season_stats.minutes}        />
            <StatCard label="Tries"     value={season_stats.tries}          />
            <StatCard label="Tackles"   value={season_stats.tackles}        />
            <StatCard label="T. Err."   value={season_stats.tackles_missed} />
            <StatCard label="Portac."   value={season_stats.carries}        />
            <StatCard label="Metros"    value={season_stats.meters}         />
            <StatCard label="Rucks"     value={season_stats.rucks}          />
            <StatCard label="Pérdidas"  value={season_stats.turnovers}      />
          </div>
        </section>
      )}

      {/* Per-match breakdown */}
      {match_breakdown.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Por partido</h2>
          <div className="space-y-3">
            {match_breakdown.map((m) => (
              <div key={m.match_id} className={`rounded-2xl border shadow-sm p-4 ${
                m.absent ? "bg-gray-50 border-gray-200 opacity-60" : "bg-white border-gray-100"
              }`}>
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        m.result === "win" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {m.result === "win" ? "Victoria" : "Derrota"}
                      </span>
                      <span className="text-xs rounded-full bg-bordo-100 text-bordo-700 px-2 py-0.5 font-semibold">
                        {m.category}
                      </span>
                    </div>
                    <p className="font-semibold text-gray-900 text-sm mt-1">vs. {m.opponent}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(m.date).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
                      {" · "}{m.home ? "Local" : "Visitante"}
                    </p>
                  </div>
                  <div className="text-right">
                    {m.absent ? (
                      <span className="text-xs text-gray-400 italic">Ausente</span>
                    ) : (
                      <>
                        <p className="text-sm font-bold text-bordo-800">{m.minutes}&apos;</p>
                        <p className="text-xs text-gray-400">{m.starter ? "Titular" : "Ingresó"}</p>
                      </>
                    )}
                  </div>
                </div>
                {/* Stats grid */}
                {!m.absent && (
                  <div className="grid grid-cols-4 gap-2 border-t border-gray-50 pt-3">
                    {[
                      { label: "Tries",    value: m.tries           },
                      { label: "Tackles",  value: m.tackles         },
                      { label: "T.Err.",   value: m.tackles_missed  },
                      { label: "Portac.",  value: m.carries         },
                      { label: "Metros",   value: m.meters          },
                      { label: "Rucks",    value: m.rucks           },
                      { label: "Pérd.",    value: m.turnovers       },
                    ].map((s) => (
                      <div key={s.label} className="text-center">
                        <p className="text-base font-bold text-bordo-800">{s.value}</p>
                        <p className="text-xs text-gray-400">{s.label}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

/* ─── Main component ────────────────────────────────────────────── */
export default function CoachSquadShow({ player, pf_evals, nutrition_history, nutrition_plans, season_stats, match_breakdown }: Props) {
  const [tab, setTab] = useState<Tab>("resumen")
  const initials = `${player.first_name[0]}${player.last_name[0]}`
  const activeInjuries = player.injuries.filter(i => i.active)

  return (
    <CoachLayout>
      <Head title={`${player.first_name} ${player.last_name}`} />

      {/* Hero header */}
      <div className="bg-bordo-800 px-4 pt-12 pb-8 relative">
        <Link href="/coach/squad" className="absolute top-10 left-4 text-white/70 hover:text-white flex items-center gap-1 text-sm">
          <ArrowLeft className="h-4 w-4" /> Plantel
        </Link>
        <div className="flex flex-col items-center text-center mt-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-400 text-bordo-900 text-2xl font-bold shadow-lg">
            {initials}
          </div>
          <h1 className="mt-3 text-xl font-bold text-white">{player.first_name} {player.last_name}</h1>
          <span className="mt-1 rounded-full bg-white/15 px-3 py-1 text-sm font-medium text-white">{player.functional_role}</span>
          <span className="mt-1 rounded-full bg-yellow-400/20 px-3 py-1 text-xs font-semibold text-yellow-300">Plantel Superior</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
        <TabButton active={tab === "resumen"}   onClick={() => setTab("resumen")}   icon={BarChart2} label="Resumen"    />
        <TabButton active={tab === "stats"}     onClick={() => setTab("stats")}     icon={Activity}  label="Stats"     />
        <TabButton active={tab === "pf"}        onClick={() => setTab("pf")}        icon={Dumbbell}  label="Eval. PF"  />
        <TabButton active={tab === "nutricion"} onClick={() => setTab("nutricion")} icon={Apple}     label="Nutrición" />
      </div>

      <div className="px-4 pt-4 pb-8 space-y-5">

        {tab === "resumen" && (
          <>
            {/* Lesiones activas */}
            {activeInjuries.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-red-600 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4" /> Lesiones Activas
                </h2>
                <div className="space-y-2">
                  {activeInjuries.map((inj, i) => (
                    <div key={i} className="rounded-2xl border border-red-100 bg-red-50 p-4">
                      <p className="font-semibold text-red-800 text-sm">{inj.type} — {inj.body_zone}</p>
                      <p className="text-xs text-red-500 mt-0.5">Desde {formatDate(inj.start_date)}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Datos Físicos */}
            <section>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Datos Físicos</h2>
              <div className="grid grid-cols-2 gap-2">
                <StatCard label="Peso (kg)"    value={player.physical.weight_kg}     />
                <StatCard label="Talla (cm)"   value={player.physical.height_cm}     />
                <StatCard label="Músculo (kg)" value={player.physical.muscle_mass_kg}/>
                <StatCard label="Grasa (kg)"   value={player.physical.fat_mass_kg}   />
              </div>
            </section>


          </>
        )}

        {tab === "stats" && (
          <StatsTab season_stats={season_stats} match_breakdown={match_breakdown} />
        )}

        {tab === "pf" && <PfTab pf_evals={pf_evals} />}

        {tab === "nutricion" && (
          <NutriTab nutrition_history={nutrition_history} nutrition_plans={nutrition_plans} />
        )}
      </div>
    </CoachLayout>
  )
}
