import { Head, Link } from "@inertiajs/react"
import { Calendar } from "lucide-react"

import PlayerLayout from "@/layouts/player/player-layout"

interface Training {
  id: number
  date: string
  date_display: string
  start_time: string | null
  end_time: string | null
  training_type: string | null
  objective: string | null
  for_all: boolean
  target_groups: string[]
}

interface Props {
  upcoming: Training[]
  past: Training[]
}

const TYPE_CONFIG: Record<string, { label: string; classes: string }> = {
  rugby:  { label: "Rugby",    classes: "bg-green-50 text-green-700 border-green-200" },
  fisico: { label: "Físico",   classes: "bg-bordo-50 text-bordo-700 border-bordo-200" },
  fuerza: { label: "Fuerza",   classes: "bg-blue-50 text-blue-700 border-blue-200"   },
}

function TypeBadge({ type }: { type: string | null }) {
  if (!type) return null
  const cfg = TYPE_CONFIG[type] ?? { label: type, classes: "bg-gray-50 text-gray-600 border-gray-200" }
  return (
    <span className={`text-xs font-semibold rounded-full px-2.5 py-0.5 border capitalize ${cfg.classes}`}>
      {cfg.label}
    </span>
  )
}

const GROUP_LABELS: Record<string, string> = { forward: "Forwards", back: "Backs" }

function formatDateLong(dateStr: string) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("es-AR", {
    weekday: "long", day: "numeric", month: "long"
  })
}

function TargetPill({ t }: { t: Training }) {
  if (t.for_all) return null
  const labels = t.target_groups.map((g) => GROUP_LABELS[g] ?? g)
  return (
    <span className={`text-xs font-semibold rounded-full px-2 py-0.5 ${
      labels.includes("Forwards") && labels.includes("Backs")
        ? "bg-purple-50 text-purple-700"
        : labels.includes("Forwards")
          ? "bg-bordo-50 text-bordo-700"
          : "bg-blue-50 text-blue-700"
    }`}>
      {labels.join(" + ")}
    </span>
  )
}

function TrainingCard({ t }: { t: Training }) {
  return (
    <Link
      href={`/player/trainings/${t.id}`}
      className="block rounded-2xl bg-white border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 capitalize">{formatDateLong(t.date)}</p>
          <div className="flex items-center gap-2 mt-1">
            <TypeBadge type={t.training_type} />
          </div>
          {t.objective && <p className="text-sm text-gray-500 mt-1 truncate">{t.objective}</p>}
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          {t.start_time && (
            <span className="text-xs font-medium text-bordo-700">
              {t.start_time}{t.end_time ? ` – ${t.end_time}` : ""}
            </span>
          )}
          <TargetPill t={t} />
        </div>
      </div>
    </Link>
  )
}

export default function PlayerTrainingsIndex({ upcoming, past }: Props) {
  return (
    <PlayerLayout>
      <Head title="Entrenamientos" />

      <div className="bg-white border-b border-gray-100 px-4 pb-4 pt-8">
        <h1 className="text-2xl font-bold text-gray-900">Mis Entrenamientos</h1>
      </div>

      <div className="px-4 pt-4 pb-8 bg-gray-50 min-h-full space-y-6">
        {/* Upcoming */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-bordo-700 mb-3">Proximos</h2>
          {upcoming.length === 0 ? (
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 text-center">
              <Calendar className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No hay entrenamientos programados</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map((t) => <TrainingCard key={t.id} t={t} />)}
            </div>
          )}
        </section>

        {/* Past */}
        {past.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Anteriores</h2>
            <div className="space-y-3">
              {past.map((t) => (
                <Link
                  key={t.id}
                  href={`/player/trainings/${t.id}`}
                  className="flex items-center justify-between rounded-2xl bg-white border border-gray-100 shadow-sm px-4 py-3 hover:shadow-md transition-shadow"
                >
                  <div>
                    <p className="text-xs text-gray-400 capitalize">{formatDateLong(t.date)}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <TypeBadge type={t.training_type} />
                    </div>
                    {t.objective && <p className="text-xs text-gray-500 mt-0.5 truncate">{t.objective}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <TargetPill t={t} />
                    <span className="text-gray-300 text-lg">›</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </PlayerLayout>
  )
}
