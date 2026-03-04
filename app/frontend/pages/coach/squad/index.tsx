import { Head, Link } from "@inertiajs/react"
import { ChevronRight, Search } from "lucide-react"
import CoachLayout from "@/layouts/coach/coach-layout"

interface WellnessToday {
  status: "ok" | "en_observacion" | "en_recuperacion" | "not_loaded"
}

interface Injury {
  type: string
  body_zone: string
  start_date: string
  active: boolean
}

interface Player {
  id: number
  first_name: string
  last_name: string
  functional_role: string
  weight_kg: number
  height_cm: number
  wellness_today: WellnessToday
  injuries: Injury[]
}

interface Props {
  players: Player[]
}

const WELLNESS_CONFIG = {
  ok:              { label: "Ok",            dot: "bg-green-500",  badge: "bg-green-50 text-green-700"  },
  en_observacion:  { label: "Observación",   dot: "bg-yellow-500", badge: "bg-yellow-50 text-yellow-700"},
  en_recuperacion: { label: "Recuperación",  dot: "bg-red-500",    badge: "bg-red-50 text-red-700"     },
  not_loaded:      { label: "Sin cargar",    dot: "bg-gray-300",   badge: "bg-gray-100 text-gray-500"  },
}

const FORWARD_ROLES = ["Pilar Izquierdo", "Hooker", "Pilar Derecho", "Segunda Línea", "Flanker", "Número 8"]

export default function CoachSquadIndex({ players }: Props) {
  const forwards = players.filter(p => FORWARD_ROLES.includes(p.functional_role))
  const backs    = players.filter(p => !FORWARD_ROLES.includes(p.functional_role))

  function PlayerRow({ p }: { p: Player }) {
    const wc = WELLNESS_CONFIG[p.wellness_today.status]
    const hasActiveInjury = p.injuries.some(i => i.active)
    const initials = `${p.first_name[0]}${p.last_name[0]}`
    return (
      <Link href={`/coach/squad/${p.id}`}
        className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-bordo-100 text-bordo-800 text-sm font-bold shrink-0">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-gray-900 text-sm">{p.last_name}, {p.first_name}</p>
              {hasActiveInjury && (
                <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-xs font-semibold text-red-600">Lesión</span>
              )}
            </div>
            <p className="text-xs text-gray-400">{p.functional_role}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${wc.badge}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${wc.dot}`} />
            {wc.label}
          </span>
          <ChevronRight className="h-4 w-4 text-gray-300" />
        </div>
      </Link>
    )
  }

  return (
    <CoachLayout>
      <Head title="Mi Plantel" />

      <div className="bg-white border-b border-gray-100 px-4 pb-4 pt-10">
        <h1 className="text-2xl font-bold text-gray-900">Mi Plantel</h1>
        <p className="text-sm text-gray-400">{players.length} jugadores · Plantel Superior</p>
      </div>

      {/* Search bar (visual only) */}
      <div className="px-4 pt-3 pb-1 bg-white border-b border-gray-50">
        <div className="flex items-center gap-2 rounded-xl bg-gray-100 px-3 py-2">
          <Search className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-400">Buscar jugador...</span>
        </div>
      </div>

      <div className="px-0 pt-3 pb-6 space-y-4">
        {[{ label: "Forwards", group: forwards }, { label: "Backs", group: backs }].map(({ label, group }) => (
          <section key={label}>
            <h2 className="px-4 text-xs font-bold text-bordo-700 uppercase tracking-widest mb-1">{label}</h2>
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm mx-4 overflow-hidden divide-y divide-gray-50">
              {group.map(p => <PlayerRow key={p.id} p={p} />)}
            </div>
          </section>
        ))}
      </div>
    </CoachLayout>
  )
}
