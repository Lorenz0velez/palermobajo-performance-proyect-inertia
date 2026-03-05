import { Head, Link, useForm } from "@inertiajs/react"
import { ArrowLeft, Save } from "lucide-react"
import CoachLayout from "@/layouts/coach/coach-layout"

interface Tournament {
  id: number
  name: string
}

interface Props {
  team_names: string[]
  tournaments: Tournament[]
}

export default function CoachMatchNew({ team_names, tournaments }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    opponent:      "",
    date:          "",
    kickoff_time:  "",
    home:          "true",
    team_name:     team_names[0] ?? "Primera",
    tournament_id: tournaments[0]?.id?.toString() ?? "",
    points_for:    "",
    points_against: "",
  })

  function submit(e: React.FormEvent) {
    e.preventDefault()
    post("/coach/matches")
  }

  return (
    <CoachLayout>
      <Head title="Nuevo Partido" />

      <div className="bg-white border-b border-gray-100 px-4 pb-4 pt-8">
        <Link href="/coach/matches" className="flex items-center gap-1 text-bordo-600 hover:text-bordo-800 mb-4 text-sm">
          <ArrowLeft className="h-4 w-4" /> Todos los partidos
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Nuevo Partido</h1>
      </div>

      <div className="px-4 pt-4 pb-6 bg-gray-50 min-h-full">
        <form onSubmit={submit} className="space-y-4">

          {/* Rival */}
          <div className="rounded-2xl bg-white p-4 border border-gray-100 shadow-sm space-y-4">
            <h2 className="font-semibold text-gray-800 border-b border-gray-100 pb-2">Información del partido</h2>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Rival *</label>
              <input
                type="text"
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-bordo-400"
                value={data.opponent}
                onChange={e => setData("opponent", e.target.value)}
                placeholder="Ej: Regatas, SIC, Hindú..."
                required
              />
              {errors.opponent && <p className="text-xs text-red-500 mt-1">{errors.opponent}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Fecha *</label>
                <input
                  type="date"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-bordo-400"
                  value={data.date}
                  onChange={e => setData("date", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Horario</label>
                <input
                  type="time"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-bordo-400"
                  value={data.kickoff_time}
                  onChange={e => setData("kickoff_time", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Condición</label>
                <select
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-bordo-400"
                  value={data.home}
                  onChange={e => setData("home", e.target.value)}
                >
                  <option value="true">Local</option>
                  <option value="false">Visitante</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Equipo *</label>
                <select
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-bordo-400"
                  value={data.team_name}
                  onChange={e => setData("team_name", e.target.value)}
                >
                  {team_names.map(tn => (
                    <option key={tn} value={tn}>{tn}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Torneo *</label>
              <select
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-bordo-400"
                value={data.tournament_id}
                onChange={e => setData("tournament_id", e.target.value)}
              >
                {tournaments.length === 0 && <option value="">Sin torneos creados</option>}
                {tournaments.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Resultado (opcional) */}
          <div className="rounded-2xl bg-white p-4 border border-gray-100 shadow-sm space-y-4">
            <h2 className="font-semibold text-gray-800 border-b border-gray-100 pb-2">Resultado <span className="text-xs font-normal text-gray-400">(opcional, se carga después del partido)</span></h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Puntos nuestros</label>
                <input
                  type="number"
                  min="0"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-bordo-400"
                  value={data.points_for}
                  onChange={e => setData("points_for", e.target.value)}
                  placeholder="—"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Puntos rival</label>
                <input
                  type="number"
                  min="0"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-bordo-400"
                  value={data.points_against}
                  onChange={e => setData("points_against", e.target.value)}
                  placeholder="—"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={processing}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-bordo-800 py-3.5 font-semibold text-white hover:bg-bordo-700 transition-colors disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {processing ? "Guardando..." : "Crear Partido"}
          </button>
        </form>
      </div>
    </CoachLayout>
  )
}
