import { Head, Link, router } from "@inertiajs/react"
import { CalendarDays, Clock, Plus, Trash2, Users } from "lucide-react"

import NutriLayout from "@/layouts/nutricionista/nutri-layout"

interface Session {
  id: number
  date: string
  date_display: string
  day_name: string
  status: string
  capacity_per_slot: number
  total_convocados: number
  total_booked: number
  total_slots: number
}

interface Props {
  upcoming: Session[]
  past: Session[]
}

const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  draft:     { label: "Borrador",   classes: "bg-gray-100 text-gray-600" },
  published: { label: "Publicada",  classes: "bg-green-100 text-green-700" },
  completed: { label: "Completada", classes: "bg-blue-100 text-blue-700" },
}

function SessionCard({ s }: { s: Session }) {
  const cfg = STATUS_CONFIG[s.status] ?? STATUS_CONFIG.draft

  function handleDelete(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (confirm(`¿Eliminar la sesión del ${s.date_display}? Esta acción no se puede deshacer.`)) {
      router.delete(`/nutricionista/nutrition_sessions/${s.id}`)
    }
  }

  return (
    <div className="relative group rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <Link
        href={`/nutricionista/nutrition_sessions/${s.id}`}
        className="block p-4"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-gray-400 capitalize">{s.day_name}</p>
            <p className="text-lg font-bold text-gray-900">{s.date_display}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold rounded-full px-2.5 py-1 ${cfg.classes}`}>
              {cfg.label}
            </span>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {s.total_convocados} convocados ({s.total_booked} con turno)
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {s.total_slots} turnos
          </span>
        </div>
      </Link>
      {s.status !== "completed" && (
        <button
          onClick={handleDelete}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50"
          title="Eliminar sesión"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

export default function NutritionSessionsIndex({ upcoming, past }: Props) {
  return (
    <NutriLayout>
      <Head title="Sesiones de Nutrición" />
      <div className="p-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sesiones de Nutrición</h1>
            <p className="text-sm text-gray-500 mt-1">Gestión de convocatorias y turnos</p>
          </div>
          <Link
            href="/nutricionista/nutrition_sessions/new"
            className="flex items-center gap-2 rounded-xl bg-bordo-800 text-white px-4 py-2.5 text-sm font-semibold hover:bg-bordo-700 transition-colors"
          >
            <Plus className="h-4 w-4" /> Nueva Sesión
          </Link>
        </div>

        <section className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-bordo-700 mb-3">Próximas</h2>
          {upcoming.length === 0 ? (
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-8 text-center">
              <CalendarDays className="h-10 w-10 text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-400">No hay sesiones programadas</p>
              <Link href="/nutricionista/nutrition_sessions/new" className="mt-3 inline-block text-sm text-bordo-600 underline">
                Crear primera sesión
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map((s) => <SessionCard key={s.id} s={s} />)}
            </div>
          )}
        </section>

        {past.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Anteriores</h2>
            <div className="space-y-3">
              {past.map((s) => <SessionCard key={s.id} s={s} />)}
            </div>
          </section>
        )}
      </div>
    </NutriLayout>
  )
}
