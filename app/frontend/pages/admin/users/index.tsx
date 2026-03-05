import { useState } from "react"
import AdminLayout from "@/layouts/admin/admin-layout"
import { router } from "@inertiajs/react"
import { CheckCircle, XCircle } from "lucide-react"

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
  pending: User[]
  approved: User[]
  categories: Category[]
}

export default function AdminUsersIndex({ pending, approved, categories }: Props) {
  const [tab, setTab] = useState<"pending" | "approved">("pending")

  return (
    <AdminLayout>
      <div className="max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 mb-6">
          <TabBtn active={tab === "pending"} onClick={() => setTab("pending")} badge={pending.length}>
            Pendientes
          </TabBtn>
          <TabBtn active={tab === "approved"} onClick={() => setTab("approved")}>
            Aprobados
          </TabBtn>
        </div>

        {tab === "pending" && (
          pending.length === 0 ? (
            <p className="text-gray-500 text-sm">No hay solicitudes pendientes.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {pending.map((u) => (
                <PendingCard key={u.id} user={u} categories={categories} />
              ))}
            </div>
          )
        )}

        {tab === "approved" && (
          approved.length === 0 ? (
            <p className="text-gray-500 text-sm">No hay usuarios aprobados.</p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Nombre</th>
                    <th className="px-4 py-3 text-left font-medium">Email</th>
                    <th className="px-4 py-3 text-left font-medium">DNI</th>
                    <th className="px-4 py-3 text-left font-medium">Roles</th>
                    <th className="px-4 py-3 text-left font-medium">Alta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {approved.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{u.full_name}</td>
                      <td className="px-4 py-3 text-gray-500">{u.email}</td>
                      <td className="px-4 py-3 text-gray-500">{u.dni ?? "—"}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {u.roles.map((r) => (
                            <span key={r} className="rounded-full bg-bordo-100 px-2 py-0.5 text-xs font-medium text-bordo-700">{r}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-400">{u.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </AdminLayout>
  )
}

function TabBtn({ active, onClick, badge, children }: { active: boolean; onClick: () => void; badge?: number; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
        active ? "border-bordo-700 text-bordo-700" : "border-transparent text-gray-500 hover:text-gray-700"
      }`}
    >
      {children}
      {badge != null && badge > 0 && (
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">{badge}</span>
      )}
    </button>
  )
}

function PendingCard({ user, categories }: { user: User; categories: Category[] }) {
  const [categoryId, setCategoryId] = useState<string>("")
  const [confirming, setConfirming] = useState<"approve" | "reject" | null>(null)

  const handleApprove = () => {
    router.post(
      `/admin/users/${user.id}/approve`,
      { category_id: categoryId || null },
      { preserveScroll: true }
    )
  }

  const handleReject = () => {
    router.post(`/admin/users/${user.id}/reject`, {}, { preserveScroll: true })
  }

  const roleLabel = user.pending_role === "player" ? "Jugador" : "Entrenador"
  const roleColor = user.pending_role === "player" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"

  return (
    <div className="rounded-xl border border-amber-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">{user.full_name}</span>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${roleColor}`}>{roleLabel}</span>
          </div>
          <span className="text-sm text-gray-500">{user.email}</span>
          <div className="flex items-center gap-4 text-xs text-gray-400 mt-0.5">
            {user.dni && <span>DNI: <b className="text-gray-700">{user.dni}</b></span>}
            <span>Solicitado: {user.created_at}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:items-end">
          {/* Category selector */}
          <select
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm w-full sm:w-56"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Sin categoría asignada</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <div className="flex gap-2">
            {confirming === "reject" ? (
              <>
                <span className="text-xs text-red-600 self-center">¿Confirmar rechazo?</span>
                <button onClick={handleReject} className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700">Sí, rechazar</button>
                <button onClick={() => setConfirming(null)} className="rounded-lg border px-3 py-1.5 text-xs">Cancelar</button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setConfirming("reject")}
                  className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Rechazar
                </button>
                <button
                  onClick={handleApprove}
                  className="flex items-center gap-1 rounded-lg bg-bordo-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-bordo-800"
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  Aprobar como {roleLabel}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
