import { Head, Link, useForm } from "@inertiajs/react"
import { ArrowLeft } from "lucide-react"
import CoachLayout from "@/layouts/coach/coach-layout"

const TRAINING_TYPES = [
  "Físico", "Técnica", "Táctica", "Físico + Técnica",
  "Técnica + Línea", "Físico + Scrum", "Match practice", "Recuperación"
]

export default function CoachTrainingsNew() {
  const { data, setData, post, processing } = useForm({
    date: "", start_time: "19:00", end_time: "21:00",
    training_type: "Físico", objective: "", notes: ""
  })

  function submit(e: React.FormEvent) {
    e.preventDefault()
    post("/coach/trainings")
  }

  return (
    <CoachLayout>
      <Head title="Nuevo Entrenamiento" />

      <div className="bg-white border-b border-gray-100 px-4 pb-4 pt-10">
        <div className="flex items-center gap-3">
          <Link href="/coach/trainings" className="text-gray-400 hover:text-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Nuevo Entrenamiento</h1>
        </div>
      </div>

      <form onSubmit={submit} className="px-4 pt-5 pb-8 space-y-4">

        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5 space-y-4">

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Fecha</label>
            <input type="date" value={data.date} onChange={e => setData("date", e.target.value)} required
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-bordo-400 focus:outline-none focus:ring-2 focus:ring-bordo-100" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Inicio</label>
              <input type="time" value={data.start_time} onChange={e => setData("start_time", e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-bordo-400 focus:outline-none focus:ring-2 focus:ring-bordo-100" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Fin</label>
              <input type="time" value={data.end_time} onChange={e => setData("end_time", e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-bordo-400 focus:outline-none focus:ring-2 focus:ring-bordo-100" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Tipo</label>
            <select value={data.training_type} onChange={e => setData("training_type", e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-bordo-400 focus:outline-none focus:ring-2 focus:ring-bordo-100">
              {TRAINING_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Objetivo</label>
            <input type="text" value={data.objective} onChange={e => setData("objective", e.target.value)}
              placeholder="Ej: Trabajo de scrum y lineout"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-bordo-400 focus:outline-none focus:ring-2 focus:ring-bordo-100" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Notas (opcional)</label>
            <textarea value={data.notes} onChange={e => setData("notes", e.target.value)}
              rows={3} placeholder="Observaciones adicionales..."
              className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-bordo-400 focus:outline-none focus:ring-2 focus:ring-bordo-100" />
          </div>

          {/* PDF placeholder */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Planificación PDF</label>
            <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-6 text-gray-400 text-sm cursor-pointer hover:border-bordo-200 hover:text-bordo-400 transition-colors">
              Adjuntar PDF de planificación
            </div>
          </div>

        </div>

        <button type="submit" disabled={processing}
          className="w-full rounded-2xl bg-bordo-800 py-4 text-base font-bold text-white shadow-lg hover:bg-bordo-700 transition-colors disabled:opacity-50">
          Guardar Entrenamiento
        </button>

      </form>
    </CoachLayout>
  )
}
