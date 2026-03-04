import { Head, Link } from "@inertiajs/react"
import { ArrowLeft, Home, MapPin } from "lucide-react"
import CoachLayout from "@/layouts/coach/coach-layout"

interface Match {
  id: number; label: string; opponent: string; home: boolean
  points_for: number; points_against: number; date: string; result: string
}
interface MatchBreakdown {
  match_id: number; opponent: string; date: string; result: string; home: boolean
  minutes: number | null; starter: boolean; tries: number | null
  tackles: number | null; lineouts_won: number | null; lineouts_total: number | null
  meters: number | null; absent?: boolean
}
interface Player {
  id: number; name: string; functional_role: string; matches: number
  tries: number; tackles: number; lineouts_won: number; lineouts_total: number; minutes: number
}
interface Props { player: Player; matches: Match[]; breakdown: MatchBreakdown[] }

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-3 text-center shadow-sm">
      <p className="text-xl font-bold text-bordo-800">{value}</p>
      <p className="text-xs text-gray-400 mt-0.5 leading-tight">{label}</p>
    </div>
  )
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("es-AR", { day: "numeric", month: "short" })
}

export default function CoachStatsShow({ player, matches, breakdown }: Props) {
  const initials = player.name.split(" ").map(n => n[0]).slice(0, 2).join("")

  return (
    <CoachLayout>
      <Head title={`Estadísticas · ${player.name}`} />

      {/* Hero */}
      <div className="bg-bordo-800 px-4 pt-12 pb-8 relative">
        <Link href="/coach/stats" className="absolute top-10 left-4 text-white/70 hover:text-white flex items-center gap-1 text-sm">
          <ArrowLeft className="h-4 w-4" /> Estadísticas
        </Link>
        <div className="flex flex-col items-center text-center mt-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400 text-bordo-900 text-xl font-bold shadow-lg">
            {initials}
          </div>
          <h1 className="mt-3 text-lg font-bold text-white">{player.name}</h1>
          <span className="mt-1 rounded-full bg-white/15 px-3 py-1 text-sm font-medium text-white">{player.functional_role}</span>
        </div>
      </div>

      <div className="px-4 pt-4 pb-8 space-y-5">

        {/* Season totals */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Totales Temporada 2026</h2>
          <div className="grid grid-cols-3 gap-2">
            <StatCard label="Partidos"  value={player.matches}  />
            <StatCard label="Tries"     value={player.tries}    />
            <StatCard label="Tackles"   value={player.tackles}  />
            <StatCard label="Minutos"   value={`${player.minutes}'`} />
            {player.lineouts_total > 0 && (
              <StatCard label="Lineouts" value={`${player.lineouts_won}/${player.lineouts_total}`} />
            )}
            {player.matches > 0 && (
              <StatCard label="Prom. min" value={Math.round(player.minutes / player.matches)} />
            )}
          </div>
        </section>

        {/* Per-match breakdown */}
        {breakdown.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Desglose por Partido</h2>
            <div className="space-y-2">
              {breakdown.map((b) => (
                <Link key={b.match_id} href={`/coach/stats/matches/${b.match_id}`}
                  className="block rounded-2xl bg-white border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
                  {/* Match header */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold
                          ${b.result === "win" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {b.result === "win" ? "V" : "D"}
                        </span>
                        {b.home
                          ? <span className="flex items-center gap-0.5 text-xs text-gray-400"><Home className="h-3 w-3" /> Local</span>
                          : <span className="flex items-center gap-0.5 text-xs text-gray-400"><MapPin className="h-3 w-3" /> Visit.</span>}
                        {b.starter && !b.absent && <span className="rounded-full bg-bordo-100 px-1.5 py-0.5 text-xs font-semibold text-bordo-700">Titular</span>}
                        {!b.starter && !b.absent && <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-xs font-semibold text-gray-500">Suplente</span>}
                      </div>
                      <p className="font-bold text-gray-900 text-sm">vs. {b.opponent}</p>
                      <p className="text-xs text-gray-400">{fmtDate(b.date)}</p>
                    </div>
                    {b.absent
                      ? <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-600">Ausente</span>
                      : <span className="text-sm font-bold text-gray-700">{b.minutes}'</span>}
                  </div>

                  {/* Stats row */}
                  {!b.absent && (
                    <div className="grid grid-cols-4 gap-2 border-t border-gray-50 pt-3">
                      <div className="text-center">
                        <p className="text-lg font-bold text-bordo-800">{b.tries ?? "—"}</p>
                        <p className="text-xs text-gray-400">Tries</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-bordo-800">{b.tackles ?? "—"}</p>
                        <p className="text-xs text-gray-400">Tackles</p>
                      </div>
                      {(b.lineouts_total ?? 0) > 0 ? (
                        <div className="text-center">
                          <p className="text-lg font-bold text-bordo-800">{b.lineouts_won}/{b.lineouts_total}</p>
                          <p className="text-xs text-gray-400">Lineouts</p>
                        </div>
                      ) : <div />}
                      {b.meters != null ? (
                        <div className="text-center">
                          <p className="text-lg font-bold text-bordo-800">{b.meters}</p>
                          <p className="text-xs text-gray-400">Metros</p>
                        </div>
                      ) : <div />}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </CoachLayout>
  )
}

