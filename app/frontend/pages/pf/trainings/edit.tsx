import { Head, Link, useForm } from "@inertiajs/react"
import { ArrowLeft } from "lucide-react"

import PfLayout from "@/layouts/pf/pf-layout"

import TrainingForm, { FunctionalRole, TrainingFormData } from "./_training-form"

interface Training {
  id: number
  date_raw: string | null
  start_time: string | null
  end_time: string | null
  duration_min: number | null
  training_type: string | null
  objective: string | null
  notes: string | null
  pdf_url: string | null
}

interface Props {
  training: Training
  selected_role_ids: number[]
  category: { id: number; name: string } | null
  functional_roles: FunctionalRole[]
}

export default function PfTrainingsEdit({ training, selected_role_ids, category, functional_roles }: Props) {
  const { data, setData, put, processing } = useForm<TrainingFormData>({
    date:                training.date_raw ?? "",
    start_time:          training.start_time ?? "",
    end_time:            training.end_time ?? "",
    duration_min:        training.duration_min?.toString() ?? "",
    training_type:       training.training_type ?? "fisico",
    objective:           training.objective ?? "",
    notes:               training.notes ?? "",
    functional_role_ids: selected_role_ids,
    pdf_file:            null,
  })

  return (
    <PfLayout>
      <Head title="PF - Editar Entrenamiento" />

      <div className="max-w-2xl space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href={`/pf/trainings/${training.id}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 shadow-sm"
          >
            <ArrowLeft className="h-4 w-4 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Editar Entrenamiento</h1>
            {category && <p className="text-sm text-gray-500 mt-1">Categoria {category.name}</p>}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
          <TrainingForm
            data={data}
            setField={(key, value) => setData(key, value)}
            setRoleIds={(ids) => setData("functional_role_ids", ids)}
            setPdfFile={(f) => setData("pdf_file", f)}
            existing_pdf_url={training.pdf_url}
            onSubmit={(e) => { e.preventDefault(); put(`/pf/trainings/${training.id}`) }}
            processing={processing}
            functional_roles={functional_roles}
            submitLabel="Guardar Cambios"
            cancelHref={`/pf/trainings/${training.id}`}
          />
        </div>
      </div>
    </PfLayout>
  )
}
