import { Head, Link } from "@inertiajs/react"
import { ArrowLeft, CheckCircle, XCircle, FileText } from "lucide-react"
import PlayerLayout from "@/layouts/player/player-layout"

interface Training {
  id: string
  date: string
  start_time: string
  end_time: string
  training_type: string
  objective: string | null
  pdf_url?: string | null
}

interface Attendance {
  present: boolean
  minutes_participated: number | null
  absence_reason: string | null
}

interface Perception {
  rpe: number
  perceived_load: number
  comments: string | null
}

interface Props {
  training: Training
  attendance: Attendance | null
  perception: Perception | null
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
}

function formatTime(t: string) {
  return t.slice(0, 5)
}

const RPE_LABELS: Record<number, string> = {
  1: "Muy fácil",
  2: "Fácil",
  3: "Moderado",
  4: "Difícil",
  5: "Muy difícil",
  6: "Máximo",
}

const RPE_COLORS: Record<number, string> = {
  1: "bg-green-100 text-green-800",
  2: "bg-green-200 text-green-800",
  3: "bg-yellow-100 text-yellow-800",
  4: "bg-orange-100 text-orange-800",
  5: "bg-red-100 text-red-800",
  6: "bg-red-200 text-red-900",
}

export default function PlayerTrainingShow({ training, attendance, perception }: Props) {
  return (
    <PlayerLayout>
      <Head title={training.training_type} />

      <div className="bg-white border-b border-gray-100 px-4 pb-4 pt-8">
        <Link href="/player/trainings" className="flex items-center gap-1 text-bordo-600 hover:text-bordo-800 mb-4 text-sm">
          <ArrowLeft className="h-4 w-4" /> Entrenamientos
        </Link>
        <p className="text-xs text-gray-400 uppercase tracking-wide capitalize">{formatDate(training.date)}</p>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">{training.training_type}</h1>
        <p className="text-gray-500 text-sm mt-1">{formatTime(training.start_time)} – {formatTime(training.end_time)}</p>
      </div>

      <div className="px-4 pt-4 pb-4 bg-gray-50 min-h-full space-y-3">
        {/* Objective */}
        {training.objective && (
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase mb-2">Objetivo</h2>
            <p className="text-gray-800">{training.objective}</p>
          </div>
        )}

        {/* Plan de entrenamiento */}
        {training.pdf_url && (
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-bordo-100">
                  <FileText className="h-5 w-5 text-bordo-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Plan de entrenamiento</p>
                  <p className="text-xs text-gray-400">Semana 6 · Lucas Brouwer</p>
                </div>
              </div>
              <a
                href={training.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-bordo-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-bordo-700 transition-colors"
              >
                Ver PDF
              </a>
            </div>
            <iframe
              src={training.pdf_url}
              className="w-full"
              style={{ height: "380px" }}
              title="Plan de entrenamiento"
            />
          </div>
        )}

        {/* Attendance */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase mb-3">Asistencia</h2>
          {attendance == null ? (
            <p className="text-sm text-gray-400">Sin registro de asistencia</p>
          ) : (
            <div className="flex items-start gap-3">
              {attendance.present ? (
                <CheckCircle className="h-6 w-6 text-green-500 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="h-6 w-6 text-red-400 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-semibold text-gray-800">
                  {attendance.present ? "Presente" : "Ausente"}
                </p>
                {attendance.present && attendance.minutes_participated != null && (
                  <p className="text-sm text-gray-500">{attendance.minutes_participated} min participados</p>
                )}
                {!attendance.present && attendance.absence_reason && (
                  <p className="text-sm text-red-400 mt-0.5">{attendance.absence_reason}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Perception */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase mb-3">Percepción del esfuerzo</h2>
          {perception == null ? (
            <div>
              <p className="text-sm text-gray-400 mb-3">Sin percepción registrada</p>
              <a href="/percepcion" className="inline-block rounded-xl bg-bordo-800 px-4 py-2 text-sm font-semibold text-white hover:bg-bordo-700 transition-colors">
                Cargar percepción
              </a>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">RPE</span>
                <span className={`rounded-full px-3 py-1 text-sm font-semibold ${RPE_COLORS[perception.rpe] ?? "bg-gray-100 text-gray-700"}`}>
                  {perception.rpe} – {RPE_LABELS[perception.rpe] ?? "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Carga percibida</span>
                <span className="font-bold text-gray-900">{perception.perceived_load}</span>
              </div>
              {perception.comments && (
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-sm text-gray-500">{perception.comments}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PlayerLayout>
  )
}
