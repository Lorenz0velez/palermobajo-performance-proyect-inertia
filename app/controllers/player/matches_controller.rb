# frozen_string_literal: true

class Player::MatchesController < Player::ApplicationController
  def index
    player = current_player
    return render inertia: "player/matches/index", props: { matches: [] } unless player

    match_players = player.match_players
      .joins(:match)
      .includes(match: :tournament, match_player_stats: :match_stat_type, position: [])
      .order("matches.date DESC")

    matches = match_players.map { |mp| serialize_mp(mp) }
    render inertia: "player/matches/index", props: { matches: matches }
  end

  def show
    player = current_player
    mp = player&.match_players
      .joins(:match)
      .includes(match: [:tournament, :match_stats => :match_stat_type], match_player_stats: :match_stat_type, position: [])
      .find_by(match_id: params[:id])

    return redirect_to player_matches_path, alert: "Partido no encontrado." unless mp

    player_stats = mp.match_player_stats.map do |s|
      { name: s.match_stat_type.name, unit: s.match_stat_type.unit, value: s.value }
    end

    team_stats = mp.match.match_stats.includes(:match_stat_type).map do |s|
      { name: s.match_stat_type.name, unit: s.match_stat_type.unit, value: s.value }
    end

    match = mp.match
    render inertia: "player/matches/show", props: {
      match: {
        id:             match.id,
        opponent:       match.opponent,
        home:           match.home,
        points_for:     match.points_for,
        points_against: match.points_against,
        date:           match.date&.strftime("%Y-%m-%d"),
        video_link:     match.video_link,
        team_name:      match.team_name,
        kickoff_time:   match.kickoff_time,
        minutes_played: mp.minutes_played,
        starter:        mp.starter,
        position:       mp.position&.name,
        stats:          player_stats,
        team_stats:     team_stats
      }
    }
  end

  private

  def current_player
    Current.user&.player || Player.first
  end

  def serialize_mp(mp)
    match = mp.match
    {
      id:             match.id,
      opponent:       match.opponent,
      home:           match.home,
      points_for:     match.points_for,
      points_against: match.points_against,
      date:           match.date&.strftime("%Y-%m-%d"),
      team_name:      match.team_name,
      kickoff_time:   match.kickoff_time,
      minutes_played: mp.minutes_played,
      starter:        mp.starter,
      position:       mp.position&.name
    }
  end
end
