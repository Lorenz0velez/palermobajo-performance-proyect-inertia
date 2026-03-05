# frozen_string_literal: true

class Player::EvaluacionesController < Player::ApplicationController
  def index
    # Dev fallback: Current.user.player or first player
    player = Current.user&.player || Player.first

    unless player
      return render inertia: "player/evaluaciones/index", props: { evaluations: [], objectives: [], test_types: [] }
    end

    # Current category + functional role for the player
    current_role     = player.functional_role
    current_category = player.player_categories.where(active: true, end_date: nil).includes(:category).last&.category

    # All physical evaluations for this player, grouped by test
    test_types = PhysicalTest.order(:name)

    evaluations_by_test = PhysicalEvaluation
      .where(player: player)
      .includes(:physical_test)
      .order(date: :desc)
      .group_by(&:physical_test_id)

    # Objectives for this player's category + role
    objectives = []
    if current_category && current_role
      objectives = PhysicalObjective
        .includes(:physical_test)
        .where(category: current_category, functional_role: current_role)
        .where("end_date IS NULL OR end_date >= ?", Date.today)
        .index_by(&:physical_test_id)
    end

    eval_data = test_types.map do |t|
      history = (evaluations_by_test[t.id] || []).map do |e|
        {
          date:  e.date.strftime("%d/%m/%Y"),
          value: e.value
        }
      end
      latest = history.first
      obj    = objectives[t.id]

      status = if obj && latest
        obj.status_for(latest[:value])&.to_s
      end

      {
        test_id:          t.id,
        test_name:        t.name,
        test_unit:        t.unit,
        latest_value:     latest&.dig(:value),
        latest_date:      latest&.dig(:date),
        green_threshold:  obj&.green_threshold,
        yellow_threshold: obj&.yellow_threshold,
        threshold_type:   obj&.threshold_type,
        status:           status,
        history:          history
      }
    end.select { |e| e[:history].any? || objectives[e[:test_id]] }

    render inertia: "player/evaluaciones/index", props: {
      evaluations:      eval_data,
      category_name:    current_category&.name,
      functional_role:  current_role&.name
    }
  end
end
