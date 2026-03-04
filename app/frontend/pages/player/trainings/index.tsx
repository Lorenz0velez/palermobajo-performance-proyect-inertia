import { Head, Link } from "@inertiajs/react"
import { Calendar, CheckCircle, XCircle } from "lucide-react"
import PlayerLayout from "@/layouts/player/player-layout"

interface UpcomingTraining {
  id: string
  date: string
  start_time: string
  end_time: string
  training_type: string
  objective: string | null
}

interface PastTraining {
  id: string
  date: string
  training_type: string
  present: boolean
  minutes_participated: number | null
  absence_reason: string | null
}

interface Props {
  upcoming: UpcomingTraining[]
  past: PastTraining[]
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })
}

function formatTime(t: string) {
  return t.slice(0, 5)
}

export default function PlayerTrainingsIndex({ upcoming, past }: Props) {
  return (
    <PlayerLayout>
      <Head title="Entrenamientos" />

      <div className="bg-white border-b border-gray-100 px-4 pb-4 pt-8">
        <h1 className="text-2xl font-bold text-gray-900">Entrenamientos</h1>
      </div>

      <div className="px-4 pt-4 pb-4 bg-gray-50 min-h-full space-y-5">
        {/* Upcoming */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-bordo-700 mb-3">Próximos</h2>
          {upcoming.length === 0 ? (
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 text-center">
              <Calendar className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No hay entrenamientos programados</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map((t) => (
                <Link
                  key={t.id}
                  href={`/player/trainings/${t.id}`}
                  className="block rounded-2xl bg-white border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-gray-400 capitalize">{formatDate(t.date)}</p>
                      <p className="font-semibold text-gray-900 mt-0.5">{t.training_type}</p>
                      {t.objective && <p className="text-sm text-gray-500 mt-1">{t.objective}</p>}
                    </div>
                    <div className="text-right text-sm text-bordo-700 font-medium">
                      <p>{formatTime(t.start_time)}</p>
                      <p className="text-gray-400 text-xs">— {formatTime(t.end_time)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* History */}
        <section className="pb-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-bordo-700 mb-3">Historial</h2>
          {past.length === 0 ? (
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 text-center">
              <p className="text-sm text-gray-400">Sin historial de entrenamientos</p>
            </div>
          ) : (
            <div className="space-y-3">
              {past.map((t) => (
                <Link
                  key={t.id}
                  href={`/player/trainings/${t.id}`}
                  className="flex items-center gap-3 rounded-2xl bg-white border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow"
                >
                  {t.present ? (
                    <CheckCircle className="h-6 w-6 text-green-500 shrink-0" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-400 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 capitalize">{formatDate(t.date)}</p>
                    <p className="font-medium text-gray-800 text-sm">{t.training_type}</p>
                    {!t.present && t.absence_reason && (
                      <p className="text-xs text-red-400 mt-0.5 truncate">{t.absence_reason}</p>
                    )}
                  </div>
                  {t.minutes_participated != null && (
                    <span className="text-sm text-gray-500">{t.minutes_participated} min</span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </PlayerLayout>
  )
}
