import { Head, Link } from "@inertiajs/react"
import { AlertCircle, CheckCircle, ChevronRight, TrendingUp } from "lucide-react"
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
  const wellnessStatus = wellness?.status ?? "not_loaded"

  const winLose = last_match
    ? last_match.points_for > last_match.points_against ? "win" : last_match.points_for < last_match.points_against ? "loss" : "draw"
    : null

  return (
    <PlayerLayout>
      <Head title="Inicio" />

      {/* Info pills bar */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex gap-2 flex-wrap">
        {player.category && (
          <div className="rounded-lg border border-bordo-100 bg-bordo-50 px-3 py-1.5">
            <p className="text-xs text-bordo-400">Categoría</p>
            <p className="text-sm font-semibold text-bordo-800">{player.category}</p>
          </div>
        )}
        {player.functional_role && (
          <div className="rounded-lg border border-bordo-100 bg-bordo-50 px-3 py-1.5">
            <p className="text-xs text-bordo-400">Posición</p>
            <p className="text-sm font-semibold text-bordo-800">{player.functional_role}</p>
          </div>
        )}
        {next_training && (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-1.5">
            <p className="text-xs text-yellow-600">Próximo entrenamiento</p>
            <p className="text-sm font-semibold text-yellow-800">
              {formatDate(next_training.date)} – {formatTime(next_training.start_time)} hs
            </p>
          </div>
        )}
      </div>

      <div className="space-y-3 px-4 pt-4 pb-4 bg-gray-50 min-h-full">

        {/* Bienestar + Percepción — 2 columnas */}
        <div className="grid grid-cols-2 gap-3">
          {/* Bienestar Diario */}
          <div className="rounded-2xl bg-white shadow-sm overflow-hidden border border-gray-100">
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-800">Bienestar</h2>
              {wellnessStatus === "loaded"
                ? <CheckCircle className="h-4 w-4 text-green-500" />
                : <AlertCircle className="h-4 w-4 text-yellow-500" />}
            </div>
            <div className="p-3">
              {wellnessStatus === "not_loaded" ? (
                <>
                  <p className="text-xs text-gray-500 mb-2">¿Cómo llegás hoy?</p>
                  <Link
                    href="/bienestar"
                    className="block w-full rounded-xl bg-bordo-800 py-2 text-center text-xs font-semibold text-white hover:bg-bordo-700 transition-colors"
                  >
                    Completar ✓
                  </Link>
                </>
              ) : (
                <p className="text-xs text-gray-600">Ya cargaste tu bienestar de hoy. ¡Adelante!</p>
              )}
            </div>
          </div>

          {/* Percepción último entreno */}
          <div className="rounded-2xl bg-white shadow-sm overflow-hidden border border-gray-100">
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-800">Percepción</h2>
              {last_perception && !last_perception.pending
                ? <CheckCircle className="h-4 w-4 text-green-500" />
                : last_perception?.pending
                  ? <AlertCircle className="h-4 w-4 text-yellow-500" />
                  : null}
            </div>
            <div className="p-3">
              {!last_perception ? (
                <p className="text-xs text-gray-400">Sin entrenamientos recientes</p>
              ) : last_perception.pending ? (
                <>
                  <p className="text-xs text-gray-500 mb-2 capitalize">{last_perception.training_type ?? "Entrenamiento"}</p>
                  <Link
                    href={`/player/trainings/${last_perception.training_id}`}
                    className="block w-full rounded-xl bg-bordo-800 py-2 text-center text-xs font-semibold text-white hover:bg-bordo-700 transition-colors"
                  >
                    Cargar RPE
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-xs text-gray-400 mb-1 capitalize">{last_perception.training_type ?? "Entreno"}</p>
                  <p className="text-3xl font-bold text-bordo-800">{last_perception.rpe}<span className="text-sm text-gray-400 font-normal">/10</span></p>
                  <Link href={`/player/trainings/${last_perception.training_id}`} className="text-xs text-bordo-600 underline">Editar</Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Nutrición pendiente */}
        {pending_nutrition && (
          <Link
            href={`/player/nutrition_sessions/${pending_nutrition.session_id}`}
            className="flex items-center gap-3 rounded-2xl bg-yellow-50 border border-yellow-300 shadow-sm px-4 py-3 hover:bg-yellow-100 transition-colors"
          >
            <span className="text-xl">🥗</span>
            <div className="flex-1">
              <p className="text-xs font-semibold text-yellow-800 uppercase tracking-wide">Turno de Nutrición Pendiente</p>
              <p className="text-sm text-yellow-700 capitalize">{pending_nutrition.day_name} {pending_nutrition.date_display}</p>
            </div>
            <span className="text-yellow-500 text-lg">›</span>
          </Link>
        )}

        {/* Próximo Partido */}
        {next_match && (
          <Link href={`/player/matches/${next_match.id}`} className="block rounded-2xl bg-bordo-800 shadow-sm overflow-hidden border border-bordo-700">
            <div className="flex items-center justify-between px-4 py-3 border-b border-bordo-700">
              <h2 className="font-semibold text-white">Próximo Partido</h2>
              {next_match.team_name && (
                <span className="rounded-full bg-yellow-400 px-2.5 py-0.5 text-xs font-bold text-bordo-900">{next_match.team_name}</span>
              )}
            </div>
            <div className="p-4">
              <p className="text-xs text-bordo-300 mb-1">{next_match.home ? "Local" : "Visitante"}</p>
              <p className="text-lg font-bold text-white">vs. {next_match.opponent}</p>
              <div className="mt-2 flex items-center gap-4">
                <div>
                  <p className="text-xs text-bordo-300">Fecha</p>
                  <p className="text-sm font-semibold text-white">{formatDate(next_match.date)}</p>
                </div>
                {next_match.kickoff_time && (
                  <div>
                    <p className="text-xs text-bordo-300">Horario</p>
                    <p className="text-sm font-semibold text-white">{next_match.kickoff_time} hs</p>
                  </div>
                )}
                <div className="ml-auto text-right">
                  <p className="text-xs text-bordo-300">{next_match.starter ? "Titular" : "Suplente"}</p>
                  {next_match.position && <p className="text-sm font-semibold text-yellow-400">{next_match.position}</p>}
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Último Partido */}
        {last_match && (
          <div className="rounded-2xl bg-white shadow-sm overflow-hidden border border-gray-100">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Último Partido</h2>
              <Link href={`/player/matches/${last_match.id}`} className="text-bordo-600 text-sm flex items-center gap-0.5 hover:text-bordo-800">
                Ver todos <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="p-4">
              <p className="text-xs text-gray-400 mb-1">{last_match.home ? "Local" : "Visitante"}</p>
              <p className="text-base font-bold text-gray-800">vs. {last_match.opponent}</p>
              <div className="mt-2 flex items-center gap-3">
                <span className={cn("text-4xl font-black", winLose === "win" ? "text-green-600" : winLose === "loss" ? "text-red-500" : "text-bordo-800")}>
                  {last_match.points_for}
                </span>
                <span className="text-xl text-gray-300">–</span>
                <span className="text-4xl font-bold text-gray-400">{last_match.points_against}</span>
                {winLose && (
                  <span className={cn(
                    "text-xs rounded-full px-2 py-0.5 font-semibold",
                    winLose === "win" ? "bg-green-50 text-green-700" : winLose === "loss" ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-500"
                  )}>
                    {winLose === "win" ? "Victoria" : winLose === "loss" ? "Derrota" : "Empate"}
                  </span>
                )}
                <div className="ml-auto text-right">
                  <p className="text-xs text-gray-400">Min. jugados</p>
                  <p className="text-2xl font-bold text-bordo-700">{last_match.minutes_played}'</p>
                </div>
              </div>
              {last_match.stats.length > 0 && (
                <div className="mt-3 flex gap-4 pt-3 border-t border-gray-100">
                  {last_match.stats.slice(0, 3).map((s) => (
                    <div key={s.name} className="text-center">
                      <p className="text-lg font-bold text-bordo-800">{s.value}</p>
                      <p className="text-xs text-gray-400">{s.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Objetivos Físicos */}
        {objectives.length > 0 && (
          <div className="rounded-2xl bg-white shadow-sm overflow-hidden border border-gray-100">
            <div className="px-4 py-3 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Tus Objetivos</h2>
            </div>
            <div className="p-4 space-y-2">
              {objectives.map((obj) => (
                <div key={obj.test_name} className="flex items-center justify-between">
                  <p className="text-sm text-gray-700">{obj.test_name}</p>
                  <div className="flex items-center gap-2">
                    {obj.value != null && (
                      <span className="text-sm font-semibold text-gray-600">{obj.value}{obj.unit}</span>
                    )}
                    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", OBJECTIVE_STYLES[obj.status])}>
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
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
              <TrendingUp className="h-4 w-4 text-bordo-600" />
              <h2 className="font-semibold text-gray-800">Progreso Físico</h2>
            </div>
            <div className="p-4 grid grid-cols-3 gap-3">
              {([
                { key: "weight_kg" as const,     label: "Peso",      color: "bg-bordo-400",  textColor: "text-bordo-800" },
                { key: "muscle_mass_kg" as const, label: "Masa Musc.",color: "bg-yellow-400", textColor: "text-yellow-700" },
                { key: "fat_mass_kg" as const,    label: "Masa Grasa",color: "bg-blue-400",   textColor: "text-blue-700" },
              ]).map(({ key, label, color, textColor }) => {
                const vals = physical_history.map(h => h[key] ?? 0).filter(Boolean)
                const min = Math.min(...vals)
                const max = Math.max(...vals)
                const range = max - min || 1
                const last = physical_history[physical_history.length - 1]?.[key]
                return (
                  <div key={key}>
                    <p className="text-xs font-medium text-gray-500 mb-2">{label}</p>
                    <div className="flex items-end gap-0.5 h-14">
                      {physical_history.map((p, i) => {
                        const v = p[key]
                        const h = v ? ((v - min) / range) * 100 : 0
                        return (
                          <div key={i} className="flex-1 flex flex-col justify-end">
                            <div className={`rounded-sm ${color} transition-all`} style={{ height: `${Math.max(10, h)}%` }} />
                          </div>
                        )
                      })}
                    </div>
                    <p className={`mt-1 text-right text-xs font-semibold ${textColor}`}>
                      {last ?? "—"}{last ? " kg" : ""}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

      </div>
    </PlayerLayout>
  )
}
