import { Head, Link } from "@inertiajs/react"
import { CalendarDays, CheckCircle, AlertCircle, XCircle } from "lucide-react"

import PlayerLayout from "@/layouts/player/player-layout"

interface SessionItem {
  id: number
  date_display: string
  day_name: string
  status: string
  slot_time: string | null
  booked: boolean
  pending: boolean
  cancelled: boolean
}

interface Props {
  convocatorias: SessionItem[]
}

function StatusBadge({ item }: { item: SessionItem }) {
  if (item.cancelled)
    return <span className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-full px-2 py-0.5"><XCircle className="h-3 w-3" /> Cancelado</span>
  if (item.booked)
    return <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5"><CheckCircle className="h-3 w-3" /> {item.slot_time} hs</span>
  if (item.status === "published")
    return <span className="flex items-center gap-1 text-xs font-medium text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-full px-2 py-0.5"><AlertCircle className="h-3 w-3" /> Elegir turno</span>
  return <span className="text-xs font-medium text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">Pendiente</span>
}

export default function PlayerNutritionSessionsIndex({ convocatorias }: Props) {
  return (
    <PlayerLayout>
      <Head title="Nutrición" />

      <div className="p-5 max-w-lg mx-auto">
        <div className="flex items-center gap-2 mb-5">
          <CalendarDays className="h-5 w-5 text-bordo-600" />
          <h1 className="text-lg font-bold text-gray-900">Mis turnos de nutrición</h1>
        </div>

        {convocatorias.length === 0 ? (
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-10 text-center">
            <p className="text-gray-400 text-sm">No hay sesiones asignadas aún.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {convocatorias.map((c) => (
              <Link
                key={c.id}
                href={`/player/nutrition_sessions/${c.id}`}
                className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="text-xs text-gray-400 capitalize">{c.day_name}</p>
                  <p className="font-semibold text-gray-800 text-sm">{c.date_display}</p>
                </div>
                <StatusBadge item={c} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </PlayerLayout>
  )
}
