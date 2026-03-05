import { useState } from "react"
import AdminLayout from "@/layouts/admin/admin-layout"
import { router, Link } from "@inertiajs/react"
import { ArrowLeft } from "lucide-react"

interface Option { id: number; name: string }

interface Props {
  genders: Option[]
  errors?: Record<string, string[]>
}

export default function AdminPlayersNew({ genders, errors = {} }: Props) {
  const [form, setForm] = useState({
    first_name: "",
    last_name:  "",
    dni:        "",
    birth_date: "",
    gender_id:  "",
  })

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.post("/admin/players", {
      player: {
        first_name: form.first_name,
        last_name:  form.last_name,
        dni:        form.dni,
        birth_date: form.birth_date || null,
        gender_id:  form.gender_id  || null,
      },
    })
  }

  return (
    <AdminLayout>
      <div className="max-w-xl">
        <Link href="/admin/players" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-5">
          <ArrowLeft className="h-4 w-4" />
          Volver a jugadores
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Nuevo jugador</h1>
        <p className="text-sm text-gray-500 mb-6">
          Solo ingresás los datos básicos. La categoría y el rol se asignan desde la ficha del jugador.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nombre" error={errors.first_name?.[0]}>
              <input className={inputCls} value={form.first_name} onChange={set("first_name")} placeholder="Ej: Martín" required />
            </Field>
            <Field label="Apellido" error={errors.last_name?.[0]}>
              <input className={inputCls} value={form.last_name} onChange={set("last_name")} placeholder="Ej: García" required />
            </Field>
          </div>

          <Field label="DNI" error={errors.dni?.[0]}>
            <input className={inputCls} value={form.dni} onChange={set("dni")} placeholder="xxxxxxxx" required maxLength={8} />
          </Field>

          <Field label="Fecha de nacimiento" error={errors.birth_date?.[0]}>
            <input type="date" className={inputCls} value={form.birth_date} onChange={set("birth_date")} />
          </Field>

          <Field label="Género">
            <select className={inputCls} value={form.gender_id} onChange={set("gender_id")}>
              <option value="">Seleccioná…</option>
              {genders.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </Field>

          <div className="flex gap-3 pt-2 justify-end">
            <Link href="/admin/players" className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancelar
            </Link>
            <button type="submit" className="rounded-lg bg-bordo-700 px-5 py-2 text-sm font-semibold text-white hover:bg-bordo-800">
              Crear jugador
            </button>
          </div>
        </form>
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
