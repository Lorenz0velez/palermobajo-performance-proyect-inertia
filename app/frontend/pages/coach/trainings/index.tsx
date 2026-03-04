import { Head, Link } from "@inertiajs/react"
import { ChevronRight, Plus, CalendarDays, FileText } from "lucide-react"
import CoachLayout from "@/layouts/coach/coach-layout"

interface Upcoming {
  id: number; date: string; start_time: string; end_time: string
  training_type: string; objective: string; has_plan: boolean
}
interface Past {
  id: number; date: string; training_type: string; objective: string
  attendance: { present: number; absent: number; total: number }
}
interface Props { upcoming: Upcoming[]; past: Past[] }

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("es-AR", { weekday: "short", day: "numeric", month: "short" })
}

export default function CoachTrainingsIndex({ upcoming, past }: Props) {
  return (
    <CoachLayout>
      <Head title="Entrenamientos" />

      <div className="bg-white border-b border-gray-100 px-4 pb-4 pt-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Entrenamientos</h1>
            <p className="text-sm text-gray-400">Temporada 2026</p>
          </div>
          <Link href="/coach/trainings/new"
            className="flex items-center gap-1.5 rounded-xl bg-bordo-800 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-bordo-700 transition-colors">
            <Plus className="h-4 w-4" /> Nuevo
          </Link>
        </div>
      </div>

      <div className="px-4 pt-4 pb-6 space-y-5">

        {/* Próximos */}
        <section>
          <h2 className="text-xs font-bold text-bordo-700 uppercase tracking-widest mb-2">Próximos</h2>
          <div className="space-y-2">
            {upcoming.map(t => (
              <div key={t.id} className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-bordo-50 p-2">
                      <CalendarDays className="h-5 w-5 text-bordo-700" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm capitalize">{fmtDate(t.date)} · {t.start_time} hs</p>
                      <span className="rounded-full bg-bordo-100 px-2 py-0.5 text-xs font-semibold text-bordo-700">{t.training_type}</span>
                    </div>
                  </div>
                  {t.has_plan && (
                    <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                      <FileText className="h-3 w-3" /> Plan
                    </span>
                  )}
                </div>
                <p className="mt-2 text-xs text-gray-500 pl-12">{t.objective}</p>
                <div className="mt-3 flex gap-2 pl-12">
                  <button className="rounded-lg border border-bordo-200 px-3 py-1.5 text-xs font-semibold text-bordo-700 hover:bg-bordo-50">
                    Planificar
                  </button>
                  <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-50">
                    Adjuntar PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Historial */}
        <section>
          <h2 className="text-xs font-bold text-bordo-700 uppercase tracking-widest mb-2">Historial 2026</h2>
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm divide-y divide-gray-50 overflow-hidden">
            {past.map(t => (
              <Link key={t.id} href={`/coach/trainings/${t.id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-semibold text-gray-900 text-sm capitalize">{fmtDate(t.date)}</p>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">{t.training_type}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold
                    ${t.attendance.absent === 0 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {t.attendance.present}/{t.attendance.total} presentes
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-300" />
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </CoachLayout>
  )
}
