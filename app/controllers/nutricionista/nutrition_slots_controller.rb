# frozen_string_literal: true

class Nutricionista::NutritionSlotsController < Nutricionista::ApplicationController
  # POST /nutricionista/nutrition_sessions/:nutrition_session_id/slots/:id/weigh_player
  # Loads a weigh-in for the player assigned to this slot
  def weigh_player
    slot    = NutritionSlot.find(params[:id])
    session = slot.nutrition_session
    player  = Player.find(params[:player_id])

    ph = PhysicalHistory.find_or_initialize_by(player: player, date: params[:date].presence || session.date)
    ph.weight_kg        = params[:weight_kg].presence
    ph.muscle_mass_kg   = params[:muscle_mass_kg].presence
    ph.fat_mass_kg      = params[:fat_mass_kg].presence
    ph.height_cm        = params[:height_cm].presence if params[:height_cm].present?
    ph.muscle_direction = params[:muscle_direction].presence
    ph.fat_direction    = params[:fat_direction].presence

    if ph.save
      redirect_to nutricionista_nutrition_session_path(session), notice: "Pesaje guardado para #{player.full_name}."
    else
      redirect_to nutricionista_nutrition_session_path(session), alert: "Error: #{ph.errors.full_messages.join(', ')}"
    end
  end
end
