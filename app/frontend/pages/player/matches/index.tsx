import { Head, Link } from "@inertiajs/react"
import { ChevronRight, Home, MapPin } from "lucide-react"
import PlayerLayout from "@/layouts/player/player-layout"

interface Match {
  id: string
  opponent: string
  home: boolean
  points_for: number
  points_against: number
  date: string
  team_name: string | null
  kickoff_time: string | null
  minutes_played: number
  starter: boolean
  position: string | null
}

interface Props {
  matches: Match[]
}

function ResultBadge({ pf, pa }: { pf: number; pa: number }) {
  if (pf > pa) return <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">Victoria</span>
  if (pf < pa) return <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">Derrota</span>
  return <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">Empate</span>
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" })
}

export default function PlayerMatchesIndex({ matches }: Props) {
  return (
    <PlayerLayout>
      <Head title="Mis Partidos" />

      <div className="bg-white border-b border-gray-100 px-4 pb-4 pt-8">
        <h1 className="text-2xl font-bold text-gray-900">Mis Partidos</h1>
        <p className="text-sm text-gray-400">{matches.length} partidos jugados</p>
      </div>

      <div className="px-4 pt-4 pb-4 bg-gray-50 min-h-full space-y-3">
        {matches.length === 0 && (
          <div className="rounded-2xl bg-white p-8 text-center text-gray-400 shadow-sm border border-gray-100">
            Todavía no jugaste ningún partido registrado.
          </div>
        )}
        {matches.map((match) => (
          <Link
            key={match.id}
            href={`/player/matches/${match.id}`}
            className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <ResultBadge pf={match.points_for} pa={match.points_against} />
                {match.home
                  ? <span className="flex items-center gap-1 text-xs text-gray-400"><Home className="h-3 w-3" /> Local</span>
                  : <span className="flex items-center gap-1 text-xs text-gray-400"><MapPin className="h-3 w-3" /> Visitante</span>
                }
                {match.starter && <span className="rounded-full bg-bordo-100 px-2 py-0.5 text-xs font-medium text-bordo-700">Titular</span>}
                {match.team_name && <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-700">{match.team_name}</span>}
              </div>
              <p className="font-bold text-gray-900">Vs. {match.opponent}</p>
              <p className="text-sm text-gray-500">{formatDate(match.date)} · {match.minutes_played != null ? `${match.minutes_played} min` : ""}{match.position ? ` · ${match.position}` : ""}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-2xl font-bold text-bordo-800">{match.points_for}</p>
                <p className="text-sm text-gray-400">{match.points_against}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-300" />
            </div>
          </Link>
        ))}
      </div>
    </PlayerLayout>
  )
}
