import { Head, Link } from "@inertiajs/react"
import { ChevronRight, Home, MapPin } from "lucide-react"
import { useState } from "react"
import CoachLayout from "@/layouts/coach/coach-layout"

interface Match {
  id: number
  label: string
  opponent: string
  home: boolean
  category: string
  points_for: number
  points_against: number
  date: string
  result: string
  tournament?: string
}

interface Props {
  teams: Record<string, Match[]>
}

function fmtDate(d: string) {
  return new Date(d + "T12:00:00").toLocaleDateString("es-AR", { day: "numeric", month: "short" })
}

function MatchList({ matches }: { matches: Match[] }) {
  if (matches.length === 0) {
    return (
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 text-center">
        <p className="text-sm text-gray-400">Sin partidos registrados en esta categoría.</p>
      </div>
    )
  }
  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm divide-y divide-gray-50 overflow-hidden">
      {matches.map((m) => (
        <Link
          key={m.id}
          href={`/coach/stats/matches/${m.id}`}
          className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                m.result === "win" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}>
                {m.result === "win" ? "Victoria" : "Derrota"}
              </span>
              {m.home
                ? <span className="flex items-center gap-0.5 text-xs text-gray-400"><Home className="h-3 w-3" /> Local</span>
                : <span className="flex items-center gap-0.5 text-xs text-gray-400"><MapPin className="h-3 w-3" /> Visitante</span>}
            </div>
            <p className="font-semibold text-gray-900 text-sm">vs. {m.opponent}</p>
            <p className="text-xs text-gray-400">
              {m.tournament && <span className="font-medium text-bordo-600">{m.tournament} · </span>}
              {m.label} · {fmtDate(m.date)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-xl font-bold text-bordo-800">
              {m.points_for}<span className="text-gray-400 font-normal text-sm">-{m.points_against}</span>
            </p>
            <ChevronRight className="h-4 w-4 text-gray-300" />
          </div>
        </Link>
      ))}
    </div>
  )
}

export default function CoachStatsIndex({ teams }: Props) {
  const teamNames = Object.keys(teams)
  const [activeTab, setActiveTab] = useState(teamNames[0] ?? "")

  return (
    <CoachLayout>
      <Head title="Estadísticas" />

      <div className="bg-white border-b border-gray-100 px-4 pb-4 pt-10">
        <h1 className="text-2xl font-bold text-gray-900">Estadísticas</h1>
        <p className="text-sm text-gray-400">Partidos por equipo · Temporada 2026</p>
      </div>

      <div className="px-4 pt-4 pb-6 space-y-4">
        {/* Dynamic team tabs */}
        {teamNames.length > 1 && (
          <div className="flex gap-2">
            {teamNames.map((name) => (
              <button
                key={name}
                onClick={() => setActiveTab(name)}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  activeTab === name
                    ? "bg-bordo-800 text-white shadow-sm"
                    : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        )}

        {/* Match list for active tab */}
        <section>
          <h2 className="text-xs font-bold text-bordo-700 uppercase tracking-widest mb-2">
            Partidos — {activeTab}
          </h2>
          <MatchList matches={teams[activeTab] ?? []} />
        </section>
      </div>
    </CoachLayout>
  )
}
