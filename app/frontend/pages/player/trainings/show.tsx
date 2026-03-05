import { useState } from "react"
import { Head, Link, router } from "@inertiajs/react"
import { ArrowLeft, FileText, ExternalLink } from "lucide-react"

import PlayerLayout from "@/layouts/player/player-layout"

interface Training {
  id: number
  date: string
  date_display: string
  start_time: string | null
  end_time: string | null
  training_type: string | null
  objective: string | null
  notes: string | null
  duration_min: number | null
  for_all: boolean
  target_groups: string[]
  target_roles: string[]
  pdf_url: string | null
}

interface Perception {
  rpe: number | null
  fatigue_level: number | null
  comments: string | null
}

interface Props {
  training: Training
  perception: Perception | null
}

const RPE_LABELS: Record<number, { label: string; color: string }> = {
  1:  { label: "Muy fácil",   color: "bg-green-100 text-green-800 border-green-300" },
  2:  { label: "Fácil",       color: "bg-green-100 text-green-800 border-green-300" },
  3:  { label: "Moderado",    color: "bg-green-100 text-green-800 border-green-300" },
  4:  { label: "Algo duro",   color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
  5:  { label: "Duro",        color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
  6:  { label: "Duro",        color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
  7:  { label: "Muy duro",    color: "bg-orange-100 text-orange-800 border-orange-300" },
  8:  { label: "Muy duro",    color: "bg-orange-100 text-orange-800 border-orange-300" },
  9:  { label: "Extremo",     color: "bg-red-100 text-red-800 border-red-300" },
  10: { label: "Máximo",      color: "bg-red-100 text-red-800 border-red-300" },
}

const GROUP_LABELS: Record<string, string> = { forward: "Forwards", back: "Backs" }

function formatDateLong(dateStr: string) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("es-AR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  })
}

export default function PlayerTrainingShow({ training }: Props) {
  const groupLabels = training.target_groups.map((g) => GROUP_LABELS[g] ?? g)

  return (
    <PlayerLayout>
      <Head title={training.training_type ?? "Entrenamiento"} />

      <div className="bg-white border-b border-gray-100 px-4 pb-4 pt-8">
        <Link href="/player/trainings" className="flex items-center gap-1 text-bordo-600 hover:text-bordo-800 mb-4 text-sm">
          <ArrowLeft className="h-4 w-4" /> Entrenamientos
        </Link>
        <p className="text-xs text-gray-400 tracking-wide">{formatDateLong(training.date)}</p>
        <h1 className="text-2xl font-bold text-gray-900 mt-1 capitalize">{training.training_type ?? "Entrenamiento"}</h1>
        {(training.start_time || training.duration_min) && (
          <p className="text-gray-500 text-sm mt-1">
            {training.start_time && `${training.start_time}${training.end_time ? ` – ${training.end_time}` : ""}`}
            {training.duration_min && ` · ${training.duration_min} min`}
          </p>
        )}
        {/* Target badge */}
        {!training.for_all && (
          <div className="mt-2 flex gap-1.5">
            {groupLabels.length > 0 ? groupLabels.map((l) => (
              <span key={l} className={`text-xs font-semibold rounded-full px-2.5 py-1 border ${
                l === "Forwards" ? "bg-bordo-50 text-bordo-700 border-bordo-200" : "bg-blue-50 text-blue-700 border-blue-200"
              }`}>{l}</span>
            )) : training.target_roles.map((r) => (
              <span key={r} className="text-xs font-medium rounded-full bg-gray-100 text-gray-600 px-2.5 py-1">{r}</span>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 pt-4 pb-8 bg-gray-50 min-h-full space-y-3">
        {training.objective && (
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase mb-2">Objetivo</h2>
            <p className="text-gray-800">{training.objective}</p>
          </div>
        )}

        {training.notes && (
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase mb-2">Notas</h2>
            <p className="text-gray-700 text-sm whitespace-pre-wrap">{training.notes}</p>
          </div>
        )}

        {!training.objective && !training.notes && (
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 text-center">
            <p className="text-sm text-gray-400">Sin detalles adicionales para este entrenamiento.</p>
          </div>
        )}
      </div>
    </PlayerLayout>
  )
}
