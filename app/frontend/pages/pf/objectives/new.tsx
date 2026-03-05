import { Head, Link, useForm } from "@inertiajs/react"
import { ArrowLeft } from "lucide-react"

import PfLayout from "@/layouts/pf/pf-layout"

interface Option { id: number; name: string }
interface TestOption { id: number; name: string; unit: string | null }

interface Props {
  categories: Option[]
  roles: Option[]
  test_types: TestOption[]
}

const THRESHOLD_TYPES = [
  { value: "min", label: "Mayor es mejor (ej. fuerza, velocidad)" },
  { value: "max", label: "Menor es mejor (ej. tiempo, lesiones)" },
]

export default function PfObjectivesNew({ categories, roles, test_types }: Props) {
  const { data, setData, post, processing } = useForm({
    category_id:       "",
    functional_role_id: "",
    physical_test_id:  "",
    green_threshold:   "",
    yellow_threshold:  "",
    threshold_type:    "min",
    start_date:        new Date().toISOString().split("T")[0],
    end_date:          "",
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post("/pf/objectives")
  }

  return (
    <PfLayout>
      <Head title="PF — Nuevo Objetivo Físico" />

      <div className="max-w-xl space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/pf/objectives" className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 shadow-sm">
            <ArrowLeft className="h-4 w-4 text-gray-600" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Nuevo Objetivo Físico</h1>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 space-y-5">
          {/* Categoría + Rol */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Categoría *</label>
              <select required value={data.category_id} onChange={(e) => setData("category_id", e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-bordo-500 focus:outline-none">
                <option value="">Seleccionar...</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Rol funcional *</label>
              <select required value={data.functional_role_id} onChange={(e) => setData("functional_role_id", e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-bordo-500 focus:outline-none">
                <option value="">Seleccionar...</option>
                {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
          </div>

          {/* Prueba física */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Prueba física *</label>
            <select required value={data.physical_test_id} onChange={(e) => setData("physical_test_id", e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-bordo-500 focus:outline-none">
              <option value="">Seleccionar...</option>
              {test_types.map((t) => (
                <option key={t.id} value={t.id}>{t.name}{t.unit ? ` (${t.unit})` : ""}</option>
              ))}
            </select>
          </div>

          {/* Tipo de umbral */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Tipo de evaluación</label>
            <select value={data.threshold_type} onChange={(e) => setData("threshold_type", e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-bordo-500 focus:outline-none">
              {THRESHOLD_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>

          {/* Umbrales */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">Umbral Verde (óptimo)</label>
              <input type="number" step="0.01" value={data.green_threshold}
                onChange={(e) => setData("green_threshold", e.target.value)}
                placeholder="Ej. 140"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-green-400 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1">Umbral Amarillo (aceptable)</label>
              <input type="number" step="0.01" value={data.yellow_threshold}
                onChange={(e) => setData("yellow_threshold", e.target.value)}
                placeholder="Ej. 120"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none" />
            </div>
          </div>
          <p className="text-xs text-gray-400 -mt-2">Por debajo del umbral amarillo = rojo. Dejá vacío si no aplica.</p>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Vigente desde</label>
              <input type="date" value={data.start_date} onChange={(e) => setData("start_date", e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-bordo-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Hasta (opcional)</label>
              <input type="date" value={data.end_date} onChange={(e) => setData("end_date", e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-bordo-500 focus:outline-none" />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={processing}
              className="rounded-lg bg-bordo-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-bordo-600 transition-colors disabled:opacity-60">
              {processing ? "Guardando..." : "Crear objetivo"}
            </button>
            <Link href="/pf/objectives" className="text-sm text-gray-500 hover:text-gray-700">Cancelar</Link>
          </div>
        </form>
      </div>
    </PfLayout>
  )
}
