import { Head, Link, router } from "@inertiajs/react"
import { ArrowLeft, Clock, CheckCircle, AlertCircle } from "lucide-react"

import PlayerLayout from "@/layouts/player/player-layout"

interface Slot {
  id: number
  start_time: string
  end_time: string
  available: boolean
  booked: number
  capacity: number
}

interface Session {
  id: number
  date_display: string
  day_name: string
  status: string
}

interface Props {
  session: Session
  slots: Slot[]
  my_slot_id: number | null
}

export default function PlayerNutritionSessionShow({ session, slots, my_slot_id }: Props) {
  const isPublished = session.status === "published"

  function bookSlot(slotId: number) {
    router.post(`/player/nutrition_sessions/${session.id}/book_slot`, { slot_id: slotId }, { preserveScroll: true })
  }

  function cancelBooking() {
    if (confirm("¿Cancelar tu turno? El horario quedará libre.")) {
      router.delete(`/player/nutrition_sessions/${session.id}/cancel`, { preserveScroll: true })
    }
  }

  return (
    <PlayerLayout>
      <Head title={`Nutrición · ${session.date_display}`} />

      <div className="p-5 max-w-lg mx-auto">
        <Link href="/player/nutrition_sessions" className="flex items-center gap-1 text-bordo-600 hover:text-bordo-800 mb-4 text-sm">
          <ArrowLeft className="h-4 w-4" /> Mis turnos
        </Link>

        <div className="mb-5">
          <p className="text-xs text-gray-400 capitalize">{session.day_name}</p>
          <h1 className="text-2xl font-bold text-gray-900">{session.date_display}</h1>
          <p className="text-sm text-gray-500 mt-1">Seleccioná tu horario de evaluación nutricional.</p>
        </div>

        {/* My current slot */}
        {my_slot_id && (
          <div className="rounded-2xl bg-green-50 border border-green-200 p-4 mb-5 flex items-start justify-between">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-green-800">Turno confirmado</p>
                <p className="text-sm text-green-700">
                  {slots.find(s => s.id === my_slot_id)?.start_time} hs
                </p>
              </div>
            </div>
            {isPublished && (
              <button
                onClick={cancelBooking}
                className="text-xs font-medium text-red-500 hover:text-red-600 underline"
              >
                Cancelar
              </button>
            )}
          </div>
        )}

        {!my_slot_id && isPublished && (
          <div className="rounded-2xl bg-yellow-50 border border-yellow-200 p-3 mb-5 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-600 shrink-0" />
            <p className="text-xs text-yellow-700 font-medium">Todavía no elegiste tu turno. Seleccioná un horario libre.</p>
          </div>
        )}

        {/* Slots grid */}
        {slots.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">La sesión aún no tiene turnos generados.</p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {slots.map((slot) => {
              const isMine = slot.id === my_slot_id
              const canBook = isPublished && slot.available && !my_slot_id
              const isFull = !slot.available && !isMine

              return (
                <button
                  key={slot.id}
                  onClick={() => canBook && bookSlot(slot.id)}
                  disabled={!canBook && !isMine}
                  className={`rounded-2xl border p-3 text-left transition-all ${
                    isMine
                      ? "bg-green-50 border-green-300 shadow-sm"
                      : isFull
                      ? "bg-gray-50 border-gray-100 opacity-50 cursor-not-allowed"
                      : canBook
                      ? "bg-white border-bordo-200 hover:bg-bordo-50 hover:border-bordo-400 cursor-pointer shadow-sm"
                      : "bg-gray-50 border-gray-100 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Clock className={`h-3.5 w-3.5 ${isMine ? "text-green-600" : "text-gray-400"}`} />
                    <span className={`text-sm font-semibold ${isMine ? "text-green-800" : "text-gray-700"}`}>
                      {slot.start_time}
                    </span>
                  </div>
                  <p className={`text-xs ${isFull ? "text-red-400" : "text-gray-400"}`}>
                    {isFull ? "Ocupado" : isMine ? "Tu turno" : `${slot.capacity - slot.booked} lugar${slot.capacity - slot.booked !== 1 ? "es" : ""} libre${slot.capacity - slot.booked !== 1 ? "s" : ""}`}
                  </p>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </PlayerLayout>
  )
}
