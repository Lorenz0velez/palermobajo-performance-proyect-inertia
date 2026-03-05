# frozen_string_literal: true

class Pf::ObjectivesController < Pf::ApplicationController
  def index
    sport = Sport.find_by(name: "Rugby") || Sport.first

    # All objectives, ordered by category + role + test
    objectives = PhysicalObjective
      .includes(:category, :functional_role, :physical_test)
      .where(physical_tests: { sport_id: sport&.id })
      .joins(:physical_test)
      .order("categories.name, functional_roles.name, physical_tests.name")

    categories     = Category.order(:name).map { |c| { id: c.id, name: c.name } }
    roles          = FunctionalRole.where(sport: sport).order(:name).map { |r| { id: r.id, name: r.name } }
    test_types     = PhysicalTest.where(sport: sport).order(:name).map { |t| { id: t.id, name: t.name, unit: t.unit } }

    render inertia: "pf/objectives/index", props: {
      objectives: objectives.map { |obj| serialize_objective(obj) },
      categories: categories,
      roles:      roles,
      test_types: test_types
    }
  end

  def new
    sport          = Sport.find_by(name: "Rugby") || Sport.first
    categories     = Category.order(:name).map { |c| { id: c.id, name: c.name } }
    roles          = FunctionalRole.where(sport: sport).order(:name).map { |r| { id: r.id, name: r.name } }
    test_types     = PhysicalTest.where(sport: sport).order(:name).map { |t| { id: t.id, name: t.name, unit: t.unit } }

    render inertia: "pf/objectives/new", props: {
      categories: categories,
      roles:      roles,
      test_types: test_types
    }
  end

  def create
    obj = PhysicalObjective.new(
      category_id:      params[:category_id],
      functional_role_id: params[:functional_role_id],
      physical_test_id: params[:physical_test_id],
      green_threshold:  params[:green_threshold].presence,
      yellow_threshold: params[:yellow_threshold].presence,
      threshold_type:   params[:threshold_type].presence || "min",
      start_date:       params[:start_date].presence || Date.today,
      end_date:         params[:end_date].presence
    )

    if obj.save
      redirect_to pf_objectives_path, notice: "Objetivo creado."
    else
      redirect_to new_pf_objective_path, alert: "Error: #{obj.errors.full_messages.join(', ')}"
    end
  end

  private

  def serialize_objective(obj)
    {
      id:              obj.id,
      category:        obj.category.name,
      functional_role: obj.functional_role.name,
      test_name:       obj.physical_test.name,
      test_unit:       obj.physical_test.unit,
      green_threshold: obj.green_threshold,
      yellow_threshold: obj.yellow_threshold,
      threshold_type:  obj.threshold_type,
      start_date:      obj.start_date&.strftime("%d/%m/%Y"),
      end_date:        obj.end_date&.strftime("%d/%m/%Y")
    }
  end
end
