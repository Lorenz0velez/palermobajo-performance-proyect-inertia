import { Head, Link, router } from "@inertiajs/react"
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle, Clock, Scale, Trash2, Users } from "lucide-react"
import { useState } from "react"

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

interface Slot {
  id: number
  start_time: string
  end_time: string
  capacity: number
  booked: number
  players: { id: number; full_name: string }[]
}

interface Convocado {
  id: number
  player_id: number
  full_name: string
  role: string | null
  slot_id: number | null
  slot_time: string | null
  booked: boolean
  pending: boolean
  cancelled: boolean
}

interface PlayerOption {
  id: number
  full_name: string
  functional_role: string | null
}

interface Props {
  session: Session
  slots: Slot[]
  convocados: Convocado[]
  all_players: PlayerOption[]
}

const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  draft:     { label: "Borrador",   classes: "bg-gray-100 text-gray-600" },
  published: { label: "Publicada",  classes: "bg-green-100 text-green-700" },
  completed: { label: "Completada", classes: "bg-blue-100 text-blue-700" },
}

function WeighModal({ slot, player, sessionId, onClose }: {
  slot: Slot; player: { id: number; full_name: string }; sessionId: number; onClose: () => void
}) {
  const [form, setForm] = useState({ weight_kg: "", muscle_mass_kg: "", fat_mass_kg: "", height_cm: "" })
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  function submit(e: React.FormEvent) {
    e.preventDefault()
    router.post(`/nutricionista/nutrition_sessions/${sessionId}/slots/${slot.id}/weigh_player`, {
      player_id: player.id,
      ...form,
    }, { onSuccess: onClose, preserveScroll: true })
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-1">Cargar Pesaje</h3>
        <p className="text-sm text-gray-500 mb-4">{player.full_name} · {slot.start_time} hs</p>
        <form onSubmit={submit} className="space-y-3">
          {[
            { key: "weight_kg",       label: "Peso (kg)",            placeholder: "ej: 95.5" },
            { key: "muscle_mass_kg",  label: "Masa Muscular (kg)",   placeholder: "ej: 68.0" },
            { key: "fat_mass_kg",     label: "Masa Grasa (kg)",      placeholder: "ej: 14.2" },
            { key: "height_cm",       label: "Altura (cm)",          placeholder: "ej: 185" },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
              <input
                type="number"
                step="0.1"
                value={form[key as keyof typeof form]}
                onChange={(e) => set(key, e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-bordo-300"
              />
            </div>
          ))}
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600">
              Cancelar
            </button>
            <button type="submit" className="flex-1 rounded-xl bg-bordo-800 py-2.5 text-sm font-semibold text-white hover:bg-bordo-700">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function NutritionSessionShow({ session, slots, convocados, all_players }: Props) {
  const [startTime, setStartTime]       = useState("09:00")
  const [endTime, setEndTime]           = useState("12:00")
  const [slotInterval, setSlotInterval] = useState(10)
  const [weighModal, setWeighModal]     = useState<{ slot: Slot; player: { id: number; full_name: string } } | null>(null)
  const [tab, setTab]                   = useState<"convocados" | "slots">("convocados")

  const cfg            = STATUS_CONFIG[session.status] ?? STATUS_CONFIG.draft
  const canEdit        = session.status !== "completed"
  const activeConvocados = convocados.filter(c => !c.cancelled)

  function generateSlots() {
    router.post(`/nutricionista/nutrition_sessions/${session.id}/generate_slots`, {
      start_time: startTime, end_time: endTime, interval: slotInterval,
    }, { preserveScroll: true })
  }

  function publish() {
    if (confirm("¿Publicar la sesión? Se notificará a todos los convocados.")) {
      router.post(`/nutricionista/nutrition_sessions/${session.id}/publish`, {}, { preserveScroll: true })
    }
  }

  function complete() {
    router.post(`/nutricionista/nutrition_sessions/${session.id}/complete`, {}, { preserveScroll: true })
  }

  function addConvocado(playerId: number) {
    router.post(`/nutricionista/nutrition_sessions/${session.id}/add_convocado`, {
      player_id: playerId,
    }, { preserveScroll: true })
  }

  function removeConvocado(playerId: number, name: string) {
    if (confirm(`¿Eliminar a ${name} de los convocados?`)) {
      router.delete(`/nutricionista/nutrition_sessions/${session.id}/remove_convocado`, {
        data: { player_id: playerId }, preserveScroll: true,
      })
    }
  }

  function deleteSession() {
    if (confirm(`¿Eliminar la sesión del ${session.date_display}? Esta acción no se puede deshacer.`)) {
      router.delete(`/nutricionista/nutrition_sessions/${session.id}`)
    }
  }

  return (
    <NutriLayout>
      <Head title={`Sesión ${session.date_display}`} />

      {weighModal && (
        <WeighModal
          slot={weighModal.slot}
          player={weighModal.player}
          sessionId={session.id}
          onClose={() => setWeighModal(null)}
        />
      )}

      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <Link href="/nutricionista/nutrition_sessions" className="flex items-center gap-1 text-bordo-600 hover:text-bordo-800 mb-4 text-sm">
          <ArrowLeft className="h-4 w-4" /> Sesiones
        </Link>

        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-xs text-gray-400 capitalize">{session.day_name}</p>
            <h1 className="text-2xl font-bold text-gray-900">{session.date_display}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className={`text-xs font-semibold rounded-full px-2.5 py-1 ${cfg.classes}`}>{cfg.label}</span>
              <span className="text-xs text-gray-500">
                <Users className="inline h-3.5 w-3.5 mr-1" />
                {session.total_convocados} convocados · {session.total_booked} con turno · capacidad {session.capacity_per_slot}/turno
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            {session.status === "draft" && (
              <button onClick={deleteSession} className="rounded-xl border border-red-200 text-red-500 hover:bg-red-50 px-3 py-2 text-sm font-medium transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            {session.status === "draft" && activeConvocados.length > 0 && slots.length > 0 && (
              <button onClick={publish} className="rounded-xl bg-green-600 text-white px-4 py-2 text-sm font-semibold hover:bg-green-700">
                Publicar y notificar
              </button>
            )}
            {session.status === "published" && (
              <button onClick={complete} className="rounded-xl bg-blue-600 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-700">
                Marcar completada
              </button>
            )}
          </div>
        </div>

        {/* Slot generator */}
        {canEdit && (
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4 mb-6">
            <h2 className="text-xs font-semibold text-gray-400 uppercase mb-3 tracking-wide">Generador de Turnos</h2>
            <div className="flex flex-wrap gap-3 items-end">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Hora inicio</label>
                <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-bordo-300" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Hora fin</label>
                <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-bordo-300" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Intervalo (min)</label>
                <select value={slotInterval} onChange={e => setSlotInterval(Number(e.target.value))}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-bordo-300">
                  {[5, 10, 15, 20, 30].map(v => <option key={v} value={v}>{v} min</option>)}
                </select>
              </div>
              <button onClick={generateSlots} className="rounded-xl bg-bordo-800 text-white px-4 py-2.5 text-sm font-semibold hover:bg-bordo-700">
                {slots.length > 0 ? "Regenerar turnos" : "Generar turnos"}
              </button>
            </div>
            {slots.length > 0 && (
              <p className="mt-2 text-xs text-gray-400">
                <Clock className="inline h-3.5 w-3.5 mr-1" />
                {slots.length} turnos generados · {slots[0].start_time} – {slots[slots.length - 1].end_time} hs
              </p>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-4 border-b border-gray-200">
          {(["convocados", "slots"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium capitalize border-b-2 -mb-px transition-colors ${
                tab === t ? "border-bordo-700 text-bordo-800" : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {t === "convocados" ? `Convocados (${activeConvocados.length})` : `Turnos (${slots.length})`}
            </button>
          ))}
        </div>

        {/* CONVOCADOS TAB — 2 columnas: plantel | convocados */}
        {tab === "convocados" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Plantel disponible (izquierda) */}
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Plantel disponible ({all_players.length})
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Jugadores no convocados a esta sesión</p>
              </div>
              <div className="divide-y divide-gray-50 max-h-125 overflow-y-auto">
                {all_players.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-6">Todos los jugadores están convocados.</p>
                ) : (
                  all_players.map(p => (
                    <div key={p.id} className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{p.full_name}</p>
                        {p.functional_role && <p className="text-xs text-gray-400">{p.functional_role}</p>}
                      </div>
                      {canEdit && (
                        <button onClick={() => addConvocado(p.id)}
                          className="flex items-center gap-1 rounded-lg bg-bordo-50 text-bordo-700 hover:bg-bordo-100 px-2.5 py-1 text-xs font-semibold transition-colors whitespace-nowrap">
                          Convocar <ArrowRight className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Convocados a esta sesión (derecha) */}
            <div className="rounded-2xl bg-white border border-green-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-green-100 bg-green-50">
                <h3 className="text-xs font-semibold text-green-700 uppercase tracking-wide">
                  Convocados ({activeConvocados.length})
                </h3>
                <p className="text-xs text-green-600/70 mt-0.5">Jugadores seleccionados para esta sesión</p>
              </div>
              <div className="divide-y divide-gray-50 max-h-125 overflow-y-auto">
                {convocados.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-6">
                    No hay convocados. Agregá jugadores desde el plantel.
                  </p>
                ) : (
                  convocados.map(c => (
                    <div key={c.id}
                      className={`flex items-center justify-between px-4 py-2.5 ${c.cancelled ? "opacity-40" : "hover:bg-gray-50"}`}>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{c.full_name}</p>
                        {c.role && <p className="text-xs text-gray-400">{c.role}</p>}
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {c.booked && (
                          <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">
                            <CheckCircle className="h-3 w-3" /> {c.slot_time} hs
                          </span>
                        )}
                        {c.pending && (
                          <span className="flex items-center gap-1 text-xs font-medium text-yellow-600 bg-yellow-50 border border-yellow-200 rounded-full px-2 py-0.5">
                            <AlertCircle className="h-3 w-3" /> sin turno
                          </span>
                        )}
                        {c.cancelled && (
                          <span className="text-xs text-red-400 bg-red-50 rounded-full px-2 py-0.5">cancelado</span>
                        )}
                        {canEdit && !c.cancelled && (
                          <button onClick={() => removeConvocado(c.player_id, c.full_name)}
                            className="text-gray-300 hover:text-red-400 transition-colors ml-1">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {session.status === "completed" && c.booked && c.slot_id && (() => {
                          const slot = slots.find(s => s.id === c.slot_id)
                          return slot ? (
                            <button
                              onClick={() => setWeighModal({ slot, player: { id: c.player_id, full_name: c.full_name } })}
                              className="text-bordo-600 hover:text-bordo-800 transition-colors ml-1"
                              title="Cargar pesaje"
                            >
                              <Scale className="h-3.5 w-3.5" />
                            </button>
                          ) : null
                        })()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Slots tab */}
        {tab === "slots" && (
          <div className="space-y-2">
            {slots.length === 0 ? (
              <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-8 text-center">
                <p className="text-sm text-gray-400">No hay turnos generados todavía.</p>
              </div>
            ) : (
              slots.map((slot) => (
                <div key={slot.id} className="rounded-2xl bg-white border border-gray-100 shadow-sm px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-bordo-600 shrink-0" />
                      <span className="text-sm font-semibold text-gray-800">{slot.start_time} – {slot.end_time}</span>
                      <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${
                        slot.booked >= slot.capacity ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"
                      }`}>
                        {slot.booked}/{slot.capacity}
                      </span>
                    </div>
                  </div>
                  {slot.players.length > 0 && (
                    <div className="mt-2 pl-7 flex flex-wrap gap-2">
                      {slot.players.map((p) => (
                        <div key={p.id} className="flex items-center gap-1.5">
                          <span className="text-xs text-gray-600">{p.full_name}</span>
                          <button
                            onClick={() => setWeighModal({ slot, player: p })}
                            className="text-bordo-600 hover:text-bordo-800 transition-colors"
                            title="Cargar pesaje"
                          >
                            <Scale className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </NutriLayout>
  )
}
