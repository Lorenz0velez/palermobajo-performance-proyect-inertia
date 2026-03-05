import { Head, Link, router } from "@inertiajs/react"
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react"
import { useState } from "react"

import AdminLayout from "@/layouts/admin/admin-layout"

interface User {
  id: number
  email: string
  name: string
  full_name: string
  first_name: string | null
  last_name: string | null
  dni: string | null
  pending_role: string | null
  verified: boolean
  roles: string[]
  created_at: string
}

interface Category {
  id: number
  name: string
}

interface Props {
  user: User
  categories: Category[]
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-800">{value ?? <span className="text-gray-300">—</span>}</dd>
    </div>
  )
}

export default function AdminUsersShow({ user, categories }: Props) {
  const [categoryId, setCategoryId] = useState<string>("")
  const [confirming, setConfirming] = useState(false)

  const isPending = !!user.pending_role
  const roleLabel = user.pending_role === "player" ? "Jugador" : "Entrenador"

  const handleApprove = () => {
    router.post(`/admin/users/${user.id}/approve`, { category_id: categoryId || null })
  }

  const handleReject = () => {
    router.post(`/admin/users/${user.id}/reject`, {})
  }

  return (
    <AdminLayout>
      <Head title={`Admin — ${user.full_name}`} />

      <div className="max-w-2xl space-y-6">
        {/* Back + header */}
        <div className="flex items-center gap-4">
          <Link
            href="/admin/users"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 shadow-sm"
          >
            <ArrowLeft className="h-4 w-4 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.full_name}</h1>
            <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
          </div>
        </div>

        {/* Pending banner */}
        {isPending && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
            <p className="text-sm font-semibold text-amber-800 mb-1">Solicitud pendiente de aprobación</p>
            <p className="text-xs text-amber-600">El usuario quiere registrarse como <b>{roleLabel}</b>.</p>
          </div>
        )}

        {/* Datos del usuario */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Información</h2>
          <dl className="grid grid-cols-2 gap-5">
            <Field label="Email"       value={user.email} />
            <Field label="DNI"         value={user.dni} />
            <Field label="Registrado"  value={user.created_at} />
            <Field label="Verificado"  value={user.verified ? "Sí" : "No"} />
            <Field label="Roles actuales" value={
              user.roles.length > 0
                ? <div className="flex flex-wrap gap-1 mt-1">
                    {user.roles.map((r) => (
                      <span key={r} className="rounded-full bg-bordo-100 px-2 py-0.5 text-xs font-medium text-bordo-700">{r}</span>
                    ))}
                  </div>
                : "Sin roles"
            } />
          </dl>
        </div>

        {/* Approve / Reject section (pending only) */}
        {isPending && (
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-gray-800">Aprobar solicitud</h2>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Categoría</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-bordo-500 focus:outline-none"
              >
                <option value="">Sin categoría asignada</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleApprove}
                className="flex items-center gap-2 rounded-lg bg-bordo-700 px-5 py-2 text-sm font-semibold text-white hover:bg-bordo-600 transition-colors"
              >
                <CheckCircle className="h-4 w-4" />
                Aprobar como {roleLabel}
              </button>

              {confirming ? (
                <>
                  <span className="text-sm text-red-600 self-center">¿Confirmar rechazo?</span>
                  <button
                    onClick={handleReject}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                  >
                    Sí, rechazar
                  </button>
                  <button
                    onClick={() => setConfirming(false)}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setConfirming(true)}
                  className="flex items-center gap-2 rounded-lg border border-red-200 px-5 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <XCircle className="h-4 w-4" />
                  Rechazar
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
