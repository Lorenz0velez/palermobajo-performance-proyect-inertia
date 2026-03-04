import { Head, Link } from "@inertiajs/react"
import { ChevronRight, Home, MapPin, Upload } from "lucide-react"
import CoachLayout from "@/layouts/coach/coach-layout"

interface Match {
  id: number; label: string; opponent: string; home: boolean
  points_for: number; points_against: number; date: string; result: string
}
interface PlayerRow {
  id: number; name: string; functional_role: string; matches: number
  tries: number; tackles: number; lineouts_won: number; lineouts_total: number; minutes: number
}
interface Team {
  matches_played: number; wins: number; losses: number
  points_for: number; points_against: number; tries_for: number; tries_against: number
}
interface Props { team: Team; matches: Match[]; players: PlayerRow[] }

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("es-AR", { day: "numeric", month: "short" })
}

export default function CoachStatsIndex({ team, matches, players }: Props) {
  return (
    <CoachLayout>
      <Head title="Estadísticas" />

      <div className="bg-white border-b border-gray-100 px-4 pb-4 pt-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Estadísticas</h1>
            <p className="text-sm text-gray-400">Temporada 2026 · Plantel Superior</p>
          </div>
          <button className="flex items-center gap-1.5 rounded-xl border border-bordo-200 px-3 py-2 text-xs font-semibold text-bordo-700 hover:bg-bordo-50">
            <Upload className="h-4 w-4" /> CSV
          </button>
        </div>
      </div>

      <div className="px-4 pt-4 pb-6 space-y-5">

        {/* Team summary */}
        <section>
          <h2 className="text-xs font-bold text-bordo-700 uppercase tracking-widest mb-2">Resumen del Equipo</h2>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Jugados",  value: team.matches_played, color: "bg-white"          },
              { label: "Victorias",value: team.wins,           color: "bg-green-50"       },
              { label: "PF",       value: team.points_for,     color: "bg-white"          },
              { label: "PC",       value: team.points_against, color: "bg-white"          },
            ].map(s => (
              <div key={s.label} className={`rounded-xl border border-gray-100 shadow-sm p-3 text-center ${s.color}`}>
                <p className="text-2xl font-bold text-bordo-800">{s.value}</p>
                <p className="text-xs text-gray-400 font-medium mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-gray-100 shadow-sm bg-white p-3 text-center">
              <p className="text-2xl font-bold text-green-700">{team.tries_for}</p>
              <p className="text-xs text-gray-400 font-medium mt-0.5">Tries a favor</p>
            </div>
            <div className="rounded-xl border border-gray-100 shadow-sm bg-white p-3 text-center">
              <p className="text-2xl font-bold text-red-500">{team.tries_against}</p>
              <p className="text-xs text-gray-400 font-medium mt-0.5">Tries en contra</p>
            </div>
          </div>
        </section>

        {/* Partidos */}
        <section>
          <h2 className="text-xs font-bold text-bordo-700 uppercase tracking-widest mb-2">Partidos</h2>
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm divide-y divide-gray-50 overflow-hidden">
            {matches.map(m => (
              <Link key={m.id} href={`/coach/stats/matches/${m.id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold
                      ${m.result === "win" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {m.result === "win" ? "Victoria" : "Derrota"}
                    </span>
                    {m.home
                      ? <span className="flex items-center gap-0.5 text-xs text-gray-400"><Home className="h-3 w-3" /> Local</span>
                      : <span className="flex items-center gap-0.5 text-xs text-gray-400"><MapPin className="h-3 w-3" /> Visit.</span>}
                  </div>
                  <p className="font-semibold text-gray-900 text-sm mt-0.5">vs. {m.opponent}</p>
                  <p className="text-xs text-gray-400">{m.label} · {fmtDate(m.date)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xl font-bold text-bordo-800">{m.points_for}<span className="text-gray-400 font-normal text-sm">-{m.points_against}</span></p>
                  <ChevronRight className="h-4 w-4 text-gray-300" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Jugadores */}
        <section>
          <h2 className="text-xs font-bold text-bordo-700 uppercase tracking-widest mb-2">Jugadores</h2>
          {/* Header row */}
          <div className="flex items-center px-3 py-1 text-xs text-gray-400 font-semibold">
            <span className="flex-1">Jugador</span>
            <span className="w-8 text-center">T</span>
            <span className="w-8 text-center">Tk</span>
            <span className="w-10 text-center">Min</span>
            <span className="w-5" />
          </div>
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm divide-y divide-gray-50 overflow-hidden">
            {players.map(p => (
              <Link key={p.id} href={`/coach/stats/${p.id}`}
                className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.functional_role}</p>
                </div>
                <span className="w-8 text-center font-bold text-bordo-800 text-sm">{p.tries}</span>
                <span className="w-8 text-center text-gray-600 text-sm">{p.tackles}</span>
                <span className="w-10 text-center text-gray-400 text-xs">{p.minutes}'</span>
                <ChevronRight className="w-5 h-4 text-gray-300" />
              </Link>
            ))}
          </div>
        </section>

      </div>
    </CoachLayout>
  )
}
