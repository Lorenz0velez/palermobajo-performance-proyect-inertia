import { Head, Link } from "@inertiajs/react"
import { CheckCircle, AlertCircle, ChevronRight, TrendingUp, Dumbbell, Utensils, Activity, Calendar, Clock } from "lucide-react"
import PlayerLayout from "@/layouts/player/player-layout"
import { cn } from "@/lib/utils"

interface WellnessData {
  status: "not_loaded" | "loaded"
  sleep_hours?: number
  fatigue?: number
  stress?: number
  pain?: number
  mood?: number
}

interface NextMatchData {
  id: number
  opponent: string
  home: boolean
  date: string
  kickoff_time: string | null
  team_name: string | null
  starter: boolean
  position: string | null
}

interface MatchData {
  id: string
  opponent: string
  home: boolean
  points_for: number
  points_against: number
  date: string
  minutes_played: number
  stats: { name: string; value: number }[]
}

interface TrainingData {
  id: number
  date: string
  start_time: string
  training_type: string
}

interface ObjectiveData {
  test_name: string
  unit: string
  value: number | null
  status: "green" | "yellow" | "red" | "unknown"
}

interface PhysicalPoint {
  date: string
  weight_kg: number | null
  muscle_mass_kg: number | null
  fat_mass_kg: number | null
}

interface LastPerceptionData {
  training_id: number
  training_date: string
  training_type: string | null
  rpe: number | null
  pending: boolean
}

interface PendingNutritionData {
  session_id: number
  date_display: string
  day_name: string
}

interface PlayerData {
  first_name: string
  last_name: string
  category: string
  functional_role: string
}

interface Props {
  player: PlayerData
  wellness: WellnessData | null
  last_match: MatchData | null
  next_match: NextMatchData | null
  next_training: TrainingData | null
  objectives: ObjectiveData[]
  physical_history: PhysicalPoint[]
  last_perception: LastPerceptionData | null
  pending_nutrition: PendingNutritionData | null
}

const OBJECTIVE_STYLES: Record<string, string> = {
  green: "bg-green-500 text-white",
  yellow: "bg-yellow-400 text-white",
  red: "bg-red-500 text-white",
  unknown: "bg-gray-200 text-gray-600",
}

const OBJECTIVE_LABELS: Record<string, string> = {
  green: "En Rango",
  yellow: "Cerca",
  red: "Fuera de Alcance",
  unknown: "Sin datos",
}

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "numeric" })
}

function formatTime(timeStr: string) {
  if (!timeStr) return ""
  return timeStr.slice(0, 5)
}

