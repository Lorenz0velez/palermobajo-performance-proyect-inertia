import { Head, Link } from "@inertiajs/react"
import { ArrowLeft, Clock, Play, Shield, Users } from "lucide-react"
import PlayerLayout from "@/layouts/player/player-layout"
import { cn } from "@/lib/utils"

interface Stat {
  name: string
  unit: string | null
  value: number
}

interface Match {
  id: string
  opponent: string
  home: boolean
  points_for: number | null
  points_against: number | null
  date: string
  video_link: string | null
  team_name: string | null
  kickoff_time: string | null
  minutes_played: number | null
  starter: boolean
  position: string | null
  stats: Stat[]
  team_stats: Stat[]
}

interface Props {
  match: Match
}

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number)
  return new Date(y, m - 1, d).toLocaleDateString("es-AR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  })
}

function getStat(stats: Stat[], name: string): number | null {
  const found = stats.find(s => s.name === name)
  return found !== undefined ? Number(found.value) : null
}

function StatRow({ label, value, unit, highlight }: { label: string; value: number | null; unit?: string | null; highlight?: boolean }) {
  if (value === null) return null
  return (
    <div className={cn(
      "flex items-center justify-between py-2.5 px-4 border-b last:border-0 border-gray-50",
      highlight && "bg-bordo-50/40"
    )}>
      <span className="text-sm text-gray-600">{label}</span>
      <span className={cn("font-bold text-gray-900", highlight && "text-bordo-700")}>
        {value}{unit && <span className="text-xs text-gray-400 font-normal ml-1">{unit}</span>}
      </span>
    </div>
  )
}

function DualStatCard({ label, won, total, isRival }: { label: string; won: number | null; total: number | null; isRival?: boolean }) {
  if (won === null && total === null) return null
  const pct = won !== null && total && total > 0 ? Math.round((won / total) * 100) : null
  return (
    <div className={cn(
      "rounded-xl border p-3 space-y-1",
      isRival ? "border-gray-200 bg-gray-50" : "border-bordo-100 bg-bordo-50/50"
    )}>
      <div className="flex items-center justify-between">
        <span className={cn("text-xs font-semibold uppercase tracking-wide", isRival ? "text-gray-500" : "text-bordo-700")}>
          {label}
        </span>
        {pct !== null && (
          <span className={cn("text-xs font-bold rounded-full px-2 py-0.5", isRival ? "bg-gray-200 text-gray-600" : "bg-bordo-100 text-bordo-700")}>
            {pct}%
          </span>
        )}
      </div>
      <div className="flex items-end gap-1">
        <span className={cn("text-2xl font-black", isRival ? "text-gray-700" : "text-bordo-800")}>{won ?? "—"}</span>
        {total !== null && <span className="text-sm text-gray-400 mb-0.5">/ {total}</span>}
      </div>
    </div>
  )
}

