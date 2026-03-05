import { useState } from "react"
import { Head, Link, router } from "@inertiajs/react"
import { ArrowLeft, Edit3, UserPlus, X, Save, Users, CheckCircle, BarChart2, FileUp, PenLine } from "lucide-react"
import CoachLayout from "@/layouts/coach/coach-layout"

interface MatchInfo {
  id: number
  date: string
  date_display: string
  weekday: string
  opponent: string
  home: boolean
  team_name: string | null
  kickoff_time: string | null
  points_for: number | null
  points_against: number | null
  squad_count: number
}

interface SquadPlayer {
  id: number
  player_id: number
  full_name: string
  functional_role: string | null
  starter: boolean
  position_id: number | null
  position_name: string | null
  minutes_played: number | null
}

interface AvailablePlayer {
  id: number
  full_name: string
  functional_role: string | null
}

interface Position {
  id: number
  name: string
}

interface Props {
  match: MatchInfo
  squad: SquadPlayer[]
  available: AvailablePlayer[]
  positions: Position[]
}

interface LocalPlayer {
  player_id: number
  full_name: string
  functional_role: string | null
  starter: boolean
  position_id: number | null
}

const TEAM_COLORS: Record<string, string> = {
  "Primera": "bg-bordo-800 text-white",
  "Reserva": "bg-blue-700 text-white",
  "Pre A":   "bg-green-700 text-white",
  "Pre B":   "bg-orange-500 text-white",
}

