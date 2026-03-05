# frozen_string_literal: true

class Player::NutritionSessionsController < Player::ApplicationController
  before_action :set_player

  def index
    unless @player.nutrition_tracking.present?
      return render inertia: "player/nutrition_sessions/index", props: { sessions: [] }
    end

    convocados = NutritionConvocado
      .where(player: @player)
      .includes(nutrition_session: :nutrition_slots)
      .order("nutrition_sessions.date DESC")

    render inertia: "player/nutrition_sessions/index", props: {
      sessions: convocados.map { |c| serialize_convocado(c) }
    }
  end

  def show
    unless @player.nutrition_tracking.present?
      redirect_to player_root_path, alert: "No tenés seguimiento nutricional activo."
      return
    end
    convocado = NutritionConvocado.find_by!(nutrition_session_id: params[:id], player: @player)
    ns = convocado.nutrition_session

    slots = ns.nutrition_slots.order(:start_time).map do |slot|
      booked_count = slot.nutrition_convocados.where(cancelled_at: nil).count
      {
        id:         slot.id,
        start_time: slot.start_time.strftime("%H:%M"),
        end_time:   slot.end_time.strftime("%H:%M"),
        available:  booked_count < ns.capacity_per_slot,
        is_mine:    convocado.nutrition_slot_id == slot.id
      }
    end

    render inertia: "player/nutrition_sessions/show", props: {
      session:   { id: ns.id, date: ns.date.strftime("%Y-%m-%d"), date_display: ns.date.strftime("%d/%m/%Y"), day_name: ns.date.strftime("%A") },
      my_slot:   convocado.nutrition_slot ? {
        id:         convocado.nutrition_slot.id,
        start_time: convocado.nutrition_slot.start_time.strftime("%H:%M"),
        end_time:   convocado.nutrition_slot.end_time.strftime("%H:%M")
      } : nil,
      cancelled:  convocado.cancelled?,
      slots:      slots
    }
  end

  def book_slot
    convocado = NutritionConvocado.find_by!(nutrition_session_id: params[:id], player: @player)
    slot      = NutritionSlot.find(params[:slot_id])

    # Verify still available
    booked = slot.nutrition_convocados.where(cancelled_at: nil).count
    if booked >= convocado.nutrition_session.capacity_per_slot
      redirect_to player_nutrition_session_path(params[:id]), alert: "Ese turno ya está lleno."
      return
    end

    convocado.update!(nutrition_slot: slot, cancelled_at: nil)
    redirect_to player_nutrition_session_path(params[:id]), notice: "Turno reservado: #{slot.start_time.strftime('%H:%M')} hs."
  end

  def cancel
    convocado = NutritionConvocado.find_by!(nutrition_session_id: params[:id], player: @player)
    convocado.update!(nutrition_slot: nil, cancelled_at: Time.current)
    redirect_to player_nutrition_session_path(params[:id]), notice: "Turno cancelado."
  end

  private

  def set_player
    @player = current_player
  end

  def serialize_convocado(c)
    ns = c.nutrition_session
    {
      id:          ns.id,
      date:        ns.date.strftime("%Y-%m-%d"),
      date_display: ns.date.strftime("%d/%m/%Y"),
      day_name:    ns.date.strftime("%A"),
      status:      ns.status,
      my_slot:     c.nutrition_slot ? c.nutrition_slot.start_time.strftime("%H:%M") : nil,
      pending:     c.pending?,
      cancelled:   c.cancelled?
    }
  end
end
