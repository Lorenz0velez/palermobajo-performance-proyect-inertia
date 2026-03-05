import { Head, Link, useForm } from "@inertiajs/react"
import { ArrowLeft } from "lucide-react"

import PfLayout from "@/layouts/pf/pf-layout"

import TrainingForm, { FunctionalRole, TrainingFormData } from "./_training-form"

interface Props {
  category: { id: number; name: string } | null
  today: string
  functional_roles: FunctionalRole[]
}

export default function PfTrainingsNew({ category, today, functional_roles }: Props) {
  const { data, setData, post, processing } = useForm<TrainingFormData>({
    date:                today,
    start_time:          "",
    end_time:            "",
    duration_min:        "",
    training_type:       "fisico",
    objective:           "",
    notes:               "",
    functional_role_ids: [],
    pdf_file:            null,
  })

  return (
    <PfLayout>
      <Head title="PF - Nuevo Entrenamiento" />

      <div className="max-w-2xl space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/pf/trainings" className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 shadow-sm">
            <ArrowLeft className="h-4 w-4 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Nuevo Entrenamiento</h1>
            {category && <p className="text-sm text-gray-500 mt-1">Categoria {category.name}</p>}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
          <TrainingForm
            data={data}
            setField={(key, value) => setData(key, value)}
            setRoleIds={(ids) => setData("functional_role_ids", ids)}
            setPdfFile={(f) => setData("pdf_file", f)}
            onSubmit={(e) => { e.preventDefault(); post("/pf/trainings") }}
            processing={processing}
            functional_roles={functional_roles}
            submitLabel="Crear Entrenamiento"
            cancelHref="/pf/trainings"
          />
        </div>
      </div>
    </PfLayout>
  )
}
