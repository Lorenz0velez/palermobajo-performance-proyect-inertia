# frozen_string_literal: true

class Coach::MatchesController < Coach::ApplicationController
  TEAM_NAMES = ["Primera", "Reserva", "Pre A", "Pre B"].freeze

  def index
    matches = category_matches.includes(:match_players).order(date: :desc)

    upcoming = matches.select { |m| m.date >= Date.today }.sort_by(&:date)
    past     = matches.select { |m| m.date < Date.today }

    render inertia: "coach/matches/index", props: {
      upcoming: upcoming.map { |m| serialize_match(m) },
      past:     past.map     { |m| serialize_match(m) }
    }
  end

  def show
    match   = find_match
    players = category_players.includes(:functional_role)

    squad        = match.match_players.includes(:player, :position).to_a
    squad_ids    = squad.map(&:player_id).to_set

    squad_data = squad.map { |mp| serialize_match_player(mp) }
                      .sort_by { |mp| [mp[:starter] ? 0 : 1, mp[:jersey_number] || 99] }

    available = players
      .reject { |p| squad_ids.include?(p.id) }
      .map { |p| { id: p.id, full_name: p.full_name, functional_role: p.functional_role&.name } }

    positions   = Position.order(:name).map { |pos| { id: pos.id, name: pos.name } }
    tournaments = current_season_tournaments

    render inertia: "coach/matches/show", props: {
      match:       serialize_match(match),
      squad:       squad_data,
      available:   available,
      positions:   positions,
      tournaments: tournaments
    }
  end

  def new
    render inertia: "coach/matches/new", props: {
      team_names:  TEAM_NAMES,
      tournaments: current_season_tournaments
    }
  end

  def create
    cat    = current_category
    season = current_season
    torneo = if params[:match][:tournament_id].present?
               Tournament.find(params[:match][:tournament_id])
             elsif season
               Tournament.where(season: season).first_or_create!(name: "URBA #{Date.today.year}")
             else
               Tournament.first!
             end
    match  = Match.new(match_params.except(:tournament_id).merge(category: cat, tournament: torneo))

    if match.save
      redirect_to coach_match_path(match), notice: "Partido creado."
    else
      redirect_to new_coach_match_path, alert: match.errors.full_messages.join(", ")
    end
  end

  def edit
    match = find_match
    render inertia: "coach/matches/edit", props: {
      match:       serialize_match(match),
      team_names:  TEAM_NAMES,
      tournaments: current_season_tournaments
    }
  end

  def update
    match = find_match
    attrs = match_params.except(:tournament_id).to_h
    if params[:match][:tournament_id].present?
      attrs[:tournament_id] = params[:match][:tournament_id]
    end
    if match.update(attrs)
      redirect_to coach_match_path(match), notice: "Partido actualizado."
    else
      redirect_to edit_coach_match_path(match), alert: match.errors.full_messages.join(", ")
    end
  end

  # POST /coach/matches/:id/update_squad
  # Receives: { players: [{ player_id:, starter:, position_id:, jersey_number: }] }
  def update_squad
    match   = find_match
    players = params[:players] || []

    match.match_players.destroy_all

    players.each do |mp_params|
      next if mp_params[:player_id].blank?
      match.match_players.create!(
        player_id:     mp_params[:player_id],
        starter:       mp_params[:starter].to_s == "true",
        position_id:   mp_params[:position_id].presence,
        minutes_played: mp_params[:minutes_played].presence
      )
    end

    redirect_to coach_match_path(match), notice: "Convocatoria actualizada."
  end

  private

  def find_match
    category_matches.find(params[:id])
  end

  def category_matches
    Match.where(category: current_category)
  end

  def category_players
    Player.active
          .joins(:player_categories)
          .where(player_categories: { category: current_category, active: true, end_date: nil })
          .order(:last_name, :first_name)
  end

  def current_category
    ur = Current.user.user_roles.active.where.not(category_id: nil).includes(:category).first
    ur&.category || Category.first
  end

  def current_season
    Season.order(created_at: :desc).first
  end

  def current_season_tournaments
    season = current_season
    return [] unless season
    Tournament.where(season: season).order(:name).map { |t| { id: t.id, name: t.name } }
  end

  def match_params
    params.require(:match).permit(:date, :opponent, :home, :team_name, :kickoff_time, :points_for, :points_against, :video_link, :tournament_id)
  end

  def serialize_match(m)
    {
      id:              m.id,
      date:            m.date&.strftime("%Y-%m-%d"),
      date_display:    m.date&.strftime("%d/%m/%Y"),
      weekday:         m.date&.strftime("%A"),
      opponent:        m.opponent,
      home:            m.home,
      team_name:       m.team_name,
      kickoff_time:    m.kickoff_time,
      points_for:      m.points_for,
      points_against:  m.points_against,
      result:          m.result,
      squad_count:     m.match_players.size,
      tournament_id:   m.tournament_id,
      tournament_name: m.tournament&.name
    }
  end

  def serialize_match_player(mp)
    {
      id:             mp.id,
      player_id:      mp.player_id,
      full_name:      mp.player.full_name,
      functional_role: mp.player.functional_role&.name,
      starter:        mp.starter,
      position_id:    mp.position_id,
      position_name:  mp.position&.name,
      minutes_played: mp.minutes_played
    }
  end
end
