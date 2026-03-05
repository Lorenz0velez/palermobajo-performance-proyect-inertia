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
  // Scrums propios (nuestro put-in)
  own_scrums_won: number
  own_scrums_total: number
  // Scrums rival (su put-in) → recuperados = stolen
  opp_scrums_stolen: number
  opp_scrums_total: number
  // Lineouts propios (nuestro lanzamiento)
  own_lineouts_won: number
  own_lineouts_total: number
  // Lineouts rival (su lanzamiento) → recuperados = stolen
  opp_lineouts_stolen: number
  opp_lineouts_total: number
  penalties_for: number
  penalties_against: number
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
        <section className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 pt-4 pb-2">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Estadísticas del equipo</h2>
          </div>

          {/* Header row */}
          <div className="grid grid-cols-3 px-4 py-2 bg-gray-50 border-y border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wide">
            <span className="text-center text-bordo-700">Palermo Bajo</span>
            <span className="text-center"> </span>
            <span className="text-center">{match.opponent}</span>
          </div>

          <div className="divide-y divide-gray-50">
            <TeamStatRow label="Puntos" us={match.points_for}  them={match.points_against} />
            <TeamStatRow label="Tries"  us={match.tries_for}   them={match.tries_against}  />
            <TeamStatRow label="Penales" us={match.penalties_for} them={match.penalties_against} flipLower />
          </div>
        </section>

        {/* Scrums */}
        <SetPieceSection
          title="Scrums"
          ownWon={match.own_scrums_won}
          ownTotal={match.own_scrums_total}
          oppStolen={match.opp_scrums_stolen}
          oppTotal={match.opp_scrums_total}
          opponent={match.opponent}
        />

        {/* Lineouts */}
        <SetPieceSection
          title="Lineouts"
          ownWon={match.own_lineouts_won}
          ownTotal={match.own_lineouts_total}
          oppStolen={match.opp_lineouts_stolen}
          oppTotal={match.opp_lineouts_total}
          opponent={match.opponent}
        />

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

function TeamStatRow({
  label, us, them, flipLower = false
}: {
  label: string; us: number; them: number; flipLower?: boolean
}) {
  // flipLower: lower is better (e.g. penalties against us)
  const usWins   = flipLower ? us <= them : us >= them
  const themWins = flipLower ? them < us  : them > us

  return (
    <div className="grid grid-cols-3 px-4 py-3 items-center">
      <p className={`text-center text-lg font-bold ${
        usWins ? "text-bordo-800" : "text-gray-400"
      }`}>{us}</p>
      <p className="text-center text-xs text-gray-400 font-medium">{label}</p>
      <p className={`text-center text-lg font-bold ${
        themWins ? "text-red-500" : "text-gray-400"
      }`}>{them}</p>
    </div>
  )
}

function SetPieceSection({
  title, ownWon, ownTotal, oppStolen, oppTotal, opponent
}: {
  title: string
  ownWon: number; ownTotal: number
  oppStolen: number; oppTotal: number
  opponent: string
}) {
  const ownLost    = ownTotal - ownWon
  const oppWon     = oppTotal - oppStolen   // rival retuvo en su lanzamiento
  const ownPct     = ownTotal   > 0 ? Math.round((ownWon    / ownTotal)   * 100) : 0
  const oppStolPct = oppTotal   > 0 ? Math.round((oppStolen / oppTotal)   * 100) : 0

  return (
    <section className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{title}</h2>
      </div>

      <div className="divide-y divide-gray-50">
        {/* Propios */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Propios (nuestro put-in)</span>
            <span className="text-xs text-gray-400">{ownTotal} lanzados</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-100 rounded-full h-2">
              <div
                className="bg-bordo-600 h-2 rounded-full"
                style={{ width: `${ownPct}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-bordo-800 w-16 text-right">
              {ownWon}<span className="text-gray-400 font-normal"> gan · </span>{ownLost}<span className="text-gray-400 font-normal"> perd</span>
            </span>
          </div>
        </div>

        {/* Rival */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Rival ({opponent}) put-in</span>
            <span className="text-xs text-gray-400">{oppTotal} lanzados</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-100 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${oppStolPct}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-green-700 w-16 text-right">
              {oppStolen}<span className="text-gray-400 font-normal"> recup · </span>{oppWon}<span className="text-gray-400 font-normal"> de ellos</span>
            </span>
          </div>
        </div>
      </div>
    </section>
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
