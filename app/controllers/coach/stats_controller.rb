# frozen_string_literal: true

class Coach::StatsController < Coach::ApplicationController
  MATCHES = [
    # Scrums propios: own_scrums_won / own_scrums_total (nuestro put-in)
    # Scrums rival:   opp_scrums_stolen / opp_scrums_total (recuperados del put-in rival)
    # Lineouts ídem
    { id: 6, label: "Fecha 2",    category: "Primera", tournament: "Top 10",             opponent: "Hindú",               home: false,
      points_for: 14, points_against: 21, date: "2026-03-01", result: "loss",
      tries_for: 2, tries_against: 3, penalties_for: 1, penalties_against: 3,
      own_scrums_won: 4, own_scrums_total: 7,
      opp_scrums_stolen: 1, opp_scrums_total: 5,
      own_lineouts_won: 6, own_lineouts_total: 8,
      opp_lineouts_stolen: 2, opp_lineouts_total: 7 },
    { id: 5, label: "Fecha 1",   category: "Primera", tournament: "Top 10", opponent: "CASI",                home: true,
      points_for: 26, points_against: 19, date: "2026-02-22", result: "win",
      tries_for: 3, tries_against: 2, penalties_for: 4, penalties_against: 3,
      own_scrums_won: 6, own_scrums_total: 8,
      opp_scrums_stolen: 2, opp_scrums_total: 6,
      own_lineouts_won: 9, own_lineouts_total: 10,
      opp_lineouts_stolen: 1, opp_lineouts_total: 7 },
    { id: 4, label: "Amistoso 4", category: "Reserva", tournament: "Copa Inter Córdoba", opponent: "GER",                home: false,
      points_for: 19, points_against: 24, date: "2026-02-28", result: "loss",
      tries_for: 2, tries_against: 3, penalties_for: 2, penalties_against: 5,
      own_scrums_won: 4, own_scrums_total: 7,
      opp_scrums_stolen: 2, opp_scrums_total: 6,
      own_lineouts_won: 7, own_lineouts_total: 9,
      opp_lineouts_stolen: 2, opp_lineouts_total: 8 },
    { id: 3, label: "Amistoso 3", category: "Reserva", tournament: "Copa Inter Córdoba", opponent: "Jockey Club CBA",    home: true,
      points_for: 28, points_against: 21, date: "2026-02-21", result: "win",
      tries_for: 4, tries_against: 3, penalties_for: 4, penalties_against: 3,
      own_scrums_won: 6, own_scrums_total: 8,
      opp_scrums_stolen: 3, opp_scrums_total: 7,
      own_lineouts_won: 10, own_lineouts_total: 12,
      opp_lineouts_stolen: 3, opp_lineouts_total: 7 },
    { id: 2, label: "Amistoso 2", category: "Reserva", tournament: "Amistosos", opponent: "Córdoba Athletic Club", home: true,
      points_for: 22, points_against: 17, date: "2026-02-14", result: "win",
      tries_for: 3, tries_against: 2, penalties_for: 3, penalties_against: 4,
      own_scrums_won: 5, own_scrums_total: 7,
      opp_scrums_stolen: 2, opp_scrums_total: 6,
      own_lineouts_won: 9, own_lineouts_total: 10,
      opp_lineouts_stolen: 2, opp_lineouts_total: 8 },
    { id: 1, label: "Amistoso 1", category: "Reserva", tournament: "Amistosos", opponent: "Partido Entre Nos",  home: true,
      points_for: 35, points_against: 28, date: "2026-02-07", result: "win",
      tries_for: 5, tries_against: 4, penalties_for: 5, penalties_against: 2,
      own_scrums_won: 5, own_scrums_total: 8,
      opp_scrums_stolen: 4, opp_scrums_total: 8,
      own_lineouts_won: 11, own_lineouts_total: 13,
      opp_lineouts_stolen: 3, opp_lineouts_total: 8 }
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
      { id: 4,  name: "Lucas Rodríguez",   role: "Segunda Línea", minutes: 70, starter: true,  tries: 0, tackles: 4, lineouts_won: 5, lineouts_total: 5, meters: 62 },
      { id: 1,  name: "Francisco Ferraro", role: "Segunda Línea", minutes: 30, starter: false, tries: 0, tackles: 3, lineouts_won: 3, lineouts_total: 5, meters: 12 },
      { id: 2,  name: "Martín González",   role: "Hooker",        minutes: 40, starter: true,  tries: 0, tackles: 5, lineouts_won: 0, lineouts_total: 0, meters: nil },
      { id: 5,  name: "Agustín López",     role: "Flanker",       minutes: 60, starter: true,  tries: 1, tackles: 7, lineouts_won: 0, lineouts_total: 0, meters: nil },
      { id: 7,  name: "Ignacio García",    role: "Medio Scrum",   minutes: 80, starter: true,  tries: 1, tackles: 4, lineouts_won: 0, lineouts_total: 0, meters: nil },
      { id: 8,  name: "Tomás Fernández",   role: "Apertura",      minutes: 80, starter: true,  tries: 0, tackles: 2, lineouts_won: 0, lineouts_total: 0, meters: nil },
      { id: 9,  name: "Pablo Díaz",        role: "Wing",          minutes: 50, starter: false, tries: 1, tackles: 2, lineouts_won: 0, lineouts_total: 0, meters: nil },
      { id: 10, name: "Nicolás Sánchez",   role: "Fullback",      minutes: 80, starter: true,  tries: 1, tackles: 4, lineouts_won: 0, lineouts_total: 0, meters: nil }
    ],
    5 => [
      { id: 1,  name: "Francisco Ferraro", role: "Segunda Línea", minutes: 80, starter: true,  tries: 0, tackles: 8,  lineouts_won: 5, lineouts_total: 6, meters: 32 },
      { id: 4,  name: "Lucas Rodríguez",   role: "Segunda Línea", minutes: 80, starter: true,  tries: 1, tackles: 6,  lineouts_won: 5, lineouts_total: 6, meters: 48 },
      { id: 2,  name: "Martín González",   role: "Hooker",        minutes: 60, starter: true,  tries: 0, tackles: 7,  lineouts_won: 0, lineouts_total: 0, meters: nil },
      { id: 3,  name: "Carlos Pérez",      role: "Pilar Derecho", minutes: 70, starter: true,  tries: 0, tackles: 5,  lineouts_won: 0, lineouts_total: 0, meters: nil },
      { id: 5,  name: "Agustín López",     role: "Flanker",       minutes: 80, starter: true,  tries: 0, tackles: 10, lineouts_won: 0, lineouts_total: 0, meters: nil },
      { id: 6,  name: "Santiago Martínez", role: "Número 8",      minutes: 80, starter: true,  tries: 1, tackles: 8,  lineouts_won: 0, lineouts_total: 0, meters: nil },
      { id: 7,  name: "Ignacio García",    role: "Medio Scrum",   minutes: 80, starter: true,  tries: 0, tackles: 3,  lineouts_won: 0, lineouts_total: 0, meters: nil },
      { id: 8,  name: "Tomás Fernández",   role: "Apertura",      minutes: 80, starter: true,  tries: 1, tackles: 2,  lineouts_won: 0, lineouts_total: 0, meters: nil },
      { id: 9,  name: "Pablo Díaz",        role: "Wing",          minutes: 80, starter: true,  tries: 1, tackles: 2,  lineouts_won: 0, lineouts_total: 0, meters: nil },
      { id: 10, name: "Nicolás Sánchez",   role: "Fullback",      minutes: 80, starter: true,  tries: 0, tackles: 3,  lineouts_won: 0, lineouts_total: 0, meters: nil }
    ],
    6 => [
      { id: 1,  name: "Francisco Ferraro", role: "Segunda Línea", minutes: 55, starter: true,  tries: 0, tackles: 6,  lineouts_won: 3, lineouts_total: 5, meters: 19 },
      { id: 4,  name: "Lucas Rodríguez",   role: "Segunda Línea", minutes: 80, starter: true,  tries: 0, tackles: 5,  lineouts_won: 4, lineouts_total: 5, meters: 33 },
      { id: 2,  name: "Martín González",   role: "Hooker",        minutes: 50, starter: true,  tries: 0, tackles: 4,  lineouts_won: 0, lineouts_total: 0, meters: nil },
      { id: 3,  name: "Carlos Pérez",      role: "Pilar Derecho", minutes: 40, starter: true,  tries: 0, tackles: 3,  lineouts_won: 0, lineouts_total: 0, meters: nil },
      { id: 5,  name: "Agustín López",     role: "Flanker",       minutes: 80, starter: true,  tries: 0, tackles: 8,  lineouts_won: 0, lineouts_total: 0, meters: nil },
      { id: 6,  name: "Santiago Martínez", role: "Número 8",      minutes: 50, starter: true,  tries: 0, tackles: 6,  lineouts_won: 0, lineouts_total: 0, meters: nil },
      { id: 7,  name: "Ignacio García",    role: "Medio Scrum",   minutes: 60, starter: false, tries: 0, tackles: 2,  lineouts_won: 0, lineouts_total: 0, meters: nil },
      { id: 8,  name: "Tomás Fernández",   role: "Apertura",      minutes: 80, starter: true,  tries: 0, tackles: 1,  lineouts_won: 0, lineouts_total: 0, meters: nil },
      { id: 9,  name: "Pablo Díaz",        role: "Wing",          minutes: 80, starter: true,  tries: 0, tackles: 2,  lineouts_won: 0, lineouts_total: 0, meters: nil },
      { id: 10, name: "Nicolás Sánchez",   role: "Fullback",      minutes: 80, starter: true,  tries: 0, tackles: 2,  lineouts_won: 0, lineouts_total: 0, meters: nil }
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
    groups = MATCHES.group_by { |m| m[:category] }
    render inertia: "coach/stats/index", props: { teams: groups }
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
