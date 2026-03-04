# frozen_string_literal: true

class Player::MatchesController < InertiaController
  # Fixture Primera 2026 — partidos jugados al 04/03/2026
  # L = Local (home), V = Visitante (away)
  FAKE_MATCHES = [
    { id: 4, label: "Amistoso 4", opponent: "GER",                  home: false, points_for: 19, points_against: 24, date: "2026-02-28", minutes_played: 55, starter: true  },
    { id: 3, label: "Amistoso 3", opponent: "Jockey Club CBA",      home: true,  points_for: 28, points_against: 21, date: "2026-02-21", minutes_played: 80, starter: true  },
    { id: 2, label: "Amistoso 2", opponent: "Córdoba Athletic Club", home: true,  points_for: 22, points_against: 17, date: "2026-02-14", minutes_played: 40, starter: false },
    { id: 1, label: "Amistoso 1", opponent: "Partido Entre Nos",    home: true,  points_for: 35, points_against: 28, date: "2026-02-07", minutes_played: 30, starter: false }
  ]

  FAKE_STATS = {
    4 => [
      { name: "Tries",            unit: nil, value: 0 },
      { name: "Tackles",          unit: nil, value: 7 },
      { name: "Tackles perdidos", unit: nil, value: 1 },
      { name: "Lineouts ganados", unit: nil, value: 4 },
      { name: "Lineouts totales", unit: nil, value: 5 },
      { name: "Metros ganados",   unit: "m", value: 22 }
    ],
    3 => [
      { name: "Tries",            unit: nil, value: 1 },
      { name: "Tackles",          unit: nil, value: 9 },
      { name: "Tackles perdidos", unit: nil, value: 2 },
      { name: "Lineouts ganados", unit: nil, value: 6 },
      { name: "Lineouts totales", unit: nil, value: 7 },
      { name: "Metros ganados",   unit: "m", value: 41 }
    ],
    2 => [
      { name: "Tries",            unit: nil, value: 0 },
      { name: "Tackles",          unit: nil, value: 4 },
      { name: "Lineouts ganados", unit: nil, value: 2 },
      { name: "Lineouts totales", unit: nil, value: 3 }
    ],
    1 => [
      { name: "Tries",            unit: nil, value: 0 },
      { name: "Tackles",          unit: nil, value: 3 },
      { name: "Lineouts ganados", unit: nil, value: 1 },
      { name: "Lineouts totales", unit: nil, value: 2 }
    ]
  }

  FAKE_POSITIONS = { 4 => "Lock", 3 => "Lock", 2 => "Lock", 1 => "Lock" }

  def index
    render inertia: "player/matches/index", props: { matches: FAKE_MATCHES }
  end

  def show
    id   = params[:id].to_i
    base = FAKE_MATCHES.find { |m| m[:id] == id } || FAKE_MATCHES.first
    render inertia: "player/matches/show", props: {
      match: base.merge(
        video_link: nil,
        position: FAKE_POSITIONS[id],
        stats: FAKE_STATS[id] || []
      )
    }
  end
end
