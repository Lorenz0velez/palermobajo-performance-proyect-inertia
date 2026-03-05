# frozen_string_literal: true

class Pf::HomeController < Pf::ApplicationController
  def index
    players = category_players
    player_ids = players.pluck(:id)

    # --- Bienestar: últimos 7 días ---
    since = 7.days.ago.to_date
    wellness_records = PlayerWellness
      .where(player_id: player_ids, date: since..)
      .order(:date)

    # Promedio grupal por día
    wellness_by_day = wellness_records.group(:date).select(
      "date",
      "ROUND(AVG(sleep_quality), 1)   AS avg_sleep",
      "ROUND(AVG(energy_level), 1)    AS avg_energy",
      "ROUND(AVG(leg_feel), 1)        AS avg_legs",
      "ROUND(AVG(pain), 1)            AS avg_pain",
      "COUNT(*)                       AS responses"
    ).map do |r|
      {
        date:        r.date.strftime("%d/%m"),
        avg_sleep:   r.avg_sleep.to_f,
        avg_energy:  r.avg_energy.to_f,
        avg_legs:    r.avg_legs.to_f,
        avg_pain:    r.avg_pain.to_f,
        responses:   r.responses
      }
    end

    # Último registro individual por jugador
    latest_wellness_by_player = wellness_records
      .group(:player_id)
      .select("player_id, MAX(date) AS max_date")
      .to_a
      .each_with_object({}) do |row, h|
        wl = wellness_records.find { |w| w.player_id == row.player_id && w.date == row.max_date }
        h[row.player_id] = wl
      end

    # --- Percepciones: últimos entrenamientos ---
    recent_trainings = Training
      .where(category: current_category)
      .order(date: :desc)
      .limit(5)

    perceptions_by_training = TrainingPerception
      .where(training_id: recent_trainings.map(&:id))
      .includes(:player)
      .group_by(&:training_id)

    perceptions_summary = recent_trainings.map do |t|
      percs = perceptions_by_training[t.id] || []
      {
        training_id:   t.id,
        date:          t.date&.strftime("%d/%m"),
        objective:     t.objective,
        total_players: percs.size,
        avg_rpe:       percs.filter_map(&:rpe).then { |v| v.empty? ? nil : (v.sum.to_f / v.size).round(1) },
        avg_fatigue:   percs.filter_map(&:fatigue_level).then { |v| v.empty? ? nil : (v.sum.to_f / v.size).round(1) }
      }
    end

    players_wellness = players.map do |p|
      wl = latest_wellness_by_player[p.id]
      {
        id:              p.id,
        name:            p.full_name,
        functional_role: p.functional_role&.name,
        last_date:       wl&.date&.strftime("%d/%m"),
        energy:          wl&.energy_level,
        pain:            wl&.pain,
        leg_feel:        wl&.leg_feel,
        readiness:       wl&.training_readiness
      }
    end

    render inertia: "pf/home/index", props: {
      category:            current_category ? { id: current_category.id, name: current_category.name } : nil,
      wellness_by_day:     wellness_by_day,
      players_wellness:    players_wellness,
      perceptions_summary: perceptions_summary
    }
  end
end
