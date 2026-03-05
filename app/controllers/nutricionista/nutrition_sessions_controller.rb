# frozen_string_literal: true

class Nutricionista::NutritionSessionsController < Nutricionista::ApplicationController
  before_action :set_session, only: [:show, :destroy,
                                     :generate_slots, :publish, :complete,
                                     :add_convocado, :remove_convocado]

  def index
    upcoming = NutritionSession.upcoming.includes(:nutrition_convocados, :nutrition_slots)
    past     = NutritionSession.past.limit(10).includes(:nutrition_convocados, :nutrition_slots)

    render inertia: "nutricionista/nutrition_sessions/index", props: {
      upcoming: upcoming.map { |s| serialize_session(s) },
      past:     past.map     { |s| serialize_session(s) }
    }
  end

  def new
    players = tracked_players.includes(:functional_role).order(:last_name)
    render inertia: "nutricionista/nutrition_sessions/new", props: {
      players: players.map { |p| { id: p.id, full_name: p.full_name, functional_role: p.functional_role&.name } }
    }
  end

  def create
    session = NutritionSession.new(
      date:              params[:date],
      capacity_per_slot: params[:capacity_per_slot] || 1,
      created_by:        Current.user
    )

    if session.save
      redirect_to nutricionista_nutrition_session_path(session), notice: "Sesión creada."
    else
      redirect_to new_nutricionista_nutrition_session_path, alert: session.errors.full_messages.join(", ")
    end
  end

  def show
    players_all = tracked_players.includes(:functional_role).order(:last_name)
    convocado_ids = @ns.nutrition_convocados.pluck(:player_id)

    slots = @ns.nutrition_slots.order(:start_time).map do |slot|
      bookings = slot.nutrition_convocados.where(cancelled_at: nil).includes(player: :functional_role)
      {
        id:         slot.id,
        start_time: slot.start_time.strftime("%H:%M"),
        end_time:   slot.end_time.strftime("%H:%M"),
        capacity:   @ns.capacity_per_slot,
        booked:     bookings.count,
        players:    bookings.map { |c| { id: c.player_id, full_name: c.player.full_name } }
      }
    end

    convocados = @ns.nutrition_convocados.includes(player: :functional_role, nutrition_slot: {}).map do |c|
      {
        id:        c.id,
        player_id: c.player_id,
        full_name: c.player.full_name,
        role:      c.player.functional_role&.name,
        slot_id:   c.nutrition_slot_id,
        slot_time: c.nutrition_slot ? c.nutrition_slot.start_time.strftime("%H:%M") : nil,
        booked:    c.booked?,
        pending:   c.pending?,
        cancelled: c.cancelled?
      }
    end

    render inertia: "nutricionista/nutrition_sessions/show", props: {
      session:    serialize_session(@ns),
      slots:      slots,
      convocados: convocados,
      all_players: players_all.reject { |p| convocado_ids.include?(p.id) }
                              .map   { |p| { id: p.id, full_name: p.full_name, functional_role: p.functional_role&.name } }
    }
  end

  def generate_slots
    start_t  = params[:start_time].presence
    end_t    = params[:end_time].presence
    interval = params[:interval].to_i.positive? ? params[:interval].to_i : 10

    if start_t && end_t
      @ns.generate_slots!(start_t, end_t, interval)
      redirect_to nutricionista_nutrition_session_path(@ns), notice: "Turnos generados."
    else
      redirect_to nutricionista_nutrition_session_path(@ns), alert: "Ingresá hora de inicio y fin."
    end
  end

  def publish
    player_ids = params[:player_ids].to_a.map(&:to_i).select(&:positive?)

    # Add convocados if provided on publish
    Player.where(id: player_ids).each do |player|
      next if NutritionConvocado.exists?(nutrition_session: @ns, player: player)
      nc = NutritionConvocado.create!(nutrition_session: @ns, player: player, notified_at: Time.current)
      NutritionMailer.convocatoria(nc).deliver_later
    end

    # Notify existing convocados not yet notified
    @ns.nutrition_convocados.where(notified_at: nil).each do |nc|
      nc.update!(notified_at: Time.current)
      NutritionMailer.convocatoria(nc).deliver_later
    end

    @ns.update!(status: "published")
    redirect_to nutricionista_nutrition_session_path(@ns), notice: "Sesión publicada. Notificaciones enviadas."
  end

  def complete
    @ns.update!(status: "completed")
    redirect_to nutricionista_nutrition_session_path(@ns), notice: "Sesión marcada como completada."
  end

  def add_convocado
    player = Player.find(params[:player_id])
    nc = NutritionConvocado.find_or_create_by!(nutrition_session: @ns, player: player)

    if @ns.published? && nc.notified_at.nil?
      nc.update!(notified_at: Time.current)
      NutritionMailer.convocatoria(nc).deliver_later
    end

    redirect_to nutricionista_nutrition_session_path(@ns), notice: "#{player.full_name} agregado."
  end

  def remove_convocado
    player = Player.find(params[:player_id])
    nc = NutritionConvocado.find_by(nutrition_session: @ns, player: player)
    nc&.destroy
    redirect_to nutricionista_nutrition_session_path(@ns), notice: "#{player.full_name} eliminado."
  end

  def destroy
    @ns.destroy
    redirect_to nutricionista_nutrition_sessions_path, notice: "Sesión eliminada."
  end

  private

  def set_session
    @ns = NutritionSession.find(params[:id])
  end

  def serialize_session(s)
    {
      id:                s.id,
      date:              s.date.strftime("%Y-%m-%d"),
      date_display:      s.date.strftime("%d/%m/%Y"),
      day_name:          s.date.strftime("%A"),
      status:            s.status,
      capacity_per_slot: s.capacity_per_slot,
      total_convocados:  s.nutrition_convocados.active.count,
      total_booked:      s.nutrition_convocados.booked.count,
      total_slots:       s.nutrition_slots.count
    }
  end
end
