import { Head, Link } from "@inertiajs/react"
import { ArrowLeft, Clock, Play } from "lucide-react"
import PlayerLayout from "@/layouts/player/player-layout"

interface Stat {
  name: string
  unit: string
  value: number
}

interface Match {
  id: string
  opponent: string
  home: boolean
  points_for: number
  points_against: number
  date: string
  video_link: string | null
  minutes_played: number
  starter: boolean
  position: string | null
  stats: Stat[]
}

interface Props {
  match: Match
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
}

export default function PlayerMatchShow({ match }: Props) {
  const won = match.points_for > match.points_against

  return (
    <PlayerLayout>
      <Head title={`Vs. ${match.opponent}`} />

      <div className="bg-white border-b border-gray-100 px-4 pb-4 pt-8">
        <Link href="/player/matches" className="flex items-center gap-1 text-bordo-600 hover:text-bordo-800 mb-4 text-sm">
          <ArrowLeft className="h-4 w-4" /> Todos los partidos
        </Link>
        <p className="text-xs text-gray-400 uppercase tracking-wide">{match.home ? "Local" : "Visitante"} · {formatDate(match.date)}</p>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">Vs. {match.opponent}</h1>

        <div className="mt-4 flex items-center gap-4">
          <div className="text-center">
            <p className="text-5xl font-black text-bordo-800">{match.points_for}</p>
            <p className="text-xs text-gray-400 mt-1">Nuestros</p>
          </div>
          <div className="text-gray-300 text-2xl font-light">—</div>
          <div className="text-center">
            <p className="text-5xl font-bold text-gray-400">{match.points_against}</p>
            <p className="text-xs text-gray-400 mt-1">Rival</p>
          </div>
          <div className="ml-auto">
            <span className={`rounded-full px-4 py-1.5 font-semibold text-sm ${won ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {won ? "Victoria" : "Derrota"}
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 pb-4 bg-gray-50 min-h-full space-y-3">
        {/* Player summary */}
        <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-4">
          <h2 className="font-semibold text-gray-800 mb-3">Tu actuación</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-bordo-50 border border-bordo-100 p-3 text-center">
              <Clock className="h-5 w-5 text-bordo-600 mx-auto mb-1" />
              <p className="text-2xl font-bold text-bordo-800">{match.minutes_played}'</p>
              <p className="text-xs text-gray-500">Minutos jugados</p>
            </div>
            <div className="rounded-xl bg-gray-50 border border-gray-100 p-3 text-center">
              <p className="text-sm font-medium text-gray-500">{match.starter ? "Titular" : "Suplente"}</p>
              {match.position && <p className="text-sm font-semibold text-gray-800 mt-1">{match.position}</p>}
            </div>
          </div>
        </div>

        {/* Stats */}
        {match.stats.length > 0 && (
          <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Estadísticas</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {match.stats.map((stat) => (
                <div key={stat.name} className="flex items-center justify-between px-4 py-3">
                  <span className="text-gray-600">{stat.name}</span>
                  <span className="font-bold text-gray-900">
                    {stat.value} {stat.unit && <span className="text-xs text-gray-400 font-normal">{stat.unit}</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Video */}
        {match.video_link && (
          <a
            href={match.video_link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-2xl bg-bordo-800 py-4 font-semibold text-white hover:bg-bordo-700 transition-colors"
          >
            <Play className="h-5 w-5" /> Ver video del partido
          </a>
        )}
      </div>
    </PlayerLayout>
  )
}
