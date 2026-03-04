import { Head, Link } from "@inertiajs/react"
import { Bell, ChevronRight, CalendarDays, Trophy, AlertCircle, Clock } from "lucide-react"
import CoachLayout from "@/layouts/coach/coach-layout"

interface Props {
  coach: { first_name: string; last_name: string; category: string; role: string }
  season: string
  next_training: { id: number; date: string; start_time: string; training_type: string; objective: string } | null
  next_match: { date: string; opponent: string; home: boolean; label: string } | null
  wellness_summary: { ok: number; en_observacion: number; en_recuperacion: number; not_loaded: number; total: number }
  team_stats: { matches_played: number; wins: number; losses: number; points_for: number; points_against: number }
  pending_tasks: { type: string; label: string; count: number; href: string }[]
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })
}

export default function CoachHome({ coach, season, next_training, next_match, wellness_summary, team_stats, pending_tasks }: Props) {
  const initials = `${coach.first_name[0]}${coach.last_name[0]}`

  return (
    <CoachLayout>
      <Head title="Inicio — Entrenador" />

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 pt-10 pb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bordo-800 text-yellow-400 font-bold text-lg">
              {initials}
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">¡Hola,</p>
              <h1 className="text-xl font-bold text-gray-900">{coach.first_name} {coach.last_name}!</h1>
            </div>
          </div>
          <button className="relative rounded-full p-2 text-gray-400 hover:text-gray-600">
            <Bell className="h-6 w-6" />
          </button>
        </div>

        {/* Info pills */}
        <div className="mt-4 flex gap-2 flex-wrap">
          <span className="rounded-full bg-bordo-50 px-3 py-1 text-xs font-semibold text-bordo-700">{coach.category}</span>
          <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700">{coach.role}</span>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">Temporada {season}</span>
        </div>
      </div>

      <div className="px-4 pt-4 pb-6 space-y-5">

        {/* Próximos Eventos */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Próximos Eventos</h2>
          <div className="space-y-2">
            {next_training && (
              <Link href={`/coach/trainings/${next_training.id}`}
                className="flex items-center justify-between rounded-2xl bg-white border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-bordo-50 p-2.5">
                    <CalendarDays className="h-5 w-5 text-bordo-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Entrenamiento · {next_training.training_type}</p>
                    <p className="text-xs text-gray-400 capitalize">{formatDate(next_training.date)} · {next_training.start_time} hs</p>
                    <p className="text-xs text-gray-500 mt-0.5">{next_training.objective}</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-300 shrink-0" />
              </Link>
            )}
            {next_match && (
              <div className="flex items-center justify-between rounded-2xl bg-white border border-gray-100 shadow-sm p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-yellow-50 p-2.5">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Partido vs. {next_match.opponent}</p>
                    <p className="text-xs text-gray-400 capitalize">{formatDate(next_match.date)} · {next_match.home ? "Local" : "Visitante"}</p>
                    <span className="inline-block mt-0.5 rounded-full bg-bordo-50 px-2 py-0.5 text-xs font-semibold text-bordo-700">{next_match.label}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Estado del Plantel */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Estado del Plantel Hoy</h2>
            <Link href="/coach/squad" className="text-xs text-bordo-700 font-medium">Ver plantel →</Link>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Ok",           value: wellness_summary.ok,            color: "bg-green-50 text-green-700"  },
              { label: "Observación",  value: wellness_summary.en_observacion, color: "bg-yellow-50 text-yellow-700"},
              { label: "Recuperación", value: wellness_summary.en_recuperacion,color: "bg-red-50 text-red-700"     },
              { label: "Sin cargar",   value: wellness_summary.not_loaded,     color: "bg-gray-100 text-gray-500"  },
            ].map((s) => (
              <div key={s.label} className={`rounded-xl p-3 text-center ${s.color}`}>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs font-medium leading-tight mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Estadísticas del Equipo */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Estadísticas del Equipo</h2>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Partidos Jugados", value: team_stats.matches_played, color: "bg-white"       },
              { label: "Victorias",        value: team_stats.wins,           color: "bg-white"       },
              { label: "Puntos a Favor",   value: team_stats.points_for,     color: "bg-white"       },
              { label: "Puntos en Contra", value: team_stats.points_against, color: "bg-white"       },
            ].map((s) => (
              <div key={s.label} className={`rounded-2xl border border-gray-100 shadow-sm p-4 ${s.color}`}>
                <p className="text-3xl font-bold text-bordo-800">{s.value}</p>
                <p className="text-xs text-gray-400 font-medium mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tareas Pendientes */}
        {pending_tasks.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Tareas Pendientes</h2>
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm divide-y divide-gray-50">
              {pending_tasks.map((task) => (
                <Link key={task.type} href={task.href}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-4 w-4 text-yellow-500 shrink-0" />
                    <span className="text-sm text-gray-700">{task.label}</span>
                    <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-bold text-yellow-700">{task.count}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-300" />
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </CoachLayout>
  )
}
