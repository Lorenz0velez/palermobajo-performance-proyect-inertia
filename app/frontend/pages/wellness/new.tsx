import { Head, useForm, Link } from "@inertiajs/react"
import { ArrowLeft } from "lucide-react"

interface Props {
  errors?: Record<string, string>
  values?: Record<string, string>
  player_name?: string
}

const OPTIONS = {
  sleep: [
    { label: "Excelente", value: "1", emoji: "😴" },
    { label: "Muy Bien",  value: "2", emoji: "😊" },
    { label: "Bien",      value: "3", emoji: "🙂" },
    { label: "Regular",   value: "4", emoji: "😐" },
    { label: "Mal",       value: "5", emoji: "😞" },
  ],
  energy: [
    { label: "Excelente", value: "1", emoji: "⚡" },
    { label: "Muy Bien",  value: "2", emoji: "💪" },
    { label: "Bien",      value: "3", emoji: "👍" },
    { label: "Regular",   value: "4", emoji: "🤔" },
    { label: "Mal",       value: "5", emoji: "😴" },
  ],
  legs: [
    { label: "Livianas",    value: "1", emoji: "🪶" },
    { label: "Normales",    value: "2", emoji: "✅" },
    { label: "Pesadas",     value: "3", emoji: "🦵" },
    { label: "Muy Pesadas", value: "4", emoji: "🪨" },
  ],
  pain: [
    { label: "No",       value: "1", emoji: "✅" },
    { label: "Leve",     value: "2", emoji: "😐" },
    { label: "Moderado", value: "3", emoji: "😟" },
    { label: "Fuerte",   value: "4", emoji: "😣" },
  ],
  movement: [
    { label: "No",      value: "1", emoji: "✅" },
    { label: "Un Poco", value: "2", emoji: "⚠️" },
    { label: "Mucho",   value: "3", emoji: "🚫" },
  ],
  readiness: [
    { label: "Entrenar Normal",      value: "1", emoji: "🏉" },
    { label: "Entrenar Regulando",   value: "2", emoji: "🔄" },
    { label: "Entrenar Muy Liviano", value: "3", emoji: "🚶" },
  ],
}

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
  options: { label: string; value: string; emoji?: string }[]
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
            className={`flex items-center gap-1.5 rounded-xl border-2 px-3 py-2 text-sm font-medium transition-all ${
              value === opt.value
                ? "border-bordo-700 bg-bordo-700 text-white"
                : "border-gray-200 bg-white text-gray-700 hover:border-bordo-300"
            }`}
          >
            {opt.emoji && <span>{opt.emoji}</span>}
            {opt.label}
          </button>
        ))}
      </div>
      {error && <p className="text-xs text-red-500 pt-1">{error}</p>}
    </div>
  )
}

export default function WellnessNew({ errors = {}, values = {}, player_name }: Props) {
  const today = new Date().toISOString().split("T")[0]

  const { data, setData, post, processing } = useForm({
    date: values.date ?? today,
    sleep_quality: values.sleep_quality ?? "",
    energy_level: values.energy_level ?? "",
    leg_feel: values.leg_feel ?? "",
    pain: values.pain ?? "",
    pain_affects_movement: values.pain_affects_movement ?? "",
    training_readiness: values.training_readiness ?? "",
  })

  const showMovement = data.pain !== "" && data.pain !== "1"

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post("/bienestar")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title="Chequeo Diario — Palermo Bajo" />

      <div className="bg-bordo-800 px-4 pb-5 pt-8 text-white">
        <div className="flex items-center gap-3">
          <Link href="/player/home" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bordo-700 hover:bg-bordo-600 transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-400">
            <span className="text-lg font-black text-bordo-900">PB</span>
          </div>
          <div>
            <p className="text-xs text-bordo-200 uppercase tracking-wide">Palermo Bajo</p>
            <h1 className="text-xl font-bold leading-tight">Chequeo Diario</h1>
            {player_name && <p className="text-xs text-bordo-300 mt-0.5">{player_name}</p>}
          </div>
        </div>
        <p className="mt-3 text-sm text-bordo-200">Antes del entrenamiento, completá este formulario (1 min) ✍️</p>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto max-w-lg px-4 py-5 space-y-3">

        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xl">📅</span>
            <p className="font-semibold text-gray-800 text-sm">Fecha</p>
          </div>
          <input
            type="date"
            value={data.date}
            onChange={(e) => setData("date", e.target.value)}
            className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-800 outline-none focus:border-bordo-600 transition-colors text-sm"
            required
          />
        </div>

        <Step number={1} label="¿Cómo dormiste anoche?">
          <Chips options={OPTIONS.sleep} value={data.sleep_quality} onChange={(v) => setData("sleep_quality", v)} error={errors.sleep_quality} />
        </Step>

        <Step number={2} label="¿Cómo sentís tu nivel de energía?">
          <Chips options={OPTIONS.energy} value={data.energy_level} onChange={(v) => setData("energy_level", v)} error={errors.energy_level} />
        </Step>

        <Step number={3} label="¿Cómo sentís las piernas?">
          <Chips options={OPTIONS.legs} value={data.leg_feel} onChange={(v) => setData("leg_feel", v)} error={errors.leg_feel} />
        </Step>

        <Step number={4} label="¿Tenés alguna molestia o dolor?">
          <Chips
            options={OPTIONS.pain}
            value={data.pain}
            onChange={(v) => {
              setData("pain", v)
              if (v === "1") setData("pain_affects_movement", "1")
            }}
            error={errors.pain}
          />
        </Step>

        {showMovement && (
          <Step number={5} label="¿La molestia cambia tu forma de moverte?">
            <Chips options={OPTIONS.movement} value={data.pain_affects_movement} onChange={(v) => setData("pain_affects_movement", v)} error={errors.pain_affects_movement} />
          </Step>
        )}

        <Step number={showMovement ? 6 : 5} label="Hoy sentís que estás para:">
          <Chips options={OPTIONS.readiness} value={data.training_readiness} onChange={(v) => setData("training_readiness", v)} error={errors.training_readiness} />
        </Step>

        <button
          type="submit"
          disabled={processing}
          className="w-full rounded-2xl bg-bordo-800 py-4 font-bold text-white text-base hover:bg-bordo-700 active:bg-bordo-900 transition-colors disabled:opacity-60 shadow-sm"
        >
          {processing ? "Enviando..." : "Enviar Chequeo ✓"}
        </button>

        <p className="text-center text-xs text-gray-400 pb-4">Palermo Bajo Rugby Club · Sistema de Performance</p>
      </form>
    </div>
  )
}