export default function PlayerMatchShow({ match }: Props) {
  const hasResult = match.points_for !== null && match.points_against !== null
  const won = hasResult && match.points_for! > match.points_against!
  const draw = hasResult && match.points_for === match.points_against

  const heroBg = !hasResult ? "from-gray-700 to-gray-800" : won ? "from-green-700 to-green-800" : draw ? "from-gray-600 to-gray-700" : "from-bordo-800 to-bordo-900"

  const tries       = getStat(match.stats, "Tries")
  const tacklesOk   = getStat(match.stats, "Tackles realizados")
  const tacklesMiss = getStat(match.stats, "Tackles perdidos")
  const metros      = getStat(match.stats, "Metros ganados")
  const portaciones = getStat(match.stats, "Portaciones")
  const rucks       = getStat(match.stats, "Rucks ganados")

  const scrumPropioW  = getStat(match.team_stats, "Scrums propios ganados")
  const scrumPropioT  = getStat(match.team_stats, "Scrums propios totales")
  const scrumRivalW   = getStat(match.team_stats, "Scrums rival ganados")
  const scrumRivalT   = getStat(match.team_stats, "Scrums rival totales")
  const lineoutPropioW = getStat(match.team_stats, "Lineouts propios ganados")
  const lineoutPropioT = getStat(match.team_stats, "Lineouts propios totales")
  const lineoutRivalW  = getStat(match.team_stats, "Lineouts rival ganados")
  const lineoutRivalT  = getStat(match.team_stats, "Lineouts rival totales")

  const hasTeamStats = match.team_stats.length > 0

  return (
    <PlayerLayout>
      <Head title={`Vs. ${match.opponent}`} />

      {/* Hero */}
      <div className={cn("bg-linear-to-br text-white px-4 pb-5 pt-8", heroBg)}>
        <Link href="/player/matches" className="flex items-center gap-1 text-white/70 hover:text-white mb-4 text-sm">
          <ArrowLeft className="h-4 w-4" /> Todos los partidos
        </Link>
        <p className="text-xs text-white/60 uppercase tracking-wide">{match.home ? "Local" : "Visitante"} · {formatDate(match.date)}</p>
        <h1 className="text-2xl font-bold mt-1">Vs. {match.opponent}</h1>
        {match.team_name && <p className="text-sm text-white/60 mt-0.5">{match.team_name}</p>}

        {hasResult && (
          <div className="mt-4 flex items-center gap-4">
            <div className="text-center">
              <p className="text-5xl font-black">{match.points_for}</p>
              <p className="text-xs text-white/50 mt-1">Nuestros</p>
            </div>
            <div className="text-white/30 text-2xl font-light">—</div>
            <div className="text-center">
              <p className="text-5xl font-bold text-white/70">{match.points_against}</p>
              <p className="text-xs text-white/50 mt-1">Rival</p>
            </div>
            <div className="ml-auto">
              <span className="rounded-full px-4 py-1.5 font-semibold text-sm bg-white/20 backdrop-blur-sm">
                {won ? "Victoria" : draw ? "Empate" : "Derrota"}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 pt-4 pb-20 bg-gray-50 min-h-full space-y-4">

        {/* Estadísticas del equipo — PRIMERO */}
        {hasTeamStats && (
          <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <Users className="h-4 w-4 text-bordo-600" />
              <h2 className="font-semibold text-gray-800">Estadísticas del equipo</h2>
            </div>

            <div className="p-4 space-y-4">
              {/* Lineouts */}
              {(lineoutPropioW !== null || lineoutRivalW !== null) && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Lineouts</p>
                  <div className="grid grid-cols-2 gap-2">
                    <DualStatCard label="Propios" won={lineoutPropioW} total={lineoutPropioT} />
                    <DualStatCard label="Rival" won={lineoutRivalW} total={lineoutRivalT} isRival />
                  </div>
                </div>
              )}

              {/* Scrums */}
              {(scrumPropioW !== null || scrumRivalW !== null) && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Scrums</p>
                  <div className="grid grid-cols-2 gap-2">
                    <DualStatCard label="Propios" won={scrumPropioW} total={scrumPropioT} />
                    <DualStatCard label="Rival" won={scrumRivalW} total={scrumRivalT} isRival />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tu actuación — SEGUNDO */}
        <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <Shield className="h-4 w-4 text-bordo-600" />
            <h2 className="font-semibold text-gray-800">Tu actuación</h2>
          </div>

          {/* Tiempo / Rol / Posición */}
          <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
            <div className="p-3 text-center">
              <Clock className="h-4 w-4 text-bordo-500 mx-auto mb-1" />
              <p className="text-xl font-bold text-bordo-800">{match.minutes_played !== null ? `${match.minutes_played}'` : "—"}</p>
              <p className="text-xs text-gray-400">Tiempo</p>
            </div>
            <div className="p-3 text-center">
              <p className="text-xl font-bold text-gray-700">{match.starter ? "✓" : "S"}</p>
              <p className="text-xs text-gray-400">{match.starter ? "Titular" : "Suplente"}</p>
            </div>
            <div className="p-3 text-center">
              <p className="text-sm font-bold text-gray-700 leading-tight mt-1">{match.position ?? "—"}</p>
              <p className="text-xs text-gray-400">Posición</p>
            </div>
          </div>

          {/* Stats individuales (sin lineouts — son del equipo) */}
          <StatRow label="Tries" value={tries} />
          <StatRow label="Tackles realizados" value={tacklesOk} highlight />
          <StatRow label="Tackles perdidos" value={tacklesMiss} />
          <StatRow label="Metros ganados" value={metros} unit="m" highlight />
          <StatRow label="Portaciones" value={portaciones} />
          <StatRow label="Rucks ganados" value={rucks} highlight />
        </div>

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
