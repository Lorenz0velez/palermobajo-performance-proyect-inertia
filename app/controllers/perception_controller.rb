# frozen_string_literal: true

class PerceptionController < InertiaController
  skip_before_action :authenticate

  def new
    trainings = recent_trainings
    render inertia: "perception/new", props: { trainings: trainings }
  end

  def create
    # When auth is on: uses Current.user.player. Dev fallback: Player.first
    player = Current.user&.player || Player.first

    unless player
      return render inertia: "perception/new", props: {
        trainings: recent_trainings,
        errors: { base: "No se encontró el perfil de jugador" },
        values: perception_params_safe
      }
    end

    training = Training.find_by(id: params[:training_id])

    unless training
      return render inertia: "perception/new", props: {
        trainings: recent_trainings,
        errors: { training_id: "Seleccioná un entrenamiento" },
        values: perception_params_safe
      }
    end

    perception = TrainingPerception.find_or_initialize_by(
      player_id: player.id,
      training_id: training.id
    )
    perception.assign_attributes(
      rpe:            params[:rpe].to_i,
      perceived_load: params[:rpe].to_i * 60,
      fatigue_level:  params[:fatigue_level].to_i,
      injury_impact:  params[:injury_impact].to_i,
      comments:       params[:comments]&.strip.presence
    )

    if perception.save
      render inertia: "perception/success"
    else
      render inertia: "perception/new", props: {
        trainings: recent_trainings,
        errors: perception.errors.as_json,
        values: perception_params_safe
      }
    end
  end

  private

  def recent_trainings
    Training.order(date: :desc).limit(10).map do |t|
      { id: t.id, label: "#{t.date.strftime('%d/%m/%Y')} — #{t.training_type}" }
    end
  end

  def perception_params_safe
    params.permit(:training_id, :rpe, :fatigue_level, :injury_impact, :comments).to_h
  end
end
