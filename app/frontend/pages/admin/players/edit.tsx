import { useState } from "react"
import AdminLayout from "@/layouts/admin/admin-layout"
import { router, Link } from "@inertiajs/react"
import { ArrowLeft, History } from "lucide-react"

interface Option { id: number; name: string }

interface CategoryRecord {
  id: number
  category: string
  season: string
  start_date: string | null
  end_date: string | null
  active: boolean
}

interface Player {
  id: number
  first_name: string
  last_name: string
  full_name: string
  dni: string
  birth_date: string | null        // YYYY-MM-DD for input
  birth_date_display: string | null
  functional_role: string | null
  functional_role_id: number | null
  categories: string[]
  linked_user: { id: number; email: string } | null
}

interface Props {
  player: Player
  category_history: CategoryRecord[]
  functional_roles: Option[]
  categories: Option[]
  genders: Option[]
  current_season: { id: number; name: string } | null
  errors?: Record<string, string[]>
}

export default function AdminPlayersEdit({
  player, category_history, functional_roles, categories, genders, current_season, errors = {}
}: Props) {
  const [form, setForm] = useState({
    first_name: player.first_name ?? "",
    last_name:  player.last_name  ?? "",
    dni:        player.dni        ?? "",
    birth_date: player.birth_date ?? "",
    gender_id:  "",
  })
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedRole,     setSelectedRole]     = useState(String(player.functional_role_id ?? ""))

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.patch(`/admin/players/${player.id}`, {
      player: {
        first_name: form.first_name,
        last_name:  form.last_name,
        dni:        form.dni,
        birth_date: form.birth_date || null,
        gender_id:  form.gender_id  || null,
      },
    })
  }

  const handleAssignCategory = () => {
    if (!selectedCategory) return
    router.post(`/admin/players/${player.id}/assign_category`, { category_id: selectedCategory })
  }

  const handleAssignRole = () => {
    if (!selectedRole) return
    router.post(`/admin/players/${player.id}/assign_role`, { functional_role_id: selectedRole })
  }

  const currentCat = category_history.find((c) => c.active && !c.end_date)

  return (
    <AdminLayout>
      <div className="max-w-2xl space-y-6">
        <Link href="/admin/players" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4" />
          Volver a jugadores
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">{player.full_name ?? `${player.first_name} ${player.last_name}`}</h1>
          <p className="text-sm text-gray-400 font-mono mt-0.5">DNI {player.dni}</p>
          {player.linked_user && (
            <p className="text-sm text-green-600 mt-1">Cuenta vinculada: {player.linked_user.email}</p>
          )}
        </div>

        {/* Datos básicos */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Datos básicos</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Nombre" error={errors.first_name?.[0]}>
                <input className={inputCls} value={form.first_name} onChange={set("first_name")} required />
              </Field>
              <Field label="Apellido" error={errors.last_name?.[0]}>
                <input className={inputCls} value={form.last_name} onChange={set("last_name")} required />
              </Field>
            </div>
            <Field label="DNI" error={errors.dni?.[0]}>
              <input className={inputCls} value={form.dni} onChange={set("dni")} required maxLength={8} />
            </Field>
            <Field label="Fecha de nacimiento">
              <input type="date" className={inputCls} value={form.birth_date ?? ""} onChange={set("birth_date")} />
            </Field>
            <Field label="Género">
              <select className={inputCls} value={form.gender_id} onChange={set("gender_id")}>
                <option value="">Seleccioná…</option>
                {genders.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </Field>
            <div className="flex justify-end pt-2">
              <button type="submit" className="rounded-lg bg-bordo-700 px-5 py-2 text-sm font-semibold text-white hover:bg-bordo-800">
                Guardar datos
              </button>
            </div>
          </form>
        </section>

        {/* Categoría — con historial */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-800 mb-1">Categoría</h2>
          {current_season && (
            <p className="text-xs text-gray-400 mb-4">Temporada activa: {current_season.name}</p>
          )}

          {currentCat ? (
            <div className="mb-4 rounded-lg bg-bordo-50 border border-bordo-200 px-4 py-3 text-sm">
              <span className="font-semibold text-bordo-700">{currentCat.category}</span>
              <span className="text-gray-400 ml-2">desde {currentCat.start_date}</span>
            </div>
          ) : (
            <p className="text-sm text-gray-400 mb-4">Sin categoría asignada en la temporada actual.</p>
          )}

          <div className="flex gap-2">
            <select
              className={inputCls + " flex-1"}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">{currentCat ? "Cambiar categoría…" : "Asignar categoría…"}</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <button
              onClick={handleAssignCategory}
              disabled={!selectedCategory}
              className="rounded-lg bg-bordo-700 px-4 py-2 text-sm font-semibold text-white hover:bg-bordo-800 disabled:opacity-40"
            >
              Asignar
            </button>
          </div>

          {/* Historial */}
          {category_history.length > 0 && (
            <div className="mt-5">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                <History className="h-3.5 w-3.5" />
                Historial
              </div>
              <div className="divide-y divide-gray-100 rounded-lg border border-gray-200 overflow-hidden">
                {category_history.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                    <div>
                      <span className={entry.active && !entry.end_date ? "font-semibold text-bordo-700" : "text-gray-600"}>
                        {entry.category}
                      </span>
                      <span className="text-gray-400 ml-2 text-xs">{entry.season}</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {entry.start_date}{entry.end_date ? ` → ${entry.end_date}` : " → actual"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Rol funcional */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Rol funcional</h2>
          {player.functional_role && (
            <p className="text-sm text-gray-600 mb-3">
              Actual: <span className="font-semibold text-gray-900">{player.functional_role}</span>
            </p>
          )}
          <div className="flex gap-2">
            <select
              className={inputCls + " flex-1"}
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">Seleccioná un rol…</option>
              {functional_roles.map((fr) => <option key={fr.id} value={fr.id}>{fr.name}</option>)}
            </select>
            <button
              onClick={handleAssignRole}
              disabled={!selectedRole}
              className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-900 disabled:opacity-40"
            >
              Asignar
            </button>
          </div>
        </section>
      </div>
    </AdminLayout>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  )
}

const inputCls = "rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-bordo-400"
