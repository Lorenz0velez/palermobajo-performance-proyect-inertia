import { Head, Link } from "@inertiajs/react"
import { Bell, CheckCircle, AlertCircle, ChevronRight, TrendingUp } from "lucide-react"
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
  next_training: TrainingData | null
  objectives: ObjectiveData[]
  physical_history: PhysicalPoint[]
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
  const d = new Date(dateStr)
  return d.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "numeric" })
}

function formatTime(timeStr: string) {
  if (!timeStr) return ""
  return timeStr.slice(0, 5)
}

export default function PlayerHome({ player, wellness, last_match, next_training, objectives, physical_history }: Props) {
  const wellnessStatus = wellness?.status ?? "not_loaded"

  return (
    <PlayerLayout>
      <Head title="Inicio" />

      {/* Header — light top bar with bordo accent */}
      <div className="bg-white border-b border-gray-100 px-4 pb-4 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-bordo-800 flex items-center justify-center font-bold text-yellow-400 text-lg shrink-0">
              {player.first_name?.[0]}{player.last_name?.[0]}
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Bienvenido</p>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">¡Hola, {player.first_name}!</h1>
            </div>
          </div>
          <button className="rounded-full bg-gray-100 p-2 hover:bg-bordo-50 transition-colors">
            <Bell className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Info pills */}
        <div className="mt-4 flex gap-2 flex-wrap">
          {player.category && (
            <div className="rounded-lg border border-bordo-100 bg-bordo-50 px-3 py-1.5">
              <p className="text-xs text-bordo-400">Categoría</p>
              <p className="text-sm font-semibold text-bordo-800">{player.category}</p>
            </div>
          )}
          {player.functional_role && (
            <div className="rounded-lg border border-bordo-100 bg-bordo-50 px-3 py-1.5">
              <p className="text-xs text-bordo-400">Rol</p>
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
      </div>

      <div className="space-y-3 px-4 pt-4 pb-4 bg-gray-50 min-h-full">

        {/* Bienestar Diario */}
        <div className="rounded-2xl bg-white shadow-sm overflow-hidden border border-gray-100">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Bienestar Diario</h2>
            {wellnessStatus === "loaded" && (
              <span className="flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                <CheckCircle className="h-3.5 w-3.5" /> Completado
              </span>
            )}
            {wellnessStatus === "not_loaded" && (
              <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-700">
                <AlertCircle className="h-3.5 w-3.5" /> Pendiente
              </span>
            )}
          </div>
          <div className="p-4">
            {wellnessStatus === "not_loaded" ? (
              <>
                <p className="text-sm text-gray-500 mb-3">¿Cómo llegás al entrenamiento de hoy?</p>
                <Link
                  href="/bienestar"
                  className="block w-full rounded-xl bg-bordo-800 py-3 text-center font-semibold text-white hover:bg-bordo-700 transition-colors"
                >
                  Completar Chequeo ✓
                </Link>
              </>
            ) : (
              <p className="text-sm text-gray-600">Ya cargaste tu bienestar de hoy. ¡Adelante!</p>
            )}
          </div>
        </div>

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
                <span className="text-4xl font-black text-bordo-800">{last_match.points_for}</span>
                <span className="text-xl text-gray-300">–</span>
                <span className="text-4xl font-bold text-gray-400">{last_match.points_against}</span>
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
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
              <TrendingUp className="h-4 w-4 text-bordo-600" />
              <h2 className="font-semibold text-gray-800">Progreso Físico</h2>
            </div>
            <div className="p-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">Peso (kg)</p>
                <div className="flex items-end gap-1 h-14">
                  {physical_history.map((p, i) => {
                    const vals = physical_history.map(h => h.weight_kg ?? 0).filter(Boolean)
                    const min = Math.min(...vals)
                    const max = Math.max(...vals)
                    const range = max - min || 1
                    const height = p.weight_kg ? ((p.weight_kg - min) / range) * 100 : 0
                    return (
                      <div key={i} className="flex-1 flex flex-col justify-end">
                        <div className="rounded-sm bg-bordo-400 transition-all" style={{ height: `${Math.max(10, height)}%` }} />
                      </div>
                    )
                  })}
                </div>
                <p className="mt-1 text-right text-sm font-semibold text-bordo-800">
                  {physical_history[physical_history.length - 1]?.weight_kg ?? "—"} kg
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">Masa Muscular (kg)</p>
                <div className="flex items-end gap-1 h-14">
                  {physical_history.map((p, i) => {
                    const vals = physical_history.map(h => h.muscle_mass_kg ?? 0).filter(Boolean)
                    const min = Math.min(...vals)
                    const max = Math.max(...vals)
                    const range = max - min || 1
                    const height = p.muscle_mass_kg ? ((p.muscle_mass_kg - min) / range) * 100 : 0
                    return (
                      <div key={i} className="flex-1 flex flex-col justify-end">
                        <div className="rounded-sm bg-yellow-400 transition-all" style={{ height: `${Math.max(10, height)}%` }} />
                      </div>
                    )
                  })}
                </div>
                <p className="mt-1 text-right text-sm font-semibold text-yellow-700">
                  {physical_history[physical_history.length - 1]?.muscle_mass_kg ?? "—"} kg
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </PlayerLayout>
  )
}

