import { Head, Link, useForm } from "@inertiajs/react"
import { ArrowLeft } from "lucide-react"

import PfLayout from "@/layouts/pf/pf-layout"

interface Props {
  eval_type: { id: number; name: string; unit: string | null }
}

export default function PfEvalTypesEdit({ eval_type }: Props) {
  const { data, setData, put, processing } = useForm({
    name: eval_type.name,
    unit: eval_type.unit ?? "",
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    put(`/pf/eval_types/${eval_type.id}`)
  }

  return (
    <PfLayout>
      <Head title="PF — Editar Tipo de Evaluación" />

      <div className="max-w-md space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/pf/eval_types" className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 shadow-sm">
            <ArrowLeft className="h-4 w-4 text-gray-600" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Editar Tipo de Evaluación</h1>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Nombre *</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
              required
              placeholder="Ej. Sentadilla, Velocidad 30m, VO2max"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-bordo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Unidad de medida</label>
            <input
              type="text"
              value={data.unit}
              onChange={(e) => setData("unit", e.target.value)}
              placeholder="Ej. kg, seg, ml/kg/min"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-bordo-500 focus:outline-none"
            />
            <p className="mt-1 text-xs text-gray-400">Opcional. Ayuda a interpretar los resultados.</p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={processing}
              className="rounded-lg bg-bordo-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-bordo-600 transition-colors disabled:opacity-60"
            >
              {processing ? "Guardando..." : "Guardar"}
            </button>
            <Link href="/pf/eval_types" className="text-sm text-gray-500 hover:text-gray-700">Cancelar</Link>
          </div>
        </form>
      </div>
    </PfLayout>
  )
}
