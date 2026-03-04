import { Head, Link } from "@inertiajs/react"
import { ArrowLeft, AlertTriangle } from "lucide-react"
import CoachLayout from "@/layouts/coach/coach-layout"

interface Physical {
  weight_kg: number; height_cm: number; muscle_mass_kg: number; fat_mass_kg: number; bmi: number
}
interface Injury {
  type: string; body_zone: string; start_date: string; active: boolean
}
interface Stats2026 {
  matches: number; tries: number; tackles: number
  lineouts_won: number; lineouts_total: number; minutes: number
}
interface Player {
  id: number; first_name: string; last_name: string; functional_role: string
  physical: Physical; injuries: Injury[]; stats_2026: Stats2026
}
interface Props { player: Player }

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-3 text-center shadow-sm">
      <p className="text-xl font-bold text-bordo-800">{value}</p>
      <p className="text-xs text-gray-400 mt-0.5 leading-tight">{label}</p>
    </div>
  )
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })
}

export default function CoachSquadShow({ player }: Props) {
  const initials = `${player.first_name[0]}${player.last_name[0]}`
  const activeInjuries = player.injuries.filter(i => i.active)

  return (
    <CoachLayout>
      <Head title={`${player.first_name} ${player.last_name}`} />

      {/* Hero header */}
      <div className="bg-bordo-800 px-4 pt-12 pb-8 relative">
        <Link href="/coach/squad" className="absolute top-10 left-4 text-white/70 hover:text-white flex items-center gap-1 text-sm">
          <ArrowLeft className="h-4 w-4" /> Plantel
        </Link>
        <div className="flex flex-col items-center text-center mt-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-400 text-bordo-900 text-2xl font-bold shadow-lg">
            {initials}
          </div>
          <h1 className="mt-3 text-xl font-bold text-white">{player.first_name} {player.last_name}</h1>
          <span className="mt-1 rounded-full bg-white/15 px-3 py-1 text-sm font-medium text-white">{player.functional_role}</span>
          <span className="mt-1 rounded-full bg-yellow-400/20 px-3 py-1 text-xs font-semibold text-yellow-300">Plantel Superior</span>
        </div>
      </div>

      <div className="px-4 pt-4 pb-8 space-y-5">

        {/* Lesiones activas */}
        {activeInjuries.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-red-600 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4" /> Lesiones Activas
            </h2>
            <div className="space-y-2">
              {activeInjuries.map((inj, i) => (
                <div key={i} className="rounded-2xl border border-red-100 bg-red-50 p-4">
                  <p className="font-semibold text-red-800 text-sm">{inj.type} — {inj.body_zone}</p>
                  <p className="text-xs text-red-500 mt-0.5">Desde {formatDate(inj.start_date)}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Datos Físicos */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Datos Físicos</h2>
          <div className="grid grid-cols-3 gap-2">
            <StatCard label="Peso (kg)"  value={player.physical.weight_kg} />
            <StatCard label="Talla (cm)" value={player.physical.height_cm} />
            <StatCard label="IMC"        value={player.physical.bmi} />
            <StatCard label="Músculo (kg)" value={player.physical.muscle_mass_kg} />
            <StatCard label="Grasa (kg)"   value={player.physical.fat_mass_kg} />
          </div>
        </section>

        {/* Estadísticas 2026 */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Estadísticas 2026</h2>
          <div className="grid grid-cols-3 gap-2">
            <StatCard label="Partidos"       value={player.stats_2026.matches}       />
            <StatCard label="Tries"          value={player.stats_2026.tries}         />
            <StatCard label="Tackles"        value={player.stats_2026.tackles}       />
            <StatCard label="Minutos"        value={player.stats_2026.minutes}       />
            {player.stats_2026.lineouts_total > 0 && (
              <StatCard label="Lineouts" value={`${player.stats_2026.lineouts_won}/${player.stats_2026.lineouts_total}`} />
            )}
          </div>
        </section>

      </div>
    </CoachLayout>
  )
}