export default function PlayerHome({ player, wellness, last_match, next_match, next_training, objectives, physical_history, last_perception, pending_nutrition }: Props) {
  const wellnessStatus   = wellness?.status ?? "not_loaded"
  const wellnessPending  = wellnessStatus === "not_loaded"
  const rpePending       = last_perception?.pending === true
  const initials         = `${player.first_name?.[0] ?? ""}${player.last_name?.[0] ?? ""}`.toUpperCase()

  const winLose = last_match
    ? last_match.points_for > last_match.points_against ? "win" : last_match.points_for < last_match.points_against ? "loss" : "draw"
    : null

  return (
    <PlayerLayout>
      <Head title="Inicio" />

      {/* ── Hero header ─────────────────────────────────────── */}
      <div className="bg-bordo-800 px-5 pt-6 pb-8">
        <div className="flex items-center gap-4 mb-4">
          {/* Initials circle */}
          <div className="w-14 h-14 rounded-full bg-yellow-400 flex items-center justify-center shrink-0">
            <span className="text-bordo-900 font-black text-xl">{initials}</span>
          </div>
          <div>
            <p className="text-bordo-300 text-xs font-medium">Buen día,</p>
            <h1 className="text-white text-xl font-bold leading-tight">{player.first_name} {player.last_name}</h1>
            <div className="flex gap-2 mt-1 flex-wrap">
              {player.category && (
                <span className="text-xs rounded-full bg-bordo-700 text-bordo-200 px-2 py-0.5">{player.category}</span>
              )}
              {player.functional_role && (
                <span className="text-xs rounded-full bg-yellow-400/20 text-yellow-300 px-2 py-0.5">{player.functional_role}</span>
              )}
            </div>
          </div>
        </div>

        {/* Next training chip */}
        {next_training && (
          <div className="flex items-center gap-2 rounded-xl bg-bordo-700/60 backdrop-blur px-3 py-2 text-xs text-bordo-200">
            <Dumbbell className="h-3.5 w-3.5 text-yellow-400 shrink-0" />
            <span>Próximo entreno: <span className="font-semibold text-white">{formatDate(next_training.date)} – {formatTime(next_training.start_time)} hs</span></span>
          </div>
        )}
      </div>

      <div className="bg-gray-50 min-h-full -mt-2 rounded-t-2xl pb-6">

        {/* ── Pendientes ───────────────────────────────────────── */}
        {(wellnessPending || rpePending || pending_nutrition) && (
          <section className="px-4 pt-5 pb-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-bordo-600 mb-3">Pendientes</p>
            <div className="space-y-2.5">

              {/* Bienestar + Percepción — 2 col when both pending */}
              {(wellnessPending || rpePending) && (
                <div className={cn("grid gap-2.5", wellnessPending && rpePending ? "grid-cols-2" : "grid-cols-1")}>

                  {wellnessPending && (
                    <Link
                      href="/bienestar"
                      className="rounded-2xl bg-white border border-yellow-200 shadow-sm p-4 flex flex-col gap-2 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <Activity className="h-5 w-5 text-yellow-500" />
                        <AlertCircle className="h-4 w-4 text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-800">Bienestar</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">¿Cómo llegás hoy?</p>
                      </div>
                      <span className="inline-block self-start rounded-lg bg-bordo-800 text-white text-xs font-semibold px-3 py-1.5">
                        Completar ✓
                      </span>
                    </Link>
                  )}

                  {rpePending && (
                    <Link
                      href={`/player/trainings/${last_perception!.training_id}`}
                      className="rounded-2xl bg-white border border-yellow-200 shadow-sm p-4 flex flex-col gap-2 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <Dumbbell className="h-5 w-5 text-yellow-500" />
                        <AlertCircle className="h-4 w-4 text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-800">Percepción</p>
                        <p className="text-[11px] text-gray-400 mt-0.5 capitalize">{last_perception!.training_type ?? "Entreno"} pendiente</p>
                      </div>
                      <span className="inline-block self-start rounded-lg bg-bordo-800 text-white text-xs font-semibold px-3 py-1.5">
                        Cargar RPE
                      </span>
                    </Link>
                  )}
                </div>
              )}

              {/* Nutrition */}
              {pending_nutrition && (
                <Link
                  href={`/player/nutrition_sessions/${pending_nutrition.session_id}`}
                  className="flex items-center gap-3 rounded-2xl bg-white border border-green-200 shadow-sm px-4 py-3.5 hover:shadow-md transition-shadow"
                >
                  <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                    <Utensils className="h-4.5 w-4.5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800">Turno de Nutrición</p>
                    <p className="text-[11px] text-gray-400 capitalize">{pending_nutrition.day_name} {pending_nutrition.date_display} · elegí tu horario</p>
                  </div>
                  <AlertCircle className="h-4 w-4 text-yellow-400 shrink-0" />
                </Link>
              )}

            </div>
          </section>
        )}

        {/* Completed wellness / RPE badges — only show when NOT pending */}
        {(!wellnessPending || !rpePending) && (wellnessStatus === "loaded" || (last_perception && !last_perception.pending)) && (
          <section className="px-4 pt-4">
            <div className="flex gap-2 flex-wrap">
              {wellnessStatus === "loaded" && (
                <div className="flex items-center gap-1.5 rounded-full bg-green-50 border border-green-200 px-3 py-1 text-xs text-green-700 font-medium">
                  <CheckCircle className="h-3.5 w-3.5" /> Bienestar cargado
                </div>
              )}
              {last_perception && !last_perception.pending && (
                <Link
                  href={`/player/trainings/${last_perception.training_id}`}
                  className="flex items-center gap-1.5 rounded-full bg-green-50 border border-green-200 px-3 py-1 text-xs text-green-700 font-medium hover:bg-green-100 transition-colors"
                >
                  <CheckCircle className="h-3.5 w-3.5" /> RPE {last_perception.rpe}/10
                </Link>
              )}
            </div>
          </section>
        )}

        {/* ── Partidos ─────────────────────────────────────────── */}
        <section className="px-4 pt-5 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-bordo-600">Partidos</p>

          {/* Próximo */}
          {next_match && (
            <Link href={`/player/matches/${next_match.id}`} className="block rounded-2xl bg-bordo-800 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-bordo-700">
                <p className="text-xs font-semibold text-bordo-300 uppercase tracking-wide flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> Próximo
                </p>
                {next_match.team_name && (
                  <span className="rounded-full bg-yellow-400 px-2.5 py-0.5 text-xs font-bold text-bordo-900">{next_match.team_name}</span>
                )}
              </div>
              <div className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-xs text-bordo-300 mb-0.5">{next_match.home ? "Local" : "Visitante"}</p>
                  <p className="text-lg font-bold text-white">vs. {next_match.opponent}</p>
                  <p className="text-xs text-bordo-300 mt-1">{formatDate(next_match.date)}{next_match.kickoff_time ? ` · ${next_match.kickoff_time} hs` : ""}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-bordo-400">{next_match.starter ? "Titular" : "Suplente"}</p>
                  {next_match.position && <p className="text-sm font-bold text-yellow-400 mt-0.5">{next_match.position}</p>}
                </div>
              </div>
            </Link>
          )}

          {/* Último */}
          {last_match && (
            <div className="rounded-2xl bg-white shadow-sm overflow-hidden border border-gray-100">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> Último partido
                </p>
                <Link href={`/player/matches/${last_match.id}`} className="text-bordo-600 text-xs flex items-center gap-0.5 hover:text-bordo-800">
                  Ver todos <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="px-4 py-3">
                <div className="flex items-center gap-3 mb-2">
                  <p className="text-sm font-bold text-gray-800">vs. {last_match.opponent}</p>
                  <span className="text-xs text-gray-400">{last_match.home ? "Local" : "Visitante"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-3xl font-black",
                    winLose === "win" ? "text-green-600" : winLose === "loss" ? "text-red-500" : "text-gray-600"
                  )}>{last_match.points_for}</span>
                  <span className="text-lg text-gray-300">–</span>
                  <span className="text-3xl font-bold text-gray-400">{last_match.points_against}</span>
                  {winLose && (
                    <span className={cn(
                      "ml-1 text-xs rounded-full px-2 py-0.5 font-semibold",
                      winLose === "win" ? "bg-green-50 text-green-700" : winLose === "loss" ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-500"
                    )}>
                      {winLose === "win" ? "Victoria" : winLose === "loss" ? "Derrota" : "Empate"}
                    </span>
                  )}
                  <div className="ml-auto text-right">
                    <p className="text-xs text-gray-400">Minutos</p>
                    <p className="text-xl font-bold text-bordo-700">{last_match.minutes_played}'</p>
                  </div>
                </div>
                {last_match.stats.length > 0 && (
                  <div className="mt-3 flex gap-5 pt-2.5 border-t border-gray-100">
                    {last_match.stats.slice(0, 3).map((s) => (
                      <div key={s.name} className="text-center">
                        <p className="text-base font-bold text-bordo-800">{s.value}</p>
                        <p className="text-[11px] text-gray-400 leading-tight">{s.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {!next_match && !last_match && (
            <p className="text-sm text-gray-400 text-center py-4">Sin partidos registrados aún.</p>
          )}
        </section>

        {/* ── Físico ───────────────────────────────────────────── */}
        {(objectives.length > 0 || physical_history.length > 1) && (
          <section className="px-4 pt-5 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-bordo-600">Físico</p>

            {/* Objetivos */}
            {objectives.length > 0 && (
              <div className="rounded-2xl bg-white shadow-sm overflow-hidden border border-gray-100">
                <div className="px-4 py-2.5 border-b border-gray-100">
                  <h2 className="text-sm font-semibold text-gray-800">Objetivos</h2>
                </div>
                <div className="divide-y divide-gray-50">
                  {objectives.map((obj) => (
                    <div key={obj.test_name} className="flex items-center justify-between px-4 py-2.5">
                      <p className="text-sm text-gray-700">{obj.test_name}</p>
                      <div className="flex items-center gap-2">
                        {obj.value != null && (
                          <span className="text-sm font-semibold text-gray-600">{obj.value}{obj.unit}</span>
                        )}
                        <span className={cn(
                          "rounded-full px-2.5 py-0.5 text-xs font-medium",
                          OBJECTIVE_STYLES[obj.status]
                        )}>
                          {OBJECTIVE_LABELS[obj.status]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Historial Físico */}
            {physical_history.length > 1 && (
              <div className="rounded-2xl bg-white shadow-sm overflow-hidden border border-gray-100">
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100">
                  <TrendingUp className="h-4 w-4 text-bordo-600" />
                  <h2 className="text-sm font-semibold text-gray-800">Progreso</h2>
                </div>
                <div className="p-4 grid grid-cols-3 gap-4">
                  {([
                    { key: "weight_kg" as const,      label: "Peso",       color: "bg-bordo-400",  textColor: "text-bordo-800",  unit: "kg" },
                    { key: "muscle_mass_kg" as const,  label: "Muscular",   color: "bg-yellow-400", textColor: "text-yellow-700", unit: "kg" },
                    { key: "fat_mass_kg" as const,     label: "Grasa",      color: "bg-blue-400",   textColor: "text-blue-700",   unit: "kg" },
                  ]).map(({ key, label, color, textColor, unit }) => {
                    const vals = physical_history.map(h => h[key] ?? 0).filter(Boolean)
                    const min = Math.min(...vals)
                    const max = Math.max(...vals)
                    const range = max - min || 1
                    const last = physical_history[physical_history.length - 1]?.[key]
                    return (
                      <div key={key}>
                        <p className="text-[11px] font-medium text-gray-500 mb-2">{label}</p>
                        <div className="flex items-end gap-0.5 h-12">
                          {physical_history.map((p, i) => {
                            const v = p[key]
                            const h = v ? ((v - min) / range) * 100 : 0
                            return (
                              <div key={i} className="flex-1 flex flex-col justify-end">
                                <div className={`rounded-sm ${color} transition-all`} style={{ height: `${Math.max(8, h)}%` }} />
                              </div>
                            )
                          })}
                        </div>
                        <p className={`mt-1.5 text-right text-xs font-bold ${textColor}`}>
                          {last ?? "—"} {last ? unit : ""}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </section>
        )}

      </div>
    </PlayerLayout>
  )
}
