# frozen_string_literal: true

class WellnessController < InertiaController
  skip_before_action :authenticate

  def new
    player = Current.user&.player || Player.first
    render inertia: "wellness/new", props: {
      player_name: player ? "#{player.first_name} #{player.last_name}" : nil
    }
  end

  def create
    # When auth is on: uses Current.user.player. Dev fallback: Player.first
    player = Current.user&.player || Player.first

    unless player
      return render inertia: "wellness/new", props: {
        errors: { base: "No se encontró el perfil de jugador" },
        values: wellness_params_safe
      }
    end

    date = Date.parse(params[:date]) rescue Date.today

    wellness = player.player_wellness.find_or_initialize_by(date: date)
    wellness.assign_attributes(
      sleep_quality:          params[:sleep_quality].to_i,
      energy_level:           params[:energy_level].to_i,
      leg_feel:               params[:leg_feel].to_i,
      pain:                   params[:pain].to_i,
      pain_affects_movement:  params[:pain_affects_movement].to_i,
      training_readiness:     params[:training_readiness].to_i,
      completed_at:           Time.current
    )

    if wellness.save
      render inertia: "wellness/success"
    else
      render inertia: "wellness/new", props: {
        errors: wellness.errors.as_json,
        values: wellness_params_safe
      }
    end
  end

  private

  def wellness_params_safe
    params.permit(:date, :sleep_quality, :energy_level, :leg_feel,
                  :pain, :pain_affects_movement, :training_readiness).to_h
  end
end
