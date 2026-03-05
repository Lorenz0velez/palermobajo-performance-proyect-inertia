# frozen_string_literal: true

class Player::HomeController < Player::ApplicationController
  def index
    player = current_player

    render inertia: "player/home/index", props: {
      player:           player_props(player),
      wellness:         wellness_today(player) || { status: "not_loaded" },
      last_match:       last_match_props(player),
      next_match:       next_match_props(player),
      next_training:    next_training_props(player),
      objectives:       objectives_props(player),
      physical_history: physical_history_props(player),
      last_perception:  last_perception_props(player),
      pending_nutrition: pending_nutrition_props(player)
    }
  end

  private


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
    mp = player.match_players
      .joins(:match)
      .where("matches.date < ? AND matches.points_for IS NOT NULL", Date.today)
      .includes(:match, :match_player_stats)
      .order("matches.date DESC")
      .first
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
      date: match.date&.strftime("%Y-%m-%d"),
      team_name: match.team_name,
      minutes_played: mp.minutes_played,
      starter: mp.starter,
      stats: stats
    }
  end

  def next_match_props(player)
    return nil unless player
    mp = player.match_players
      .joins(:match)
      .where("matches.date >= ?", Date.today)
      .order("matches.date ASC")
      .includes(:match, :position)
      .first
    return nil unless mp
    match = mp.match
    {
      id:           match.id,
      opponent:     match.opponent,
      home:         match.home,
      date:         match.date.strftime("%Y-%m-%d"),
      kickoff_time: match.kickoff_time,
      team_name:    match.team_name,
      starter:      mp.starter,
      position:     mp.position&.name
    }
  end

  def next_training_props(player)
    return nil unless player
    category = player.player_categories.current.first&.category
    return nil unless category
    t = category.trainings.where("date >= ?", Date.today).order(:date).first
    return nil unless t
    {
      id:            t.id,
      date:          t.date.strftime("%Y-%m-%d"),
      start_time:    t.start_time&.strftime("%H:%M"),
      training_type: t.training_type,
      objective:     t.objective
    }
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
        status: last_eval ? obj.status_for(last_eval.value).to_s : "unknown"
      }
    end
  end

  def physical_history_props(player)
    return [] unless player
    player.physical_histories.order(:date).last(10).map do |h|
      { date: h.date.strftime("%Y-%m-%d"), weight_kg: h.weight_kg&.to_f, muscle_mass_kg: h.muscle_mass_kg&.to_f, fat_mass_kg: h.fat_mass_kg&.to_f }
    end
  end

  def last_perception_props(player)
    return nil unless player
    category = player.player_categories.current.first&.category
    return nil unless category

    training = category.trainings.where("date < ?", Date.today).order(date: :desc).first
    return nil unless training

    perception = TrainingPerception.find_by(training: training, player: player)
    {
      training_id:   training.id,
      training_date: training.date.strftime("%Y-%m-%d"),
      training_type: training.training_type,
      rpe:           perception&.rpe,
      pending:       perception.nil?
    }
  end

  def pending_nutrition_props(player)
    return nil unless player
    return nil unless player.nutrition_tracking.present?
    nc = NutritionConvocado
      .joins(:nutrition_session)
      .where(player: player, cancelled_at: nil, nutrition_slot_id: nil)
      .where("nutrition_sessions.status = ? AND nutrition_sessions.date >= ?", "published", Date.today)
      .includes(:nutrition_session)
      .order("nutrition_sessions.date ASC")
      .first
    return nil unless nc
    {
      session_id:   nc.nutrition_session_id,
      date_display: nc.nutrition_session.date.strftime("%d/%m/%Y"),
      day_name:     nc.nutrition_session.date.strftime("%A")
    }
  end
end
