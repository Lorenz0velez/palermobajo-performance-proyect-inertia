# frozen_string_literal: true

class Pf::EvalTypesController < Pf::ApplicationController
  def index
    sport = Sport.find_by(name: "Rugby") || Sport.first
    types = PhysicalTest.where(sport: sport).order(:name)

    render inertia: "pf/eval_types/index", props: {
      types: types.map { |t| { id: t.id, name: t.name, unit: t.unit, active: t.active } }
    }
  end

  def new
    render inertia: "pf/eval_types/new"
  end

  def create
    sport = Sport.find_by(name: "Rugby") || Sport.first
    test  = PhysicalTest.new(name: params[:name], unit: params[:unit].presence, sport: sport)

    if test.save
      redirect_to pf_eval_types_path, notice: "Tipo creado."
    else
      redirect_to new_pf_eval_type_path, alert: "Error: #{test.errors.full_messages.join(', ')}"
    end
  end

  def edit
    test = PhysicalTest.find(params[:id])
    render inertia: "pf/eval_types/edit", props: { eval_type: { id: test.id, name: test.name, unit: test.unit } }
  end

  def update
    test = PhysicalTest.find(params[:id])
    if test.update(name: params[:name], unit: params[:unit].presence)
      redirect_to pf_eval_types_path, notice: "Tipo actualizado."
    else
      redirect_to edit_pf_eval_type_path(test), alert: "Error: #{test.errors.full_messages.join(', ')}"
    end
  end

  def toggle
    test = PhysicalTest.find(params[:id])
    test.update!(active: !test.active)
    redirect_to pf_eval_types_path,
      notice: "#{test.name} #{test.active? ? 'activado' : 'desactivado'}."
  end
end
