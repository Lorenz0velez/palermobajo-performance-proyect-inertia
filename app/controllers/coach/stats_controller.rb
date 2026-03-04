# frozen_string_literal: true

class Coach::StatsController < InertiaController
  MATCHES = [
    { id: 4, label: "Amistoso 4", opponent: "GER",                  home: false, points_for: 19, points_against: 24, date: "2026-02-28", result: "loss", tries_for: 2, tries_against: 3 },
    { id: 3, label: "Amistoso 3", opponent: "Jockey Club CBA",      home: true,  points_for: 28, points_against: 21, date: "2026-02-21", result: "win",  tries_for: 4, tries_against: 3 },
    { id: 2, label: "Amistoso 2", opponent: "Córdoba Athletic Club", home: true,  points_for: 22, points_against: 17, date: "2026-02-14", result: "win",  tries_for: 3, tries_against: 2 },
    { id: 1, label: "Amistoso 1", opponent: "Partido Entre Nos",    home: true,  points_for: 35, points_against: 28, date: "2026-02-07", result: "win",  tries_for: 5, tries_against: 4 }
  ]

  # Estadísticas individuales por partido (para la vista de detalle de partido)
  MATCH_PLAYER_STATS = {
    4 => [
      { id: 1,  name: "Francisco Ferraro", role: "Segunda Línea", minutes: 55, starter: true,  tries: 0, tackles: 7,  lineouts_won: 4, lineouts_total: 5, meters: 22 },
      { id: 4,  name: "Lucas Rodríguez",   role: "Segunda Línea", minutes: 80, starter: true,  tries: 1, tackles: 6,  lineouts_won: 5, lineouts_total: 6, meters: 38 },
      { id: 2,  name: "Martín González",   role: "Hooker",        minutes: 60, starter: true,  tries: 0, tackles: 5,  lineouts_won: 0, lineouts_total: 0, meters: nil },
      { id: 3,  name: "Carlos Pérez",      role: "Pilar Derecho", minutes: 50, starter: true,  tries: 0, tackles: 4,  lineouts_won: 0, lineouts_total: 0, meters: nil },
      { id: 5,  name: "Agustín López",     role: "Flanker",       minutes: 80, starter: true,  tries: 0, tackles: 9,  lineouts_won: 0, lineouts_total: 0, meters: nil },
      { id: 6,  name: "Santiago Martínez", role: "Número 8",      minutes: 60, starter: true,  tries: 0, tackles: 8,  lineouts_won: 0, lineouts_total: 0, meters: nil },
      { id: 7,  name: "Ignacio García",    role: "Medio Scrum",   minutes: 80, starter: true,  tries: 0, tackles: 3,  lineouts_won: 0, lineouts_total: 0, meters: nil },
      { id: 8,  name: "Tomás Fernández",   role: "Apertura",      minutes: 70, starter: true,  tries: 1, tackles: 2,  lineouts_won: 0, lineouts_total: 0, meters: nil },
      { id: 9,  name: "Pablo Díaz",        role: "Wing",          minutes: 80, starter: true,  tries: 0, tackles: 2,  lineouts_won: 0, lineouts_total: 0, meters: nil },
      { id: 10, name: "Nicolás Sánchez",   role: "Fullback",      minutes: 80, starter: true,  tries: 0, tackles: 3,  lineouts_won: 0, lineouts_total: 0, meters: nil }
    ],
    3 => [
      { id: 1,  name: "Francisco Ferraro", role: "Segunda Línea", minutes: 80, starter: true,  tries: 1, tackles: 9,  lineouts_won: 6, lineouts_total: 7, meters: 41 },
      { id: 4,  name: "Lucas Rodríguez",   role: "Segunda Línea", minutes: 80, starter: true,  tries: 1, tackles: 5,  lineouts_won: 6, lineouts_total: 7, meters: 55 },
      { id: 2,  name: "Martín González",   role: "Hooker",        minutes: 70, starter: true,  tries: 1, tackles: 6,  lineouts_won: 0, lineouts_total: 0, meters: nil },
      { id: 3,  name: "Carlos Pérez",      role: "Pilar Derecho", minutes: 60, starter: true,  tries: 0, tackles: 5,  lineouts_won: 0, lineouts_total: 0, meters: nil },
      { id: 5,  name: "Agustín López",     role: "Flanker",       minutes: 80, starter: true,  tries: 0, tackles: 9,  lineouts_won: 0, lineouts_total: 0, meters: nil },
      { id: 6,  name: "Santiago Martínez", role: "Número 8",      minutes: 60, starter: true,  tries: 1, tackles: 8,  lineouts_won: 0, lineouts_total: 0, meters: nil },
      { id: 7,  name: "Ignacio García",    role: "Medio Scrum",   minutes: 80, starter: true,  tries: 1, tackles: 4,  lineouts_won: 0, lineouts_total: 0, meters: nil },
      { id: 8,  name: "Tomás Fernández",   role: "Apertura",      minutes: 80, starter: true,  tries: 0, tackles: 2,  lineouts_won: 0, lineouts_total: 0, meters: nil },
      { id: 9,  name: "Pablo Díaz",        role: "Wing",          minutes: 80, starter: true,  tries: 2, tackles: 2,  lineouts_won: 0, lineouts_total: 0, meters: nil },
      { id: 10, name: "Nicolás Sánchez",   role: "Fullback",      minutes: 80, starter: true,  tries: 0, tackles: 4,  lineouts_won: 0, lineouts_total: 0, meters: nil }
    ],
    2 => [
      { id: 4,  name: "Lucas Rodríguez",   role: "Segunda Línea", minutes: 80, starter: true,  tries: 1, tackles: 5,  lineouts_won: 4, lineouts_total: 5, meters: 44 },
      { id: 2,  name: "Martín González",   role: "Hooker",        minutes: 50, starter: true,  tries: 1, tackles: 7,  lineouts_won: 0, lineouts_total: 0, meters: nil },
      { id: 3,  name: "Carlos Pérez",      role: "Pilar Derecho", minutes: 50, starter: true,  tries: 0, tackles: 5,  lineouts_won: 0, lineouts_total: 0, meters: nil },
      { id: 5,  name: "Agustín López",     role: "Flanker",       minutes: 70, starter: true,  tries: 0, tackles: 8,  lineouts_won: 0, lineouts_total: 0, meters: nil },
      { id: 7,  name: "Ignacio García",    role: "Medio Scrum",   minutes: 80, starter: true,  tries: 0, tackles: 3,  lineouts_won: 0, lineouts_total: 0, meters: nil },
      { id: 8,  name: "Tomás Fernández",   role: "Apertura",      minutes: 80, starter: true,  tries: 0, tackles: 3,  lineouts_won: 0, lineouts_total: 0, meters: nil },
      { id: 9,  name: "Pablo Díaz",        role: "Wing",          minutes: 60, starter: true,  tries: 1, tackles: 2,  lineouts_won: 0, lineouts_total: 0, meters: nil },
      { id: 10, name: "Nicolás Sánchez",   role: "Fullback",      minutes: 80, starter: true,  tries: 1, tackles: 3,  lineouts_won: 0, lineouts_total: 0, meters: nil }
    ],
    1 => [
      { id: 4,  name: "Lucas Rodríguez",   role: "Segunda Línea", minutes: 70, starter: true,  tries: 0, tackles: 4,  lineouts_won: 5, lineouts_total: 5, meters: 62 },
      { id: 1,  name: "Francisco Ferraro", role: "Segunda Línea", minutes: 30, starter: false, tries: 0, tackles: 3,  lineouts_won: 3, lineouts_total: 5, meters: 12 },
      { id: 2,  name: "Martín González",   role: "Hooker",        minutes: 40, starter: true,  tries: 0, tackles: 5,  lineouts_won: 0, lineouts_total: 0, meters: nil },
      { id: 5,  name: "Agustín López",     role: "Flanker",       minutes: 60, starter: true,  tries: 1, tackles: 7,  lineouts_won: 0, lineouts_total: 0, meters: nil },
      { id: 7,  name: "Ignacio García",    role: "Medio Scrum",   minutes: 80, starter: true,  tries: 1, tackles: 4,  lineouts_won: 0, lineouts_total: 0, meters: nil },
      { id: 8,  name: "Tomás Fernández",   role: "Apertura",      minutes: 80, starter: true,  tries: 0, tackles: 2,  lineouts_won: 0, lineouts_total: 0, meters: nil },
      { id: 9,  name: "Pablo Díaz",        role: "Wing",          minutes: 50, starter: false, tries: 1, tackles: 2,  lineouts_won: 0, lineouts_total: 0, meters: nil },
      { id: 10, name: "Nicolás Sánchez",   role: "Fullback",      minutes: 80, starter: true,  tries: 1, tackles: 4,  lineouts_won: 0, lineouts_total: 0, meters: nil }
    ]
  }

  # Desglose por partido para la vista de un jugador individual
  PLAYER_MATCH_BREAKDOWN = {
    1  => [
      { match_id: 4, opponent: "GER",              date: "2026-02-28", result: "loss", home: false, minutes: 55,  starter: true,  tries: 0, tackles: 7,  lineouts_won: 4, lineouts_total: 5, meters: 22 },
      { match_id: 3, opponent: "Jockey Club CBA",  date: "2026-02-21", result: "win",  home: true,  minutes: 80,  starter: true,  tries: 1, tackles: 9,  lineouts_won: 6, lineouts_total: 7, meters: 41 },
      { match_id: 2, opponent: "Córdoba AC",        date: "2026-02-14", result: "win",  home: true,  minutes: nil, starter: false, tries: nil, tackles: nil, lineouts_won: nil, lineouts_total: nil, meters: nil, absent: true },
      { match_id: 1, opponent: "Partido Entre Nos", date: "2026-02-07", result: "win",  home: true,  minutes: 30,  starter: false, tries: 0, tackles: 3,  lineouts_won: 3, lineouts_total: 5, meters: 12 }
    ],
    2  => [
      { match_id: 4, opponent: "GER",              date: "2026-02-28", result: "loss", home: false, minutes: 60, starter: true, tries: 0, tackles: 5, lineouts_won: 0, lineouts_total: 0, meters: nil },
      { match_id: 3, opponent: "Jockey Club CBA",  date: "2026-02-21", result: "win",  home: true,  minutes: 70, starter: true, tries: 1, tackles: 6, lineouts_won: 0, lineouts_total: 0, meters: nil },
      { match_id: 2, opponent: "Córdoba AC",        date: "2026-02-14", result: "win",  home: true,  minutes: 50, starter: true, tries: 1, tackles: 7, lineouts_won: 0, lineouts_total: 0, meters: nil },
      { match_id: 1, opponent: "Partido Entre Nos", date: "2026-02-07", result: "win",  home: true,  minutes: 40, starter: true, tries: 0, tackles: 5, lineouts_won: 0, lineouts_total: 0, meters: nil }
    ],
    3  => [
      { match_id: 4, opponent: "GER",              date: "2026-02-28", result: "loss", home: false, minutes: 50, starter: true, tries: 0, tackles: 4, lineouts_won: 0, lineouts_total: 0, meters: nil },
      { match_id: 3, opponent: "Jockey Club CBA",  date: "2026-02-21", result: "win",  home: true,  minutes: 60, starter: true, tries: 0, tackles: 5, lineouts_won: 0, lineouts_total: 0, meters: nil },
      { match_id: 2, opponent: "Córdoba AC",        date: "2026-02-14", result: "win",  home: true,  minutes: 50, starter: true, tries: 0, tackles: 5, lineouts_won: 0, lineouts_total: 0, meters: nil }
    ],
    4  => [
      { match_id: 4, opponent: "GER",              date: "2026-02-28", result: "loss", home: false, minutes: 80, starter: true, tries: 1, tackles: 6, lineouts_won: 5, lineouts_total: 6, meters: 38 },
      { match_id: 3, opponent: "Jockey Club CBA",  date: "2026-02-21", result: "win",  home: true,  minutes: 80, starter: true, tries: 1, tackles: 5, lineouts_won: 6, lineouts_total: 7, meters: 55 },
      { match_id: 2, opponent: "Córdoba AC",        date: "2026-02-14", result: "win",  home: true,  minutes: 80, starter: true, tries: 1, tackles: 5, lineouts_won: 4, lineouts_total: 5, meters: 44 },
      { match_id: 1, opponent: "Partido Entre Nos", date: "2026-02-07", result: "win",  home: true,  minutes: 70, starter: true, tries: 0, tackles: 4, lineouts_won: 5, lineouts_total: 5, meters: 62 }
    ],
    5  => [
      { match_id: 4, opponent: "GER",              date: "2026-02-28", result: "loss", home: false, minutes: 80, starter: true, tries: 0, tackles: 9, lineouts_won: 0, lineouts_total: 0, meters: nil },
      { match_id: 3, opponent: "Jockey Club CBA",  date: "2026-02-21", result: "win",  home: true,  minutes: 80, starter: true, tries: 0, tackles: 9, lineouts_won: 0, lineouts_total: 0, meters: nil },
      { match_id: 2, opponent: "Córdoba AC",        date: "2026-02-14", result: "win",  home: true,  minutes: 70, starter: true, tries: 0, tackles: 8, lineouts_won: 0, lineouts_total: 0, meters: nil },
      { match_id: 1, opponent: "Partido Entre Nos", date: "2026-02-07", result: "win",  home: true,  minutes: 60, starter: true, tries: 1, tackles: 7, lineouts_won: 0, lineouts_total: 0, meters: nil }
    ],
    6  => [
      { match_id: 4, opponent: "GER",             date: "2026-02-28", result: "loss", home: false, minutes: 60, starter: true, tries: 0, tackles: 8, lineouts_won: 0, lineouts_total: 0, meters: nil },
      { match_id: 3, opponent: "Jockey Club CBA", date: "2026-02-21", result: "win",  home: true,  minutes: 60, starter: true, tries: 1, tackles: 8, lineouts_won: 0, lineouts_total: 0, meters: nil }
    ],
    7  => [
      { match_id: 4, opponent: "GER",              date: "2026-02-28", result: "loss", home: false, minutes: 80, starter: true, tries: 0, tackles: 3, lineouts_won: 0, lineouts_total: 0, meters: nil },
      { match_id: 3, opponent: "Jockey Club CBA",  date: "2026-02-21", result: "win",  home: true,  minutes: 80, starter: true, tries: 1, tackles: 4, lineouts_won: 0, lineouts_total: 0, meters: nil },
      { match_id: 2, opponent: "Córdoba AC",        date: "2026-02-14", result: "win",  home: true,  minutes: 80, starter: true, tries: 0, tackles: 3, lineouts_won: 0, lineouts_total: 0, meters: nil },
      { match_id: 1, opponent: "Partido Entre Nos", date: "2026-02-07", result: "win",  home: true,  minutes: 80, starter: true, tries: 1, tackles: 4, lineouts_won: 0, lineouts_total: 0, meters: nil }
    ],
    8  => [
      { match_id: 4, opponent: "GER",              date: "2026-02-28", result: "loss", home: false, minutes: 70, starter: true, tries: 1, tackles: 2, lineouts_won: 0, lineouts_total: 0, meters: nil },
      { match_id: 3, opponent: "Jockey Club CBA",  date: "2026-02-21", result: "win",  home: true,  minutes: 80, starter: true, tries: 0, tackles: 2, lineouts_won: 0, lineouts_total: 0, meters: nil },
      { match_id: 2, opponent: "Córdoba AC",        date: "2026-02-14", result: "win",  home: true,  minutes: 80, starter: true, tries: 0, tackles: 3, lineouts_won: 0, lineouts_total: 0, meters: nil },
      { match_id: 1, opponent: "Partido Entre Nos", date: "2026-02-07", result: "win",  home: true,  minutes: 80, starter: true, tries: 0, tackles: 2, lineouts_won: 0, lineouts_total: 0, meters: nil }
    ],
    9  => [
      { match_id: 4, opponent: "GER",             date: "2026-02-28", result: "loss", home: false, minutes: 80, starter: true,  tries: 0, tackles: 2, lineouts_won: 0, lineouts_total: 0, meters: nil },
      { match_id: 3, opponent: "Jockey Club CBA", date: "2026-02-21", result: "win",  home: true,  minutes: 80, starter: true,  tries: 2, tackles: 2, lineouts_won: 0, lineouts_total: 0, meters: nil },
      { match_id: 2, opponent: "Córdoba AC",       date: "2026-02-14", result: "win",  home: true,  minutes: 60, starter: true,  tries: 1, tackles: 2, lineouts_won: 0, lineouts_total: 0, meters: nil }
    ],
    10 => [
      { match_id: 4, opponent: "GER",              date: "2026-02-28", result: "loss", home: false, minutes: 80, starter: true, tries: 0, tackles: 3, lineouts_won: 0, lineouts_total: 0, meters: nil },
      { match_id: 3, opponent: "Jockey Club CBA",  date: "2026-02-21", result: "win",  home: true,  minutes: 80, starter: true, tries: 0, tackles: 4, lineouts_won: 0, lineouts_total: 0, meters: nil },
      { match_id: 2, opponent: "Córdoba AC",        date: "2026-02-14", result: "win",  home: true,  minutes: 80, starter: true, tries: 1, tackles: 3, lineouts_won: 0, lineouts_total: 0, meters: nil },
      { match_id: 1, opponent: "Partido Entre Nos", date: "2026-02-07", result: "win",  home: true,  minutes: 80, starter: true, tries: 1, tackles: 4, lineouts_won: 0, lineouts_total: 0, meters: nil }
    ]
  }

  PLAYER_STATS = [
    { id: 4,  name: "Lucas Rodríguez",   functional_role: "Segunda Línea", matches: 4, tries: 3, tackles: 20, lineouts_won: 15, lineouts_total: 18, minutes: 310 },
    { id: 9,  name: "Pablo Díaz",        functional_role: "Wing",          matches: 3, tries: 4, tackles: 7,  lineouts_won: 0,  lineouts_total: 0,  minutes: 220 },
    { id: 2,  name: "Martín González",   functional_role: "Hooker",        matches: 4, tries: 2, tackles: 18, lineouts_won: 0,  lineouts_total: 0,  minutes: 220 },
    { id: 7,  name: "Ignacio García",    functional_role: "Medio Scrum",   matches: 4, tries: 2, tackles: 12, lineouts_won: 0,  lineouts_total: 0,  minutes: 300 },
    { id: 10, name: "Nicolás Sánchez",   functional_role: "Fullback",      matches: 4, tries: 2, tackles: 11, lineouts_won: 0,  lineouts_total: 0,  minutes: 300 },
    { id: 5,  name: "Agustín López",     functional_role: "Flanker",       matches: 4, tries: 1, tackles: 31, lineouts_won: 0,  lineouts_total: 0,  minutes: 290 },
    { id: 1,  name: "Francisco Ferraro", functional_role: "Segunda Línea", matches: 4, tries: 1, tackles: 23, lineouts_won: 13, lineouts_total: 17, minutes: 205 },
    { id: 8,  name: "Tomás Fernández",   functional_role: "Apertura",      matches: 4, tries: 1, tackles: 9,  lineouts_won: 0,  lineouts_total: 0,  minutes: 280 },
    { id: 6,  name: "Santiago Martínez", functional_role: "Número 8",      matches: 2, tries: 1, tackles: 16, lineouts_won: 0,  lineouts_total: 0,  minutes: 120 },
    { id: 3,  name: "Carlos Pérez",      functional_role: "Pilar Derecho", matches: 3, tries: 0, tackles: 14, lineouts_won: 0,  lineouts_total: 0,  minutes: 160 }
  ]

  def index
    render inertia: "coach/stats/index", props: {
      team: {
        matches_played: 4,
        wins: 3,
        losses: 1,
        points_for: 104,
        points_against: 90,
        tries_for: 17,
        tries_against: 12
      },
      matches: MATCHES,
      players: PLAYER_STATS
    }
  end

  def show
    player    = PLAYER_STATS.find { |p| p[:id] == params[:id].to_i } || PLAYER_STATS.first
    breakdown = PLAYER_MATCH_BREAKDOWN[player[:id]] || []
    render inertia: "coach/stats/show", props: {
      player: player,
      matches: MATCHES,
      breakdown: breakdown
    }
  end

  def match_detail
    id    = params[:id].to_i
    match = MATCHES.find { |m| m[:id] == id } || MATCHES.first
    render inertia: "coach/stats/match", props: {
      match:   match,
      players: MATCH_PLAYER_STATS[id] || []
    }
  end
end
