import { Head, useForm } from "@inertiajs/react"

interface Training {
  id: number
  label: string
}

interface Props {
  trainings: Training[]
  errors?: Record<string, string>
  values?: Record<string, string>
}

const RPE_OPTIONS = [
  { label: "1", value: "1", sub: "Reposo" },
  { label: "2", value: "2", sub: "Muy fácil" },
  { label: "3", value: "3", sub: "Fácil" },
  { label: "4", value: "4", sub: "Moderado" },
  { label: "5", value: "5", sub: "Un poco duro" },
  { label: "6", value: "6", sub: "Duro" },
  { label: "7", value: "7", sub: "Muy duro" },
  { label: "8", value: "8", sub: "Muy muy duro" },
  { label: "9", value: "9", sub: "Casi máximo" },
  { label: "10", value: "10", sub: "Máximo absoluto" },
]

const FATIGUE_OPTIONS = [
  { label: "Nada", value: "1", emoji: "😎" },
  { label: "Poco", value: "2", emoji: "🙂" },
  { label: "Moderado", value: "3", emoji: "😤" },
  { label: "Bastante", value: "4", emoji: "😓" },
  { label: "Agotado", value: "5", emoji: "💀" },
]

const INJURY_OPTIONS = [
  { label: "No, ninguno", value: "1", emoji: "✅" },
  { label: "Leve", value: "2", emoji: "😐" },
  { label: "Moderado", value: "3", emoji: "😟" },
  { label: "Fuerte", value: "4", emoji: "😣" },
]

function Step({ number, label, children }: { number: number; label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-bordo-800 text-xs font-bold text-white shrink-0">
          {number}
        </div>
        <p className="font-semibold text-gray-800 text-sm">{label}</p>
      </div>
      {children}
    </div>
  )
}

function Chips({
  options,
  value,
  onChange,
  error,
}: {
  options: { label: string; value: string; emoji?: string; sub?: string }[]
  value: string
  onChange: (v: string) => void
  error?: string
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex flex-col items-center rounded-xl border-2 px-3 py-2 text-sm font-medium transition-all ${
              value === opt.value
                ? "border-bordo-700 bg-bordo-700 text-white"
                : "border-gray-200 bg-white text-gray-700 hover:border-bordo-300"
            }`}
          >
            <span className="flex items-center gap-1">
              {opt.emoji && <span>{opt.emoji}</span>}
              {opt.label}
            </span>
            {opt.sub && (
              <span className={`text-xs mt-0.5 ${value === opt.value ? "text-bordo-200" : "text-gray-400"}`}>
                {opt.sub}
              </span>
            )}
          </button>
        ))}
      </div>
      {error && <p className="text-xs text-red-500 pt-1">{error}</p>}
    </div>
  )
}

export default function PerceptionNew({ trainings, errors = {}, values = {} }: Props) {
  const { data, setData, post, processing } = useForm({
    training_id: values.training_id ?? "",
    rpe: values.rpe ?? "",
    fatigue_level: values.fatigue_level ?? "",
    injury_impact: values.injury_impact ?? "",
    comments: values.comments ?? "",
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post("/percepcion")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title="Percepción del Entrenamiento — Palermo Bajo" />

      <div className="bg-bordo-800 px-4 pb-5 pt-8 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-400">
            <span className="text-lg font-black text-bordo-900">PB</span>
          </div>
          <div> 
            <p className="text-xs text-bordo-200 uppercase tracking-wide">Palermo Bajo</p>
            <h1 className="text-xl font-bold leading-tight">Percepción del Entrenamiento</h1>
          </div>
        </div>
        <p className="mt-3 text-sm text-bordo-200">¿Cómo te sentiste hoy? Completá en 1 minuto 🏉</p>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto max-w-lg px-4 py-5 space-y-3">

        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xl">🏋️</span>
            <p className="font-semibold text-gray-800 text-sm">Entrenamiento</p>
          </div>
          {trainings.length === 0 ? (
            <p className="text-sm text-gray-400 rounded-xl border-2 border-dashed border-gray-200 px-4 py-3">
              No hay entrenamientos disponibles por el momento.
            </p>
          ) : (
            <select
              value={data.training_id}
              onChange={(e) => setData("training_id", e.target.value)}
              className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-800 outline-none focus:border-bordo-600 transition-colors text-sm"
              required
            >
              <option value="">Seleccioná un entrenamiento</option>
              {trainings.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          )}
          {errors.training_id && <p className="text-xs text-red-500 mt-1">{errors.training_id}</p>}
        </div>

        <Step number={1} label="¿Cómo sentiste el entrenamiento? (RPE)">
          <Chips options={RPE_OPTIONS} value={data.rpe} onChange={(v) => setData("rpe", v)} error={errors.rpe} />
        </Step>

        <Step number={2} label="¿Cómo quedaste de cansancio?">
          <Chips options={FATIGUE_OPTIONS} value={data.fatigue_level} onChange={(v) => setData("fatigue_level", v)} error={errors.fatigue_level} />
        </Step>

        <Step number={3} label="¿Recibiste algún golpe o tenés molestia?">
          <Chips options={INJURY_OPTIONS} value={data.injury_impact} onChange={(v) => setData("injury_impact", v)} error={errors.injury_impact} />
        </Step>

        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xl">💬</span>
            <p className="font-semibold text-gray-800 text-sm">
              Comentarios <span className="text-gray-400 font-normal">(opcional)</span>
            </p>
          </div>
          <textarea
            rows={3}
            placeholder="Contanos algo más sobre cómo te sentiste..."
            value={data.comments}
            onChange={(e) => setData("comments", e.target.value)}
            className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-800 outline-none focus:border-bordo-600 transition-colors resize-none text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={processing}
          className="w-full rounded-2xl bg-bordo-800 py-4 font-bold text-white text-base hover:bg-bordo-700 active:bg-bordo-900 transition-colors disabled:opacity-60 shadow-sm"
        >
          {processing ? "Enviando..." : "Enviar Percepción ✓"}
        </button>

        <p className="text-center text-xs text-gray-400 pb-4">Palermo Bajo Rugby Club · Sistema de Performance</p>
      </form>
    </div>
  )
}
