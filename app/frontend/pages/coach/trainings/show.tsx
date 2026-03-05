import { Head, Link } from "@inertiajs/react"
import { ArrowLeft, Users, TrendingUp, FileText } from "lucide-react"
import CoachLayout from "@/layouts/coach/coach-layout"

interface PerceptionGroup {
  group: string; count: number; rpe_avg: number; fatigue_avg: number; injury_impact_avg: number
}
interface Training {
  id: number; date: string; training_type: string; objective: string
  pdf_url?: string | null
  attendance: { present: number; absent: number; total: number } | null
  perception_by_role: PerceptionGroup[] | null
}
interface Props { training: Training }

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
}

function RpeBar({ value }: { value: number }) {
  const pct = (value / 10) * 100
  const color = value <= 4 ? "bg-green-400" : value <= 6 ? "bg-yellow-400" : value <= 8 ? "bg-orange-400" : "bg-red-500"
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 rounded-full bg-gray-100 h-2">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm font-bold text-gray-700 w-6 text-right">{value.toFixed(1)}</span>
    </div>
  )
}

function FatigueLabel({ v }: { v: number }) {
  if (v <= 1.5) return <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">Baja</span>
  if (v <= 2.5) return <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-700">Moderada</span>
  if (v <= 3.5) return <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-700">Alta</span>
  return <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">Muy Alta</span>
}

export default function CoachTrainingsShow({ training }: Props) {
  const isPast = !!training.attendance

  return (
    <CoachLayout>
      <Head title={`Entrenamiento ${training.id}`} />

      {/* Header */}
      <div className="bg-bordo-800 px-4 pt-12 pb-8 relative">
        <Link href="/coach/trainings" className="absolute top-10 left-4 text-white/70 hover:text-white flex items-center gap-1 text-sm">
          <ArrowLeft className="h-4 w-4" /> Entrenamientos
        </Link>
        <div className="mt-4 text-center">
          <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-semibold text-white">{training.training_type}</span>
          <p className="mt-2 text-lg font-bold text-white capitalize">{fmtDate(training.date)}</p>
          {training.objective && <p className="mt-1 text-sm text-white/70">{training.objective}</p>}
        </div>
      </div>

      <div className="px-4 pt-4 pb-8 space-y-5">

        {/* Asistencia */}
        {isPast && training.attendance && (
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-2">
              <Users className="h-4 w-4" /> Asistencia
            </h2>
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl font-bold text-bordo-800">{training.attendance.present}/{training.attendance.total}</span>
                <span className={`rounded-full px-3 py-1 text-sm font-semibold
                  ${training.attendance.absent === 0 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {training.attendance.absent} ausente{training.attendance.absent !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="w-full rounded-full bg-gray-100 h-3">
                <div className="h-3 rounded-full bg-bordo-700 transition-all"
                  style={{ width: `${(training.attendance.present / training.attendance.total) * 100}%` }} />
              </div>
            </div>
          </section>
        )}

        {/* Percepción por Rol */}
        {training.perception_by_role && training.perception_by_role.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> Percepción por Grupo
            </h2>
            <div className="space-y-3">
              {training.perception_by_role.map(g => (
                <div key={g.group} className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900">{g.group}</h3>
                    <span className="text-xs text-gray-400">{g.count} jugadores</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>RPE Promedio</span>
                        <span>/ 10</span>
                      </div>
                      <RpeBar value={g.rpe_avg} />
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-gray-500 text-xs">Fatiga</span>
                      <FatigueLabel v={g.fatigue_avg} />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 text-xs">Impacto lesional</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold
                        ${g.injury_impact_avg <= 1.2 ? "bg-green-100 text-green-700" : g.injury_impact_avg <= 1.8 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                        {g.injury_impact_avg <= 1.2 ? "Sin impacto" : g.injury_impact_avg <= 1.8 ? "Leve" : "Moderado"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Plan de entrenamiento PDF */}
        {training.pdf_url && (
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4" /> Plan de entrenamiento
            </h2>
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-bordo-100">
                    <FileText className="h-5 w-5 text-bordo-700" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Semana 6 — Planificación</p>
                    <p className="text-xs text-gray-400">Cargado por Lucas Brouwer</p>
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
                style={{ height: "420px" }}
                title="Plan de entrenamiento"
              />
            </div>
          </section>
        )}

        {/* Sin datos (upcoming training) */}
        {!isPast && (
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-8 text-center text-gray-400">
            <p className="text-sm">Este entrenamiento aún no se realizó.</p>
            <p className="text-xs mt-1">La percepción del plantel aparecerá aquí una vez finalizado.</p>
          </div>
        )}

      </div>
    </CoachLayout>
  )
}
