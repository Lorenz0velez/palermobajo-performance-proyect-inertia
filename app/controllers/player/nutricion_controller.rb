# frozen_string_literal: true

class Player::NutricionController < Player::ApplicationController
  def index
    player = Current.user&.player || Player.first

    unless player
      return render inertia: "player/nutricion/index", props: {
        history: [], plans: [], latest: nil
      }
    end

    # Latest physical measurements
    history = PhysicalHistory.where(player: player).order(date: :desc).map do |ph|
      fat_pct = ph.fat_mass_kg && ph.weight_kg && ph.weight_kg > 0 ? (ph.fat_mass_kg / ph.weight_kg * 100).round(1) : nil
      {
        id:              ph.id,
        date:            ph.date.strftime("%Y-%m-%d"),
        weight:          ph.weight_kg&.to_f,
        muscle_mass:     ph.muscle_mass_kg&.to_f,
        fat_percentage:  fat_pct,
        height_cm:       ph.height_cm,
        muscle_direction: ph.muscle_direction,
        fat_direction:    ph.fat_direction
      }
    end

    # Nutrition plans (most recent first)
    plans = NutritionPlan.where(player: player).recent.map do |np|
      {
        id:              np.id,
        date:            np.date.strftime("%Y-%m-%d"),
        recommendations: np.recommendations,
        breakfast:       np.breakfast,
        lunch:           np.lunch,
        dinner:          np.dinner,
        snacks:          np.snacks,
        extra_notes:     np.extra_notes
      }
    end

    render inertia: "player/nutricion/index", props: {
      history:         history,
      latest:          history.first,
      plans:           plans,
      latest_plan:     plans.first
    }
  end
end
