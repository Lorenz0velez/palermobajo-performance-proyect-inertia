# frozen_string_literal: true

class Nutricionista::SquadController < Nutricionista::ApplicationController
  def index
    players = all_players.includes(:physical_histories, :functional_role)

    latest_by_player = latest_pesaje_by_player(players.pluck(:id))

    render inertia: "nutricionista/squad/index", props: {
      players: players.map { |p| serialize_player(p, latest_by_player[p.id]) }
    }
  end

  def show
    player  = Player.includes(:functional_role).find(params[:id])
    history = PhysicalHistory.where(player: player).order(date: :desc).map do |ph|
      {
        id:              ph.id,
        date:            ph.date.strftime("%d/%m/%Y"),
        date_raw:        ph.date.strftime("%Y-%m-%d"),
        weight_kg:       ph.weight_kg,
        muscle_mass_kg:  ph.muscle_mass_kg,
        fat_mass_kg:     ph.fat_mass_kg,
        height_cm:       ph.height_cm,
        muscle_direction: ph.muscle_direction,
        fat_direction:    ph.fat_direction
      }
    end

    plans = NutritionPlan.where(player: player).recent.map do |np|
      {
        id:              np.id,
        date:            np.date.strftime("%d/%m/%Y"),
        date_raw:        np.date.strftime("%Y-%m-%d"),
        recommendations: np.recommendations,
        breakfast:       np.breakfast,
        lunch:           np.lunch,
        dinner:          np.dinner,
        snacks:          np.snacks,
        extra_notes:     np.extra_notes
      }
    end

    render inertia: "nutricionista/squad/show", props: {
      player: {
        id:              player.id,
        full_name:       player.full_name,
        dni:             player.dni,
        functional_role: player.functional_role&.name,
        birth_date:      player.birth_date&.strftime("%d/%m/%Y")
      },
      history: history,
      plans:   plans,
      today:   Date.today.strftime("%Y-%m-%d")
    }
  end

  def weigh
    player = Player.find(params[:id])

    ph = PhysicalHistory.find_or_initialize_by(player: player, date: params[:date])
    ph.weight_kg         = params[:weight_kg].presence
    ph.muscle_mass_kg    = params[:muscle_mass_kg].presence
    ph.fat_mass_kg       = params[:fat_mass_kg].presence
    ph.muscle_direction  = params[:muscle_direction].presence
    ph.fat_direction     = params[:fat_direction].presence
    ph.height_cm         = params[:height_cm].presence if params[:height_cm].present?

    if ph.save
      redirect_to nutricionista_squad_path(player), notice: "Pesaje guardado."
    else
      redirect_to nutricionista_squad_path(player), alert: "Error: #{ph.errors.full_messages.join(', ')}"
    end
  end

  def plan
    player = Player.find(params[:id])
    date   = params[:date].presence || Date.today

    np = NutritionPlan.find_or_initialize_by(player: player, date: date)
    np.recommendations = params[:recommendations].presence
    np.breakfast       = params[:breakfast].presence
    np.lunch           = params[:lunch].presence
    np.dinner          = params[:dinner].presence
    np.snacks          = params[:snacks].presence
    np.extra_notes     = params[:extra_notes].presence
    np.created_by      = Current.user

    if np.save
      redirect_to nutricionista_squad_path(player), notice: "Plan nutricional guardado."
    else
      redirect_to nutricionista_squad_path(player), alert: "Error: #{np.errors.full_messages.join(', ')}"
    end
  end

  private

  def serialize_player(p, ph)
    {
      id:              p.id,
      full_name:       p.full_name,
      functional_role: p.functional_role&.name,
      weight_kg:       ph&.weight_kg,
      muscle_mass_kg:  ph&.muscle_mass_kg,
      fat_mass_kg:     ph&.fat_mass_kg,
      last_date:       ph&.date&.strftime("%d/%m/%Y")
    }
  end

  def latest_pesaje_by_player(player_ids)
    PhysicalHistory
      .where(player_id: player_ids)
      .group(:player_id)
      .select("player_id, MAX(date) AS max_date")
      .to_a
      .each_with_object({}) do |row, h|
        h[row.player_id] = PhysicalHistory.where(player_id: row.player_id, date: row.max_date).first
      end
  end
end
