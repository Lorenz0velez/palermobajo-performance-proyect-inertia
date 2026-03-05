import { Head } from "@inertiajs/react"
import { User, AlertTriangle } from "lucide-react"
import PlayerLayout from "@/layouts/player/player-layout"

interface Player {
  first_name: string
  last_name: string
  dni: string | null
  birth_date: string | null
  functional_role: string | null
  category: string | null
}

interface Physical {
  weight_kg: number | null
  height_cm: number | null
  muscle_mass_kg: number | null
  fat_mass_kg: number | null
}

interface Injury {
  type: string
  body_zone: string
  start_date: string
  end_date: string | null
}

interface Props {
  player: Player
  physical: Physical | null
  injuries: Injury[]
}

// Parse ISO date string (YYYY-MM-DD) as LOCAL date to avoid UTC off-by-one in timezones behind UTC
function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number)
  return new Date(y, m - 1, d)
}

function formatDate(dateStr: string) {
  return parseLocalDate(dateStr).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })
}

function age(birth: string) {
  const today = new Date()
  const b = parseLocalDate(birth)
  let a = today.getFullYear() - b.getFullYear()
  const m = today.getMonth() - b.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < b.getDate())) a--
  return a
}

function PhysRow({ label, value, unit }: { label: string; value: number | null; unit?: string }) {
  if (value == null) return null
  return (
    <div className="flex items-center justify-between py-2.5 border-b last:border-0 border-gray-100">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold text-gray-900">
        {value} {unit && <span className="text-xs text-gray-400 font-normal">{unit}</span>}
      </span>
    </div>
  )
}

export default function PlayerProfile({ player, physical, injuries }: Props) {
  const fullName = `${player.first_name} ${player.last_name}`
  const initials = `${player.first_name[0]}${player.last_name[0]}`.toUpperCase()

  return (
    <PlayerLayout>
      <Head title="Mi Perfil" />

      <div className="bg-white border-b border-gray-100 px-4 pb-5 pt-8 text-center">
        <div className="mx-auto h-20 w-20 rounded-full bg-bordo-800 flex items-center justify-center text-yellow-400 text-3xl font-bold shadow-md">
          {initials}
        </div>
        <h1 className="text-xl font-bold text-gray-900 mt-3">{fullName}</h1>
        <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
          {player.category && (
            <span className="rounded-full bg-bordo-100 text-bordo-800 px-3 py-1 text-xs font-semibold">{player.category}</span>
          )}
          {player.functional_role && (
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">{player.functional_role}</span>
          )}
        </div>
      </div>

      <div className="px-4 pt-4 pb-4 bg-gray-50 min-h-full space-y-3">
        {/* Personal info */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3 flex items-center gap-2">
            <User className="h-4 w-4" /> Datos personales
          </h2>
          {player.birth_date && (
            <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
              <span className="text-gray-600">Fecha de nacimiento</span>
              <span className="font-semibold text-gray-900 text-sm">
                {formatDate(player.birth_date)} <span className="text-gray-400 font-normal">({age(player.birth_date)} años)</span>
              </span>
            </div>
          )}
          {player.dni && (
            <div className="flex items-center justify-between py-2.5">
              <span className="text-gray-600">DNI</span>
              <span className="font-semibold text-gray-900">{player.dni}</span>
            </div>
          )}
          {!player.birth_date && !player.dni && (
            <p className="text-sm text-gray-400">Sin datos personales registrados</p>
          )}
        </div>

        {/* Physical measurements */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Composición corporal</h2>
          {physical == null ? (
            <p className="text-sm text-gray-400 mt-2">Sin mediciones registradas</p>
          ) : (
            <>
              <PhysRow label="Peso" value={physical.weight_kg} unit="kg" />
              <PhysRow label="Altura" value={physical.height_cm} unit="cm" />
              <PhysRow label="Masa muscular" value={physical.muscle_mass_kg} unit="kg" />
              <PhysRow label="Masa grasa" value={physical.fat_mass_kg} unit="kg" />
            </>
          )}
        </div>

        {/* Active injuries */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4 pb-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-400" /> Lesiones activas
          </h2>
          {injuries.length === 0 ? (
            <p className="text-sm text-green-600 font-medium">Sin lesiones activas ✓</p>
          ) : (
            <div className="space-y-3">
              {injuries.map((inj, i) => (
                <div key={i} className="rounded-xl bg-orange-50 border border-orange-100 p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{inj.type}</p>
                      <p className="text-xs text-gray-500">{inj.body_zone}</p>
                    </div>
                    <span className="text-xs text-orange-600 font-medium">
                      Desde {formatDate(inj.start_date)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PlayerLayout>
  )
}
