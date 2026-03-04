# frozen_string_literal: true

class Player::HomeController < InertiaController
  def index
    render inertia: "player/home/index", props: {
      player: {
        first_name: "Francisco",
        last_name: "Ferraro",
        category: "Plantel Superior",
        functional_role: "Segunda Línea"
      },
      wellness: { status: "not_loaded" },
      last_match: {
        id: 4,
        label: "Amistoso 4",
        opponent: "GER",
        home: false,
        points_for: 19,
        points_against: 24,
        date: "2026-02-28",
        minutes_played: 55,
        stats: [
          { name: "Tackles", value: 7 },
          { name: "Lineouts ganados", value: 4 },
          { name: "Metros", value: 22 }
        ]
      },
      next_training: {
        id: 18,
        date: "2026-03-05",
        start_time: "19:00",
        training_type: "Físico"
      },
      objectives: [
        { test_name: "Sentadilla", unit: "kg", value: 140, status: "green" },
        { test_name: "Velocidad 40m", unit: "s", value: 5.1, status: "yellow" },
        { test_name: "Salto CMJ", unit: "cm", value: 38, status: "red" }
      ],
      physical_history: [
        { date: "2025-08-01", weight_kg: 98.0, muscle_mass_kg: 55.0 },
        { date: "2025-10-01", weight_kg: 100.5, muscle_mass_kg: 56.5 },
        { date: "2025-12-01", weight_kg: 101.0, muscle_mass_kg: 57.0 },
        { date: "2026-01-15", weight_kg: 102.0, muscle_mass_kg: 58.0 },
        { date: "2026-02-20", weight_kg: 103.0, muscle_mass_kg: 59.0 }
      ]
    }
  end

  private

  def current_player
    Current.user&.player
  end

  def player_props(player)
    return {} unless player
    {
      id: player.id,
      first_name: player.first_name,
      last_name: player.last_name,
      dni: player.dni,
      category: player.player_categories.includes(:category).current.first&.category&.name,
      functional_role: player.functional_role&.name
    }
  end

  def wellness_today(player)
    return nil unless player
    w = player.player_wellness.find_by(date: Date.today)
    return { status: "not_loaded" } unless w
    {
      status: "loaded",
      sleep_hours: w.sleep_hours,
      sleep_quality: w.sleep_quality,
      fatigue: w.fatigue,
      stress: w.stress,
      pain: w.pain,
      mood: w.mood
    }
  end

  def last_match_props(player)
    return nil unless player
    mp = player.match_players.includes(:match, :match_player_stats).order("matches.date DESC").first
    return nil unless mp
    match = mp.match
    stats = mp.match_player_stats.includes(:match_stat_type).map do |s|
      { name: s.match_stat_type.name, value: s.value }
    end
    {
      id: match.id,
      opponent: match.opponent,
      home: match.home,
      points_for: match.points_for,
      points_against: match.points_against,
      date: match.date,
      minutes_played: mp.minutes_played,
      starter: mp.starter,
      stats: stats
    }
  end

  def next_training_props(player)
    return nil unless player
    category = player.player_categories.current.first&.category
    return nil unless category
    t = category.trainings.where("date >= ?", Date.today).order(:date).first
    return nil unless t
    { id: t.id, date: t.date, start_time: t.start_time, training_type: t.training_type, objective: t.objective }
  end

  def objectives_props(player)
    return [] unless player
    category = player.player_categories.current.first&.category
    functional_role = player.functional_role
    return [] unless category && functional_role

    objectives = PhysicalObjective.includes(:physical_test)
      .where(category: category, functional_role: functional_role)
      .where("end_date IS NULL OR end_date >= ?", Date.today)

    objectives.map do |obj|
      last_eval = player.physical_evaluations
        .where(physical_test: obj.physical_test)
        .order(date: :desc).first
      {
        test_name: obj.physical_test.name,
        unit: obj.physical_test.unit,
        value: last_eval&.value,
        status: last_eval ? obj.status_for(last_eval.value) : :unknown
      }
    end
  end

  def physical_history_props(player)
    return [] unless player
    player.physical_histories.order(:date).last(10).map do |h|
      { date: h.date, weight_kg: h.weight_kg, muscle_mass_kg: h.muscle_mass_kg, fat_mass_kg: h.fat_mass_kg }
    end
  end
end
