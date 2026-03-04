import { Head, Link } from "@inertiajs/react"
import { ArrowLeft, Home, MapPin, ShieldCheck } from "lucide-react"
import CoachLayout from "@/layouts/coach/coach-layout"

interface Match {
  id: number
  label: string
  opponent: string
  home: boolean
  points_for: number
  points_against: number
  tries_for: number
  tries_against: number
  date: string
  result: string
}

interface PlayerRow {
  player_id: number
  name: string
  functional_role: string
  minutes: number
  starter: boolean
  tries: number
  tackles: number
  lineouts_won: number | null
  lineouts_total: number | null
  meters: number
}

interface Props {
  match: Match
  players: PlayerRow[]
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("es-AR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  })
}

export default function CoachStatsMatch({ match, players }: Props) {
  const forwards = players.filter(p => p.functional_role === "Forward")
  const backs    = players.filter(p => p.functional_role === "Back")

  const resultLabel = match.result === "win" ? "Victoria" : "Derrota"
  const resultColor = match.result === "win"
    ? "bg-green-100 text-green-700"
    : "bg-red-100 text-red-700"

  return (
    <CoachLayout>
      <Head title={`${match.label} · vs. ${match.opponent}`} />

      {/* Hero */}
      <div className="bg-bordo-800 px-4 pt-12 pb-8 relative">
        <Link
          href="/coach/stats"
          className="absolute top-10 left-4 text-white/70 hover:text-white flex items-center gap-1 text-sm"
        >
          <ArrowLeft className="h-4 w-4" /> Estadísticas
        </Link>

        <div className="flex flex-col items-center text-center mt-4">
          {/* Result badge */}
          <span className={`rounded-full px-3 py-1 text-xs font-semibold mb-2 ${resultColor}`}>
            {resultLabel}
          </span>

          {/* Score */}
          <div className="flex items-center gap-3">
            <div className="text-center">
              <p className="text-3xl font-black text-white">{match.points_for}</p>
              <p className="text-xs text-white/60 mt-0.5">Palermo Bajo</p>
            </div>
            <p className="text-white/40 text-2xl font-light">–</p>
            <div className="text-center">
              <p className="text-3xl font-black text-white">{match.points_against}</p>
              <p className="text-xs text-white/60 mt-0.5">{match.opponent}</p>
            </div>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-3 mt-3">
            <span className="text-white/70 text-sm">{match.label}</span>
            <span className="text-white/30">·</span>
            {match.home
              ? <span className="flex items-center gap-1 text-white/70 text-sm"><Home className="h-3.5 w-3.5" /> Local</span>
              : <span className="flex items-center gap-1 text-white/70 text-sm"><MapPin className="h-3.5 w-3.5" /> Visitante</span>}
          </div>
          <p className="text-white/50 text-xs mt-1 capitalize">{fmtDate(match.date)}</p>
        </div>
      </div>

      <div className="px-4 pt-4 pb-8 space-y-5">

        {/* Team summary */}
        <section className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Resumen del equipo</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-bordo-50 p-3 text-center">
              <p className="text-2xl font-bold text-bordo-800">{match.points_for}</p>
              <p className="text-xs text-gray-500 mt-0.5">Puntos</p>
            </div>
            <div className="rounded-xl bg-bordo-50 p-3 text-center">
              <p className="text-2xl font-bold text-bordo-800">{match.tries_for}</p>
              <p className="text-xs text-gray-500 mt-0.5">Tries</p>
            </div>
          </div>
        </section>

        {/* Forwards */}
        {forwards.length > 0 && (
          <PlayerGroup title="Forwards" players={forwards} />
        )}

        {/* Backs */}
        {backs.length > 0 && (
          <PlayerGroup title="Backs" players={backs} />
        )}

      </div>
    </CoachLayout>
  )
}

function PlayerGroup({ title, players }: { title: string; players: PlayerRow[] }) {
  return (
    <section>
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">{title}</h2>
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm divide-y divide-gray-50 overflow-hidden">
        {players.map(p => (
          <div key={p.player_id} className="px-4 py-3">
            {/* Player header */}
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="font-semibold text-gray-900 text-sm">{p.name}</p>
                  {p.starter && (
                    <span className="flex items-center gap-0.5 rounded-full bg-bordo-100 px-1.5 py-0.5 text-xs font-medium text-bordo-700">
                      <ShieldCheck className="h-3 w-3" /> Titular
                    </span>
                  )}
                </div>
              </div>
              <span className="text-xs text-gray-400">{p.minutes}'</span>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <span><span className="font-semibold text-gray-800">{p.tries}</span> tries</span>
              <span><span className="font-semibold text-gray-800">{p.tackles}</span> tackles</span>
              {p.lineouts_total !== null && p.lineouts_total > 0 && (
                <span><span className="font-semibold text-gray-800">{p.lineouts_won}/{p.lineouts_total}</span> lineouts</span>
              )}
              <span><span className="font-semibold text-gray-800">{p.meters}</span> m</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