export default function CoachMatchShow({ match, squad, available, positions }: Props) {
  const [editing, setEditing] = useState(false)
  const [localSquad, setLocalSquad] = useState<LocalPlayer[]>(
    squad.map(s => ({
      player_id:     s.player_id,
      full_name:     s.full_name,
      functional_role: s.functional_role,
      starter:       s.starter,
      position_id:   s.position_id,
    }))
  )
  const [localAvailable, setLocalAvailable] = useState<AvailablePlayer[]>(available)
  const [saving, setSaving] = useState(false)

  const starters = localSquad.filter(p => p.starter)
  const bench    = localSquad.filter(p => !p.starter)

  function addPlayer(p: AvailablePlayer, starter: boolean) {
    setLocalSquad(prev => [...prev, { player_id: p.id, full_name: p.full_name, functional_role: p.functional_role, starter, position_id: null }])
    setLocalAvailable(prev => prev.filter(a => a.id !== p.id))
  }

  function removePlayer(player_id: number) {
    const removed = localSquad.find(p => p.player_id === player_id)
    setLocalSquad(prev => prev.filter(p => p.player_id !== player_id))
    if (removed) {
      setLocalAvailable(prev => [...prev, { id: removed.player_id, full_name: removed.full_name, functional_role: removed.functional_role }])
    }
  }

  function toggleStarter(player_id: number) {
    setLocalSquad(prev => prev.map(p => p.player_id === player_id ? { ...p, starter: !p.starter } : p))
  }

  function setPosition(player_id: number, pos_id: number | null) {
    setLocalSquad(prev => prev.map(p => p.player_id === player_id ? { ...p, position_id: pos_id } : p))
  }

  function saveSquad() {
    setSaving(true)
    router.post(`/coach/matches/${match.id}/update_squad`, {
      players: localSquad.map(p => ({
        player_id:   p.player_id,
        starter:     p.starter,
        position_id: p.position_id,
      }))
    }, {
      onFinish: () => { setSaving(false); setEditing(false) }
    })
  }

  const played = match.points_for != null && match.points_against != null
  const won = played && match.points_for! > match.points_against!
  const teamColor = match.team_name ? (TEAM_COLORS[match.team_name] ?? "bg-gray-700 text-white") : ""

  return (
    <CoachLayout>
      <Head title={`vs. ${match.opponent}`} />

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 pb-4 pt-8">
        <Link href="/coach/matches" className="flex items-center gap-1 text-bordo-600 hover:text-bordo-800 mb-4 text-sm">
          <ArrowLeft className="h-4 w-4" /> Todos los partidos
        </Link>
        <div className="flex items-start justify-between">
          <div>
            {match.team_name && (
              <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold mb-1 ${teamColor}`}>{match.team_name}</span>
            )}
            <p className="text-xs text-gray-400">{match.home ? "Local" : "Visitante"} · {match.date_display}{match.kickoff_time ? ` · ${match.kickoff_time} hs` : ""}</p>
            <h1 className="text-2xl font-bold text-gray-900 mt-0.5">vs. {match.opponent}</h1>
          </div>
          <Link href={`/coach/matches/${match.id}/edit`} className="flex items-center gap-1 text-xs text-gray-500 border border-gray-200 rounded-lg px-2.5 py-1.5 hover:bg-gray-50">
            <Edit3 className="h-3.5 w-3.5" /> Editar
          </Link>
        </div>

        {/* Score */}
        {match.points_for != null && match.points_against != null && (
          <div className="mt-4 flex items-center gap-4">
            <div className="text-center">
              <p className="text-5xl font-black text-bordo-800">{match.points_for}</p>
              <p className="text-xs text-gray-400 mt-1">Palermo</p>
            </div>
            <span className="text-2xl text-gray-300">—</span>
            <div className="text-center">
              <p className="text-5xl font-bold text-gray-400">{match.points_against}</p>
              <p className="text-xs text-gray-400 mt-1">{match.opponent}</p>
            </div>
            <div className="ml-auto">
              <span className={`rounded-full px-4 py-1.5 font-semibold text-sm ${won ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {won ? "Victoria" : "Derrota"}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 pt-4 pb-6 bg-gray-50 min-h-full space-y-4">

        {/* Convocatoria header */}
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <Users className="h-4 w-4 text-bordo-600" />
            Convocatoria <span className="text-sm font-normal text-gray-400">({localSquad.length}/23)</span>
          </h2>
          {!played && (
            !editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 rounded-xl bg-bordo-800 px-3 py-2 text-xs font-semibold text-white hover:bg-bordo-700 transition-colors"
              >
                <Edit3 className="h-3.5 w-3.5" /> Editar convocatoria
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={() => setEditing(false)} className="text-xs text-gray-500 border border-gray-200 rounded-lg px-2.5 py-1.5 hover:bg-gray-100">Cancelar</button>
                <button
                  onClick={saveSquad}
                  disabled={saving}
                  className="flex items-center gap-1.5 rounded-xl bg-green-700 px-3 py-2 text-xs font-semibold text-white hover:bg-green-600 disabled:opacity-60"
                >
                  <Save className="h-3.5 w-3.5" /> {saving ? "Guardando..." : "Guardar"}
                </button>
              </div>
            )
          )}
        </div>

        {/* Stats section — only for played matches */}
        {played && (
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
              <BarChart2 className="h-4 w-4 text-bordo-600" /> Estadísticas del partido
            </h2>
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-bordo-200 bg-bordo-50 px-4 py-3 text-sm font-semibold text-bordo-700 hover:bg-bordo-100 transition-colors">
                <PenLine className="h-4 w-4" /> Carga manual
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-colors">
                <FileUp className="h-4 w-4" /> Importar CSV
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">Próximamente — carga de estadísticas en desarrollo</p>
          </div>
        )}

        {/* Titulares */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100 bg-bordo-50">
            <CheckCircle className="h-4 w-4 text-bordo-700" />
            <h3 className="text-sm font-semibold text-bordo-800">Titulares ({starters.length}/15)</h3>
          </div>
          {starters.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-gray-400">Sin titulares asignados</p>
          )}
          {starters.map(p => (
            <SquadRow key={p.player_id} player={p} editing={editing} positions={positions} onRemove={removePlayer} onToggle={toggleStarter} onPosition={setPosition} />
          ))}
        </div>

        {/* Suplentes */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100 bg-gray-50">
            <Users className="h-4 w-4 text-gray-500" />
            <h3 className="text-sm font-semibold text-gray-700">Suplentes ({bench.length}/8)</h3>
          </div>
          {bench.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-gray-400">Sin suplentes asignados</p>
          )}
          {bench.map(p => (
            <SquadRow key={p.player_id} player={p} editing={editing} positions={positions} onRemove={removePlayer} onToggle={toggleStarter} onPosition={setPosition} />
          ))}
        </div>

        {/* Agregar jugadores (solo en edición) */}
        {editing && (
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-2.5 border-b border-gray-100 bg-blue-50">
              <h3 className="text-sm font-semibold text-blue-800 flex items-center gap-2">
                <UserPlus className="h-4 w-4" /> Disponibles para convocar ({localAvailable.length})
              </h3>
            </div>
            {localAvailable.length === 0 && (
              <p className="px-4 py-6 text-center text-sm text-gray-400">Todos los jugadores convocados</p>
            )}
            {localAvailable.map(p => (
              <div key={p.id} className="flex items-center justify-between px-4 py-2.5 border-b border-gray-50 last:border-b-0">
                <div>
                  <p className="text-sm font-medium text-gray-800">{p.full_name}</p>
                  {p.functional_role && <p className="text-xs text-gray-400">{p.functional_role}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => addPlayer(p, true)}  className="rounded-lg bg-bordo-100 px-2.5 py-1 text-xs font-semibold text-bordo-700 hover:bg-bordo-200">Titular</button>
                  <button onClick={() => addPlayer(p, false)} className="rounded-lg bg-gray-100  px-2.5 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-200">Suplente</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CoachLayout>
  )
}

function SquadRow({
  player, editing, positions, onRemove, onToggle, onPosition
}: {
  player: LocalPlayer
  editing: boolean
  positions: Position[]
  onRemove: (id: number) => void
  onToggle: (id: number) => void
  onPosition: (id: number, pos: number | null) => void
}) {
  return (
    <div className="border-b border-gray-50 last:border-b-0 px-4 py-2.5">
      {editing ? (
        <div className="flex items-center gap-2">
          <button onClick={() => onRemove(player.player_id)} className="shrink-0 rounded-full p-1 text-red-400 hover:bg-red-50">
            <X className="h-4 w-4" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{player.full_name}</p>
            {player.functional_role && <p className="text-xs text-gray-400">{player.functional_role}</p>}
          </div>
          <select
            className="shrink-0 rounded-lg border border-gray-200 text-xs px-2 py-1 focus:outline-none focus:ring-1 focus:ring-bordo-400 max-w-[120px]"
            value={player.position_id ?? ""}
            onChange={e => onPosition(player.player_id, e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Posición…</option>
            {positions.map(pos => (
              <option key={pos.id} value={pos.id}>{pos.name}</option>
            ))}
          </select>
          <button
            onClick={() => onToggle(player.player_id)}
            className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold ${player.starter ? "bg-bordo-100 text-bordo-700" : "bg-gray-100 text-gray-600"}`}
          >
            {player.starter ? "Titular" : "Suplente"}
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-800">{player.full_name}</p>
            {player.functional_role && <p className="text-xs text-gray-400">{player.functional_role}</p>}
          </div>
          {player.position_id && (
            <span className="text-xs text-gray-500 border border-gray-200 rounded-lg px-2 py-0.5">
              {positions.find(p => p.id === player.position_id)?.name ?? "—"}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
