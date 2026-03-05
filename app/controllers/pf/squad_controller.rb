# frozen_string_literal: true

class Pf::SquadController < Pf::ApplicationController
  def index
    players = category_players.includes(:physical_evaluations)

    # Only show tests marked as active
    test_types = PhysicalTest.where(active: true).order(:name)
    test_names = test_types.map { |t| { id: t.id, name: t.name, unit: t.unit } }

    players_data = players.map do |p|
      latest_evals = p.physical_evaluations
                      .group_by(&:physical_test_id)
                      .transform_values { |evals| evals.max_by(&:date) }

      {
        id:              p.id,
        full_name:       p.full_name,
        functional_role: p.functional_role&.name,
        evals: test_types.map do |t|
          ev = latest_evals[t.id]
          { test_id: t.id, value: ev&.value, date: ev&.date&.strftime("%d/%m") }
        end
      }
    end

    render inertia: "pf/squad/index", props: {
      players:    players_data,
      test_types: test_names,
      category:   current_category ? { id: current_category.id, name: current_category.name } : nil
    }
  end

  def show
    player     = Player.includes(:functional_role, :physical_histories).find(params[:id])
    test_types = PhysicalTest.where(active: true).order(:name)
    category   = current_category

    history_by_test = PhysicalEvaluation
      .where(player: player)
      .includes(:physical_test)
      .order(date: :desc)
      .group_by(&:physical_test_id)
      .transform_values do |evals|
        evals.map { |e| { date: e.date.strftime("%d/%m/%Y"), value: e.value } }
      end

    # Peso más reciente del jugador (para calcular objetivos por peso corporal)
    latest_weight = player.physical_histories.order(date: :desc).first&.weight_kg

    # Objetivos para el rol funcional + categoría del jugador
    raw_objectives = PhysicalObjective
      .where(functional_role: player.functional_role, category: category)
      .index_by(&:physical_test_id)

    objectives_by_test = test_types.each_with_object({}) do |t, hash|
      obj = raw_objectives[t.id]
      next unless obj

      red    = obj.red_threshold&.to_f
      yellow = obj.yellow_threshold&.to_f
      green  = obj.green_threshold&.to_f

      if obj.formula == "weight_ratio" && latest_weight
        w = latest_weight.to_f
        red    = (red    * w).round(1) if red
        yellow = (yellow * w).round(1) if yellow
        green  = (green  * w).round(1) if green
      end

      hash[t.id] = {
        red:            red,
        yellow:         yellow,
        green:          green,
        threshold_type: obj.threshold_type,   # "min" | "max"
        formula:        obj.formula
      }
    end

    render inertia: "pf/squad/show", props: {
      player: {
        id:              player.id,
        full_name:       player.full_name,
        dni:             player.dni,
        functional_role: player.functional_role&.name,
        birth_date:      player.birth_date&.strftime("%d/%m/%Y"),
        weight_kg:       latest_weight&.to_f
      },
      test_types:        test_types.map { |t| { id: t.id, name: t.name, unit: t.unit } },
      history_by_test:   history_by_test,
      objectives_by_test: objectives_by_test,
      today:             Date.today.strftime("%Y-%m-%d")
    }
  end

  def evaluate
    player = Player.find(params[:id])
    ev = PhysicalEvaluation.find_or_initialize_by(
      player_id:       player.id,
      physical_test_id: params[:physical_test_id],
      date:            params[:date]
    )
    ev.value         = params[:value]
    ev.validated     = false

    if ev.save
      redirect_to pf_squad_path(player), notice: "Evaluación guardada."
    else
      redirect_to pf_squad_path(player), alert: "Error: #{ev.errors.full_messages.join(', ')}"
    end
  end
end
