import { Head, Link } from "@inertiajs/react"
import { Plus, ChevronRight, CalendarDays, Users } from "lucide-react"
import CoachLayout from "@/layouts/coach/coach-layout"

interface Match {
  id: number
  date: string
  date_display: string
  weekday: string
  opponent: string
  home: boolean
  team_name: string | null
  kickoff_time: string | null
  points_for: number | null
  points_against: number | null
  result: string | null
  squad_count: number
}

interface Props {
  upcoming: Match[]
  past: Match[]
}

const TEAM_COLORS: Record<string, string> = {
  "Primera":  "bg-bordo-800 text-white",
  "Reserva":  "bg-blue-700 text-white",
  "Pre A":    "bg-green-700 text-white",
  "Pre B":    "bg-orange-500 text-white",
}

function TeamBadge({ name }: { name: string | null }) {
  if (!name) return null
  const cls = TEAM_COLORS[name] ?? "bg-gray-600 text-white"
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${cls}`}>{name}</span>
}

function ResultBadge({ pf, pa }: { pf: number | null; pa: number | null }) {
  if (pf == null || pa == null) return <span className="text-xs text-gray-400">Sin resultado</span>
  if (pf > pa) return <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">Victoria {pf}-{pa}</span>
  if (pf < pa) return <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">Derrota {pf}-{pa}</span>
  return <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">Empate {pf}-{pa}</span>
}

function MatchCard({ match }: { match: Match }) {
  return (
    <Link
      href={`/coach/matches/${match.id}`}
      className="flex items-center justify-between bg-white rounded-2xl px-4 py-3 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <TeamBadge name={match.team_name} />
          <ResultBadge pf={match.points_for} pa={match.points_against} />
        </div>
        <p className="font-bold text-gray-900 truncate">vs. {match.opponent}</p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <CalendarDays className="h-3 w-3" />
            {match.date_display}{match.kickoff_time ? ` · ${match.kickoff_time} hs` : ""}
          </span>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Users className="h-3 w-3" />
            {match.squad_count} conv.
          </span>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-gray-300 shrink-0 ml-3" />
    </Link>
  )
}

export default function CoachMatchesIndex({ upcoming, past }: Props) {
  return (
    <CoachLayout>
      <Head title="Partidos" />

      <div className="bg-white border-b border-gray-100 px-4 pb-4 pt-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Partidos</h1>
          <p className="text-sm text-gray-400">{upcoming.length} próximos · {past.length} jugados</p>
        </div>
        <Link
          href="/coach/matches/new"
          className="flex items-center gap-1.5 rounded-xl bg-bordo-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-bordo-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> Nuevo
        </Link>
      </div>

      <div className="px-4 pt-4 pb-6 bg-gray-50 min-h-full space-y-5">

        {upcoming.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Próximos partidos</h2>
            <div className="space-y-2">
              {upcoming.map(m => <MatchCard key={m.id} match={m} />)}
            </div>
          </section>
        )}

        {past.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Partidos jugados</h2>
            <div className="space-y-2">
              {past.map(m => <MatchCard key={m.id} match={m} />)}
            </div>
          </section>
        )}

        {upcoming.length === 0 && past.length === 0 && (
          <div className="rounded-2xl bg-white p-8 text-center border border-gray-100 shadow-sm">
            <p className="text-gray-400 mb-4">No hay partidos cargados todavía.</p>
            <Link href="/coach/matches/new" className="inline-flex items-center gap-2 rounded-xl bg-bordo-800 px-4 py-2 text-sm font-semibold text-white hover:bg-bordo-700">
              <Plus className="h-4 w-4" /> Crear primer partido
            </Link>
          </div>
        )}
      </div>
    </CoachLayout>
  )
}
