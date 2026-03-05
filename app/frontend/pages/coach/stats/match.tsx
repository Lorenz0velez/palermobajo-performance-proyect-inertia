import { Head, Link } from "@inertiajs/react"
import { ArrowLeft, Home, MapPin, ShieldCheck } from "lucide-react"
import CoachLayout from "@/layouts/coach/coach-layout"

interface Match {
  id: number
  label: string
  category?: string
  opponent: string
  home: boolean
  points_for: number
  points_against: number
  tries_for: number
  tries_against: number
  own_scrums_won: number
  own_scrums_total: number
  opp_scrums_stolen: number
  opp_scrums_total: number
  own_lineouts_won: number
  own_lineouts_total: number
  opp_lineouts_stolen: number
  opp_lineouts_total: number
  penalties_for: number
  penalties_against: number
  date: string
  result: string
}

interface PlayerRow {
  id: number
  name: string
  role: string
  minutes: number
  starter: boolean
  tries: number
  tackles: number
  tackles_missed: number
  carries: number
  meters: number | null
  rucks: number
  turnovers: number
}

interface Props {
  match: Match
  players: PlayerRow[]
}

const FORWARD_ROLES = new Set([
  "Pilar Izquierdo", "Pilar Derecho", "Hooker",
  "Segunda Línea", "Flanker", "Número 8"
])

function fmtDate(d: string) {
  return new Date(d + "T12:00:00").toLocaleDateString("es-AR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  })
}

// ── Team stat card ─────────────────────────────────────────────────────────
function StatCard({ label, value, highlight = false }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-3 text-center">
      <p className={`text-xl font-bold ${highlight ? "text-bordo-800" : "text-gray-700"}`}>{value}</p>
      <p className="text-xs text-gray-400 mt-0.5 leading-tight">{label}</p>
    </div>
  )
}

// ── Player card ────────────────────────────────────────────────────────────
function PlayerCard({ p }: { p: PlayerRow }) {
  return (
    <Link href={`/coach/squad/${p.id}`} className="block px-4 py-3 hover:bg-gray-50 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <p className="font-semibold text-gray-900 text-sm">{p.name}</p>
          {p.starter && (
            <span className="flex items-center gap-0.5 rounded-full bg-bordo-100 px-1.5 py-0.5 text-xs font-medium text-bordo-700">
              <ShieldCheck className="h-3 w-3" /> Titular
            </span>
          )}
          {!p.starter && (
            <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-500">Suplente</span>
          )}
        </div>
        <span className="text-xs font-semibold text-gray-500">{p.minutes}'</span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-1.5 text-center">
        {[
          { label: "Tries",      value: p.tries },
          { label: "Tackles",    value: p.tackles },
          { label: "T. Errados", value: p.tackles_missed },
          { label: "Portac.",    value: p.carries },
          { label: "Metros",     value: p.meters != null ? `${p.meters}m` : "—" },
          { label: "Rucks",      value: p.rucks },
          { label: "Pérdidas",   value: p.turnovers },
        ].map((s) => (
          <div key={s.label} className="rounded-lg bg-gray-50 py-1.5 px-1">
            <p className="text-sm font-bold text-gray-800">{s.value}</p>
            <p className="text-xs text-gray-400 leading-tight">{s.label}</p>
          </div>
        ))}
      </div>
    </Link>
  )
}

function PlayerGroup({ title, players }: { title: string; players: PlayerRow[] }) {
  if (players.length === 0) return null
  return (
    <section>
      <h2 className="text-xs font-bold text-bordo-700 uppercase tracking-widest mb-2">{title}</h2>
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm divide-y divide-gray-50 overflow-hidden">
        {players.map((p) => <PlayerCard key={p.id} p={p} />)}
      </div>
    </section>
  )
}

export default function CoachStatsMatch({ match, players }: Props) {
  const forwards = players.filter((p) => FORWARD_ROLES.has(p.role))
  const backs    = players.filter((p) => !FORWARD_ROLES.has(p.role))

  const resultLabel = match.result === "win" ? "Victoria" : "Derrota"
  const resultColor = match.result === "win" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"

  return (
    <CoachLayout>
      <Head title={`${match.label} · vs. ${match.opponent}`} />

      {/* Hero */}
      <div className="bg-bordo-800 px-4 pt-12 pb-8 relative">
        <Link href="/coach/stats" className="absolute top-10 left-4 text-white/70 hover:text-white flex items-center gap-1 text-sm">
          <ArrowLeft className="h-4 w-4" /> Estadísticas
        </Link>

        <div className="flex flex-col items-center text-center mt-4">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold mb-2 ${resultColor}`}>
            {resultLabel}
          </span>

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

          <div className="flex items-center gap-3 mt-3">
            {match.category && <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-semibold text-white">{match.category}</span>}
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

        {/* Team stats — compact 4×2 grid */}
        <section>
          <h2 className="text-xs font-bold text-bordo-700 uppercase tracking-widest mb-2">Estadísticas del equipo</h2>
          <div className="grid grid-cols-2 gap-2">
            <StatCard label="Try Favor"     value={match.tries_for}          highlight />
            <StatCard label="Try Contra"    value={match.tries_against} />
            <StatCard label="Penal Favor"   value={match.penalties_for}      highlight />
            <StatCard label="Penal Contra"  value={match.penalties_against} />
            <StatCard
              label="Line P (G/T)"
              value={`${match.own_lineouts_won}/${match.own_lineouts_total}`}
              highlight
            />
            <StatCard
              label="Line R (Rec./T)"
              value={`${match.opp_lineouts_stolen}/${match.opp_lineouts_total}`}
              highlight={match.opp_lineouts_stolen > 0}
            />
            <StatCard
              label="Scrum P (G/T)"
              value={`${match.own_scrums_won}/${match.own_scrums_total}`}
              highlight
            />
            <StatCard
              label="Scrum R (Rec./T)"
              value={`${match.opp_scrums_stolen}/${match.opp_scrums_total}`}
              highlight={match.opp_scrums_stolen > 0}
            />
          </div>
        </section>

        {/* Players */}
        <PlayerGroup title="Forwards" players={forwards} />
        <PlayerGroup title="Backs"    players={backs} />

      </div>
    </CoachLayout>
  )
}
