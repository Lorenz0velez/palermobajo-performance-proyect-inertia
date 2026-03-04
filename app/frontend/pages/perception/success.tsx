import { Head, Link } from "@inertiajs/react"

export default function PerceptionSuccess() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
      <Head title="¡Gracias! — Palermo Bajo" />

      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
        <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>

      <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400">
        <span className="text-lg font-black text-bordo-900">PB</span>
      </div>

      <h1 className="mt-4 text-2xl font-bold text-gray-900">¡Gracias!</h1>
      <p className="mt-2 text-gray-500 max-w-xs">
        Tu percepción del entrenamiento fue registrada. ¡Buen descanso!
      </p>

      <Link
        href="/percepcion"
        className="mt-8 rounded-xl bg-bordo-700 px-6 py-3 font-semibold text-white hover:bg-bordo-600 transition-colors"
      >
        Cargar otra percepción
      </Link>
    </div>
  )
}
