import { useState } from "react"
import { Head, Link, router } from "@inertiajs/react"
import { ArrowLeft } from "lucide-react"

import NutriLayout from "@/layouts/nutricionista/nutri-layout"

export default function NutritionSessionNew() {
  const [date, setDate] = useState("")
  const [capacity, setCapacity] = useState(1)
  const [submitting, setSubmitting] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    router.post("/nutricionista/nutrition_sessions", {
      date,
      capacity_per_slot: capacity,
    }, {
      onError: () => setSubmitting(false),
    })
  }

  return (
    <NutriLayout>
      <Head title="Nueva Sesión de Nutrición" />
      <div className="p-6 max-w-lg mx-auto">
        <Link href="/nutricionista/nutrition_sessions" className="flex items-center gap-1 text-bordo-600 hover:text-bordo-800 mb-6 text-sm">
          <ArrowLeft className="h-4 w-4" /> Volver
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Nueva Sesión de Nutrición</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Fecha</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-bordo-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">
                Capacidad por turno
              </label>
              <p className="text-xs text-gray-400 mb-2">¿Cuántas nutris atienden en simultáneo?</p>
              <div className="flex gap-2">
                {[1, 2].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setCapacity(n)}
                    className={`flex-1 rounded-xl border py-3 text-sm font-bold transition-all ${
                      capacity === n
                        ? "bg-bordo-800 border-bordo-800 text-white"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {n} {n === 1 ? "nutricionista" : "nutricionistas"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!date || submitting}
            className="w-full rounded-xl bg-bordo-800 py-3 text-sm font-semibold text-white hover:bg-bordo-700 transition-colors disabled:opacity-40"
          >
            {submitting ? "Creando..." : "Crear Sesión"}
          </button>
        </form>
      </div>
    </NutriLayout>
  )
}
