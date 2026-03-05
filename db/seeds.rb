# frozen_string_literal: true

puts "== Roles =="
%w[Admin Entrenador Jugador PF Nutricionista Médico].each do |name|
  Role.find_or_create_by!(name: name)
end

puts "== Deportes =="
rugby = Sport.find_or_create_by!(name: "Rugby")

puts "== Géneros =="
masculino = Gender.find_or_create_by!(name: "Masculino")
femenino  = Gender.find_or_create_by!(name: "Femenino")

puts "== Temporadas =="
temporada_2026 = Season.find_or_create_by!(name: "Temporada 2026") do |s|
  s.start_date = Date.new(2026, 1, 1)
  s.end_date   = Date.new(2026, 12, 31)
end

puts "== Torneos 2026 =="
Tournament.find_or_create_by!(name: "Top 10",             season: temporada_2026)
Tournament.find_or_create_by!(name: "TDI",                season: temporada_2026)
Tournament.find_or_create_by!(name: "Copa Inter Córdoba", season: temporada_2026)
Tournament.find_or_create_by!(name: "Amistosos",          season: temporada_2026)

puts "== Categorías =="
cat_ps   = Category.find_or_create_by!(name: "Plantel Superior", sport: rugby, gender: masculino)
cat_m20  = Category.find_or_create_by!(name: "M20",              sport: rugby, gender: masculino)
cat_m16  = Category.find_or_create_by!(name: "M16",              sport: rugby, gender: masculino)
cat_m14  = Category.find_or_create_by!(name: "M14",              sport: rugby, gender: masculino)

puts "== Roles funcionales (Rugby) =="
fr_pilares   = FunctionalRole.find_or_create_by!(name: "Pilares",         sport: rugby).tap { |r| r.update!(position_group: "forward") }
fr_hooker    = FunctionalRole.find_or_create_by!(name: "Hooker",          sport: rugby).tap { |r| r.update!(position_group: "forward") }
fr_segundas  = FunctionalRole.find_or_create_by!(name: "Segundas Líneas", sport: rugby).tap { |r| r.update!(position_group: "forward") }
fr_terceras  = FunctionalRole.find_or_create_by!(name: "Terceras Líneas", sport: rugby).tap { |r| r.update!(position_group: "forward") }
fr_ms        = FunctionalRole.find_or_create_by!(name: "Medio Scrum",     sport: rugby).tap { |r| r.update!(position_group: "back") }
fr_apertura  = FunctionalRole.find_or_create_by!(name: "Apertura",        sport: rugby).tap { |r| r.update!(position_group: "back") }
fr_centros   = FunctionalRole.find_or_create_by!(name: "Centros",         sport: rugby).tap { |r| r.update!(position_group: "back") }
fr_alas      = FunctionalRole.find_or_create_by!(name: "Alas",            sport: rugby).tap { |r| r.update!(position_group: "back") }
fr_fullback  = FunctionalRole.find_or_create_by!(name: "Fullback",        sport: rugby).tap { |r| r.update!(position_group: "back") }

puts "== Posiciones (1-15) =="
positions_data = [
  { name: "1 - Pilar izquierdo",  functional_role: fr_pilares  },
  { name: "2 - Hooker",           functional_role: fr_hooker   },
  { name: "3 - Pilar derecho",    functional_role: fr_pilares  },
  { name: "4 - Segunda línea",    functional_role: fr_segundas },
  { name: "5 - Segunda línea",    functional_role: fr_segundas },
  { name: "6 - Flanker ciego",    functional_role: fr_terceras },
  { name: "7 - Flanker abierto",  functional_role: fr_terceras },
  { name: "8 - Número 8",         functional_role: fr_terceras },
  { name: "9 - Medio scrum",      functional_role: fr_ms       },
  { name: "10 - Apertura",        functional_role: fr_apertura },
  { name: "11 - Ala izquierdo",   functional_role: fr_alas     },
  { name: "12 - Centro",          functional_role: fr_centros  },
  { name: "13 - Centro",          functional_role: fr_centros  },
  { name: "14 - Ala derecho",     functional_role: fr_alas     },
  { name: "15 - Fullback",        functional_role: fr_fullback },
]
positions_data.each { |p| Position.find_or_create_by!(name: p[:name], functional_role: p[:functional_role]) }

puts "== Tipos de estadística de partido =="
# Colectivas (collective: true)
[
  { name: "Tries a favor",          unit: nil,  collective: true  },
  { name: "Tries en contra",        unit: nil,  collective: true  },
  { name: "Puntos a favor",         unit: nil,  collective: true  },
  { name: "Puntos en contra",       unit: nil,  collective: true  },
  { name: "Scrums propios ganados", unit: nil,  collective: true  },
  { name: "Scrums propios totales", unit: nil,  collective: true  },
  { name: "Scrums rival ganados",   unit: nil,  collective: true  },
  { name: "Scrums rival totales",   unit: nil,  collective: true  },
  { name: "Lineouts propios ganados", unit: nil, collective: true },
  { name: "Lineouts propios totales", unit: nil, collective: true },
  { name: "Lineouts rival ganados",   unit: nil, collective: true },
  { name: "Lineouts rival totales",   unit: nil, collective: true },
  { name: "Penales a favor",        unit: nil,  collective: true  },
  { name: "Penales en contra",      unit: nil,  collective: true  },
  # Individuales (collective: false)
  { name: "Tries",                  unit: nil,  collective: false },
  { name: "Tackles realizados",     unit: nil,  collective: false },
  { name: "Tackles perdidos",       unit: nil,  collective: false },
  { name: "Metros ganados",         unit: "m",  collective: false },
  { name: "Lineouts ganados",       unit: nil,  collective: false },
  { name: "Lineouts totales",       unit: nil,  collective: false },
  { name: "Minutos jugados",        unit: "min", collective: false },
  { name: "Portaciones",            unit: nil,  collective: false },
  { name: "Rucks ganados",          unit: nil,  collective: false },
].each { |s| MatchStatType.find_or_create_by!(name: s[:name]) { |r| r.unit = s[:unit]; r.collective = s[:collective] } }

puts "== Tipos de lesión =="
[
  "Muscular", "Ósea", "Ligamentaria", "Tendinosa",
  "Contusión", "Fractura", "Esguince", "Luxación", "Otra"
].each { |n| InjuryType.find_or_create_by!(name: n) }

puts "== Pruebas físicas (Rugby) =="
[
  { name: "Bronco Test",        unit: "min:seg" },
  { name: "Yo-Yo Test",         unit: "nivel"   },
  { name: "CMJ",                unit: "cm"      },
  { name: "Squat 1RM",          unit: "kg"      },
  { name: "Bench Press 1RM",    unit: "kg"      },
  { name: "Deadlift 1RM",       unit: "kg"      },
  { name: "Velocidad 40m",      unit: "seg"     },
  { name: "Agilidad 5-10-5",    unit: "seg"     },
  { name: "% Grasa corporal",   unit: "%"       },
  { name: "Masa muscular",      unit: "kg"      },
].each { |t| PhysicalTest.find_or_create_by!(name: t[:name], sport: rugby) { |r| r.unit = t[:unit] } }

puts "== Métricas GPS =="
[
  { name: "Distancia total",             unit: "m"    },
  { name: "Distancia alta intensidad",   unit: "m"    },
  { name: "Velocidad máxima",            unit: "km/h" },
  { name: "Aceleraciones",               unit: "n"    },
  { name: "Desaceleraciones",            unit: "n"    },
  { name: "Impactos totales",            unit: "n"    },
  { name: "PlayerLoad",                  unit: "UA"   },
  { name: "Tiempo en alta intensidad",   unit: "seg"  },
].each { |m| GpsMetricType.find_or_create_by!(name: m[:name]) { |r| r.unit = m[:unit] } }

puts "== Tipos de sesión GPS =="
%w[Partido Entrenamiento].each { |n| GpsSessionType.find_or_create_by!(name: n) }

puts "== Usuario Admin =="
admin_role = Role.find_by!(name: "Admin")
admin_user = User.find_or_create_by!(email: "admin@palermobajo.com") do |u|
  u.name       = "Admin"
  u.first_name = "Admin"
  u.last_name  = "Sistema"
  u.password   = "palermobajo2026!"
  u.verified   = true
end
unless admin_user.user_roles.joins(:role).exists?(roles: { name: "Admin" })
  admin_user.user_roles.create!(
    role:       admin_role,
    active:     true,
    start_date: Date.today
  )
end

puts "== Usuarios de prueba por rol =="

temporada = Season.find_by!(name: "Temporada 2026")
cat_ps    = Category.find_by!(name: "Plantel Superior")

# --- Entrenador ---
role_coach = Role.find_by!(name: "Entrenador")
coach_user = User.find_or_create_by!(email: "coach@palermobajo.com") do |u|
  u.name       = "Carlos Méndez"
  u.first_name = "Carlos"
  u.last_name  = "Méndez"
  u.password   = "palermobajo2026!"
  u.verified   = true
end
unless coach_user.user_roles.joins(:role).exists?(roles: { name: "Entrenador" })
  coach_user.user_roles.create!(role: role_coach, active: true, start_date: Date.today, category: cat_ps)
end
coach = Coach.find_or_create_by!(user: coach_user) do |c|
  c.first_name = "Carlos"
  c.last_name  = "Méndez"
  c.active     = true
end
unless CoachCategory.exists?(coach: coach, category: cat_ps, season: temporada)
  CoachCategory.create!(coach: coach, category: cat_ps, season: temporada, start_date: Date.today, role_function: "Head Coach")
end

# --- PF ---
role_pf = Role.find_by!(name: "PF")
pf_user = User.find_or_create_by!(email: "pf@palermobajo.com") do |u|
  u.name       = "Tomás Ruiz"
  u.first_name = "Tomás"
  u.last_name  = "Ruiz"
  u.password   = "palermobajo2026!"
  u.verified   = true
end
unless pf_user.user_roles.joins(:role).exists?(roles: { name: "PF" })
  pf_user.user_roles.create!(role: role_pf, active: true, start_date: Date.today, category: cat_ps)
end

# --- Nutricionista ---
role_nutri = Role.find_by!(name: "Nutricionista")
nutri_user = User.find_or_create_by!(email: "nutri@palermobajo.com") do |u|
  u.name       = "Valentina Sosa"
  u.first_name = "Valentina"
  u.last_name  = "Sosa"
  u.password   = "palermobajo2026!"
  u.verified   = true
end
unless nutri_user.user_roles.joins(:role).exists?(roles: { name: "Nutricionista" })
  nutri_user.user_roles.create!(role: role_nutri, active: true, start_date: Date.today)
end

puts "== Jugadores de prueba =="

masculino    = Gender.find_by!(name: "Masculino")
fr_pilares   = FunctionalRole.find_by!(name: "Pilares")
fr_segundas  = FunctionalRole.find_by!(name: "Segundas Líneas")
fr_terceras  = FunctionalRole.find_by!(name: "Terceras Líneas")
fr_ms        = FunctionalRole.find_by!(name: "Medio Scrum")
fr_apertura  = FunctionalRole.find_by!(name: "Apertura")
fr_centros   = FunctionalRole.find_by!(name: "Centros")
fr_alas      = FunctionalRole.find_by!(name: "Alas")
fr_fullback  = FunctionalRole.find_by!(name: "Fullback")
role_jugador = Role.find_by!(name: "Jugador")

players_data = [
  { first: "Francisco", last: "Ferraro",   dni: "43561678", birth: "2001-10-17", fr: fr_segundas, height: 190, weight: 105.0, muscle: 58.0, fat: 17.0, user_email: "jugador@palermobajo.com" },
  { first: "Martín",    last: "García",     dni: "38001002", birth: "1999-07-23", fr: fr_pilares,  height: 182, weight: 112.5, muscle: 78.2, fat: 18.4, user_email: nil },
  { first: "Santiago",  last: "López",      dni: "38001003", birth: "2000-01-15", fr: fr_terceras, height: 186, weight: 97.3,  muscle: 68.1, fat: 15.2, user_email: nil },
  { first: "Facundo",   last: "Martínez",   dni: "38001004", birth: "1997-11-08", fr: fr_ms,       height: 176, weight: 82.0,  muscle: 60.4, fat: 12.1, user_email: nil },
  { first: "Tomás",     last: "Rodríguez",  dni: "38001005", birth: "2001-03-30", fr: fr_apertura, height: 178, weight: 85.5,  muscle: 62.7, fat: 13.5, user_email: nil },
  { first: "Agustín",   last: "Gómez",      dni: "38001006", birth: "1999-09-14", fr: fr_centros,  height: 180, weight: 91.2,  muscle: 65.3, fat: 14.9, user_email: nil },
  { first: "Nicolás",   last: "Díaz",       dni: "38001007", birth: "2000-06-27", fr: fr_alas,     height: 177, weight: 88.0,  muscle: 63.8, fat: 13.8, user_email: nil },
  { first: "Leandro",   last: "Pérez",      dni: "38001008", birth: "1998-12-05", fr: fr_fullback, height: 179, weight: 86.5,  muscle: 61.2, fat: 13.2, user_email: nil },
  { first: "Joaquín",   last: "Suárez",     dni: "38001009", birth: "2001-08-19", fr: fr_pilares,  height: 183, weight: 108.0, muscle: 75.6, fat: 17.5, user_email: nil },
  { first: "Matías",    last: "Álvarez",    dni: "38001010", birth: "2000-02-28", fr: fr_terceras, height: 185, weight: 95.0,  muscle: 67.4, fat: 15.8, user_email: nil },
  { first: "Bruno",     last: "Torres",     dni: "38001011", birth: "1999-05-11", fr: fr_centros,  height: 178, weight: 89.5,  muscle: 64.1, fat: 14.3, user_email: nil },
  { first: "Ezequiel",  last: "Romero",     dni: "38001012", birth: "2002-10-22", fr: fr_alas,     height: 175, weight: 83.0,  muscle: 59.8, fat: 12.6, user_email: nil },
]

players_data.each_with_index do |pd, i|
  # Create user account for the first player (jugador@palermobajo.com)
  user = nil
  if pd[:user_email]
    user = User.find_or_create_by!(email: pd[:user_email]) do |u|
      u.name       = "#{pd[:first]} #{pd[:last]}"
      u.first_name = pd[:first]
      u.last_name  = pd[:last]
      u.dni        = pd[:dni]
      u.password   = "palermobajo2026!"
      u.verified   = true
    end
    unless user.user_roles.joins(:role).exists?(roles: { name: "Jugador" })
      user.user_roles.create!(role: role_jugador, active: true, start_date: Date.today)
    end
  end

  player = Player.find_or_create_by!(dni: pd[:dni]) do |p|
    p.first_name      = pd[:first]
    p.last_name       = pd[:last]
    p.birth_date      = pd[:birth]
    p.gender          = masculino
    p.functional_role = pd[:fr]
    p.active          = true
    p.user            = user
  end

  # player_categories
  unless PlayerCategory.exists?(player: player, category: cat_ps, season: temporada)
    PlayerCategory.create!(player: player, category: cat_ps, season: temporada, active: true, start_date: Date.today)
  end

  # physical_histories — 6 pesajes de oct-2025 a hoy (progreso realista de temporada)
  [
    { d: Date.today - 150, w_off:  4.0, m_off: -2.0, f_off:  3.5 },  # Oct
    { d: Date.today - 120, w_off:  3.0, m_off: -1.2, f_off:  2.5 },  # Nov
    { d: Date.today -  90, w_off:  2.0, m_off: -0.5, f_off:  1.8 },  # Dic
    { d: Date.today -  60, w_off:  1.2, m_off:  0.3, f_off:  1.0 },  # Ene
    { d: Date.today -  30, w_off:  0.5, m_off:  0.3, f_off:  0.3 },  # Feb
    { d: Date.today,       w_off:  0.0, m_off:  0.0, f_off:  0.0 },  # Mar
  ].each do |ph|
    unless PhysicalHistory.exists?(player: player, date: ph[:d])
      w = pd[:weight] + ph[:w_off]
      m = pd[:muscle] + ph[:m_off]
      f = pd[:fat]    + ph[:f_off]
      PhysicalHistory.create!(
        player:           player,
        date:             ph[:d],
        weight_kg:        w,
        muscle_mass_kg:   m,
        fat_mass_kg:      f,
        height_cm:        pd[:height] || (178 + (i % 12)),
        bmi:              (w / (((pd[:height] || (178 + (i % 12))) / 100.0) ** 2)).round(1),
        muscle_direction: ph[:m_off].zero? ? nil : (ph[:m_off] > 0 ? "up" : "down"),
        fat_direction:    ph[:f_off].zero? ? nil : (ph[:f_off] > 0 ? "up" : "down")
      )
    end
  end

  # player_wellness — últimos 7 días
  7.times do |day|
    date = Date.today - day
    next if PlayerWellness.exists?(player: player, date: date)
    PlayerWellness.create!(
      player:            player,
      date:              date,
      sleep_hours:       (6.5 + rand * 2).round(1),
      sleep_quality:     rand(3..5),
      energy_level:      rand(3..5),
      fatigue:           rand(1..5),
      mood:              rand(3..5),
      stress:            rand(1..5),
      leg_feel:          rand(1..4),
      pain:              rand(1..4),
      training_readiness: rand(1..3)
    )
  end
end

puts "== Entrenamientos (mock) =="

rugby        = Sport.find_by!(name: "Rugby")
cat_ps       = Category.find_by!(name: "Plantel Superior")
temporada    = Season.find_by!(name: "Temporada 2026")
pf_user      = User.find_by!(email: "pf@palermobajo.com")
coach_user   = User.find_by!(email: "coach@palermobajo.com")

fr_pilares   = FunctionalRole.find_by!(name: "Pilares",         sport: rugby)
fr_hooker    = FunctionalRole.find_by!(name: "Hooker",          sport: rugby)
fr_segundas  = FunctionalRole.find_by!(name: "Segundas Líneas", sport: rugby)
fr_terceras  = FunctionalRole.find_by!(name: "Terceras Líneas", sport: rugby)
fr_ms        = FunctionalRole.find_by!(name: "Medio Scrum",     sport: rugby)
fr_apertura  = FunctionalRole.find_by!(name: "Apertura",        sport: rugby)
fr_centros   = FunctionalRole.find_by!(name: "Centros",         sport: rugby)
fr_alas      = FunctionalRole.find_by!(name: "Alas",            sport: rugby)
fr_fullback  = FunctionalRole.find_by!(name: "Fullback",        sport: rugby)

all_forward_roles = [fr_pilares, fr_hooker, fr_segundas, fr_terceras]
all_back_roles    = [fr_ms, fr_apertura, fr_centros, fr_alas, fr_fullback]
all_roles         = all_forward_roles + all_back_roles

trainings_data = [
  # Pasados — PF (preparación física)
  {
    date: Date.today - 21, training_type: "fisico", objective: "Capacidad aeróbica (Bronco Test)",
    start_time: "09:00", end_time: "11:00", duration_min: 120, validated: true, notes: "Test inicial de la temporada.",
    roles: all_roles
  },
  {
    date: Date.today - 19, training_type: "rugby", objective: "Líneas de ataque y defensa en campo",
    start_time: "17:00", end_time: "19:00", duration_min: 120, validated: true, notes: "Buen ritmo de los backs en ataque.",
    roles: all_roles
  },
  {
    date: Date.today - 14, training_type: "fuerza", objective: "Fuerza máxima — Squat y Deadlift",
    start_time: "09:00", end_time: "10:30", duration_min: 90, validated: true, notes: "Se trabajó en bloques de 5x3 al 85% del 1RM.",
    roles: all_forward_roles
  },
  {
    date: Date.today - 12, training_type: "rugby", objective: "Lineouts y scrums — trabajo de set pieces",
    start_time: "17:00", end_time: "19:00", duration_min: 120, validated: true, notes: "Lineouts propios con buen porcentaje. Reforzar codificación.",
    roles: all_forward_roles
  },
  {
    date: Date.today - 10, training_type: "fisico", objective: "Potencia y velocidad — CMJ + 40m",
    start_time: "08:30", end_time: "10:00", duration_min: 90, validated: true, notes: "Backs mostraron mejora en velocidad. Revisar CMJ terceras líneas.",
    roles: all_back_roles
  },
  {
    date: Date.today - 7, training_type: "fuerza", objective: "Fuerza explosiva — Bench Press + Squat",
    start_time: "09:00", end_time: "11:00", duration_min: 120, validated: false, notes: nil,
    roles: [fr_pilares, fr_hooker, fr_segundas]
  },
  {
    date: Date.today - 5, training_type: "rugby", objective: "Juego de fase — picking y maul ofensivo",
    start_time: "17:30", end_time: "19:30", duration_min: 120, validated: true, notes: "Forwards con buena dinámica en maul.",
    roles: all_roles
  },
  {
    date: Date.today - 3, training_type: "fisico", objective: "Regenerativo post-partido",
    start_time: "10:00", end_time: "11:00", duration_min: 60, validated: false, notes: "Trabajo de movilidad y elongación.",
    roles: all_roles
  },
  # Futuros — PF
  {
    date: Date.today + 4, training_type: "fuerza", objective: "Bloque de fuerza máxima — forwards",
    start_time: "09:00", end_time: "11:00", duration_min: 120, validated: false, notes: nil,
    roles: all_forward_roles
  },
  {
    date: Date.today + 5, training_type: "rugby", objective: "Entrenamiento de campo — preparación vs Universitario",
    start_time: "17:00", end_time: "19:00", duration_min: 120, validated: false, notes: nil,
    roles: all_roles
  },
  {
    date: Date.today + 7, training_type: "fisico", objective: "Yo-Yo Test — evaluación backs",
    start_time: "09:00", end_time: "10:30", duration_min: 90, validated: false, notes: nil,
    roles: all_back_roles
  },
  {
    date: Date.today + 9, training_type: "rugby", objective: "Táctica defensiva — sistemas y roles",
    start_time: "17:30", end_time: "19:30", duration_min: 120, validated: false, notes: nil,
    roles: all_roles
  },
  {
    date: Date.today + 11, training_type: "fisico", objective: "Test integral de plantel completo",
    start_time: "08:00", end_time: "11:00", duration_min: 180, validated: false, notes: nil,
    roles: all_roles
  },
]

created_trainings = []
trainings_data.each do |td|
  t = Training.find_or_create_by!(
    category:      cat_ps,
    season:        temporada,
    date:          td[:date],
    training_type: td[:training_type]
  ) do |r|
    r.objective    = td[:objective]
    r.start_time   = td[:start_time]
    r.end_time     = td[:end_time]
    r.duration_min = td[:duration_min]
    r.validated    = td[:validated]
    r.notes        = td[:notes]
    r.created_by   = nil
  end

  td[:roles].each do |fr|
    TrainingFunctionalRole.find_or_create_by!(training: t, functional_role: fr)
  end

  created_trainings << t
end

puts "   #{created_trainings.size} entrenamientos creados."

puts "== Evaluaciones físicas (mock) =="

players   = Player.joins(:player_categories)
                  .where(player_categories: { category: cat_ps, season: temporada })
                  .to_a

pt_bronco  = PhysicalTest.find_by!(name: "Bronco Test",     sport: rugby)
pt_yoyo    = PhysicalTest.find_by!(name: "Yo-Yo Test",      sport: rugby)
pt_cmj     = PhysicalTest.find_by!(name: "CMJ",             sport: rugby)
pt_squat   = PhysicalTest.find_by!(name: "Squat 1RM",       sport: rugby)
pt_bench   = PhysicalTest.find_by!(name: "Bench Press 1RM", sport: rugby)
pt_dead    = PhysicalTest.find_by!(name: "Deadlift 1RM",    sport: rugby)
pt_vel40   = PhysicalTest.find_by!(name: "Velocidad 40m",   sport: rugby)
pt_agil    = PhysicalTest.find_by!(name: "Agilidad 5-10-5", sport: rugby)

# Valores base por posición: [bronco_s, yoyo, cmj_cm, squat_kg, bench_kg, dead_kg, vel40_s, agil_s]
role_base = {
  fr_pilares  => { bronco: 285, yoyo: 11.2, cmj: 32, squat: 145, bench: 120, dead: 165, vel40: 5.4, agil: 4.6 },
  fr_hooker   => { bronco: 290, yoyo: 11.5, cmj: 34, squat: 140, bench: 115, dead: 160, vel40: 5.3, agil: 4.5 },
  fr_segundas => { bronco: 280, yoyo: 11.8, cmj: 38, squat: 155, bench: 125, dead: 175, vel40: 5.1, agil: 4.4 },
  fr_terceras => { bronco: 295, yoyo: 12.5, cmj: 42, squat: 150, bench: 118, dead: 170, vel40: 4.9, agil: 4.2 },
  fr_ms       => { bronco: 305, yoyo: 13.0, cmj: 45, squat: 120, bench: 100, dead: 145, vel40: 4.7, agil: 4.0 },
  fr_apertura => { bronco: 310, yoyo: 13.5, cmj: 47, squat: 115, bench: 95,  dead: 140, vel40: 4.6, agil: 3.9 },
  fr_centros  => { bronco: 300, yoyo: 13.2, cmj: 44, squat: 125, bench: 105, dead: 148, vel40: 4.8, agil: 4.1 },
  fr_alas     => { bronco: 315, yoyo: 13.8, cmj: 49, squat: 110, bench: 92,  dead: 135, vel40: 4.5, agil: 3.8 },
  fr_fullback => { bronco: 308, yoyo: 13.3, cmj: 46, squat: 118, bench: 98,  dead: 142, vel40: 4.6, agil: 3.9 },
}

# ── Sesiones de evaluación física ────────────────────────────────────────────
# 4 fechas de medición. Algunos tests de los últimos 2 jugadores tienen 1 sola
# entrada (agil y vel40 en sesión B no los incluye) → se muestra tabla sin gráfico.
PhysicalEvaluation.destroy_all

eval_sessions = [
  {
    date: Date.today - 84,
    tests: ->(base, idx) {[
      [pt_bronco, (base[:bronco] * (0.88 + rand * 0.04)).round(1)],
      [pt_yoyo,   (base[:yoyo]  * (0.88 + rand * 0.05)).round(1)],
      [pt_cmj,    (base[:cmj]   * (0.85 + rand * 0.06)).round(1)],
      [pt_squat,  (base[:squat] * (0.90 + rand * 0.04)).round(1)],
      [pt_bench,  (base[:bench] * (0.88 + rand * 0.05)).round(1)],
      [pt_dead,   (base[:dead]  * (0.89 + rand * 0.05)).round(1)],
    ]}
  },
  {
    date: Date.today - 56,
    tests: ->(base, idx) {
      base_tests = [
        [pt_bronco, (base[:bronco] * (0.92 + rand * 0.04)).round(1)],
        [pt_yoyo,   (base[:yoyo]  * (0.92 + rand * 0.05)).round(1)],
        [pt_cmj,    (base[:cmj]   * (0.90 + rand * 0.06)).round(1)],
        [pt_squat,  (base[:squat] * (0.93 + rand * 0.04)).round(1)],
        [pt_bench,  (base[:bench] * (0.91 + rand * 0.05)).round(1)],
        [pt_dead,   (base[:dead]  * (0.92 + rand * 0.05)).round(1)],
        [pt_vel40,  (base[:vel40] * (1.05 - rand * 0.03)).round(2)],
        [pt_agil,   (base[:agil]  * (1.04 - rand * 0.03)).round(2)],
      ]
      # últimos 2 jugadores NO hacen vel40/agil esta sesión → quedarán con 1 sola entrada
      idx >= 10 ? base_tests.first(6) : base_tests
    }
  },
  {
    date: Date.today - 28,
    tests: ->(base, idx) {
      all = [
        [pt_bronco, (base[:bronco] * (0.96 + rand * 0.04)).round(1)],
        [pt_yoyo,   (base[:yoyo]  * (0.96 + rand * 0.05)).round(1)],
        [pt_cmj,    (base[:cmj]   * (0.94 + rand * 0.06)).round(1)],
        [pt_squat,  (base[:squat] * (0.96 + rand * 0.04)).round(1)],
        [pt_bench,  (base[:bench] * (0.95 + rand * 0.05)).round(1)],
        [pt_dead,   (base[:dead]  * (0.96 + rand * 0.05)).round(1)],
        [pt_vel40,  (base[:vel40] * (1.02 - rand * 0.02)).round(2)],
        [pt_agil,   (base[:agil]  * (1.02 - rand * 0.02)).round(2)],
      ]
      # últimos 2 jugadores tampoco hacen vel40/agil esta sesión → sólo 1 entrada en sesión D
      idx >= 10 ? all.first(6) : all
    }
  },
  {
    date: Date.today - 7,
    tests: ->(base, idx) {[
      [pt_bronco, (base[:bronco] * (1.00 + rand * 0.04)).round(1)],
      [pt_yoyo,   (base[:yoyo]  * (1.00 + rand * 0.05)).round(1)],
      [pt_cmj,    (base[:cmj]   * (0.98 + rand * 0.06)).round(1)],
      [pt_squat,  (base[:squat] * (1.00 + rand * 0.04)).round(1)],
      [pt_bench,  (base[:bench] * (0.99 + rand * 0.05)).round(1)],
      [pt_dead,   (base[:dead]  * (1.00 + rand * 0.05)).round(1)],
      [pt_vel40,  (base[:vel40] * (0.98 - rand * 0.02)).round(2)],
      [pt_agil,   (base[:agil]  * (0.98 - rand * 0.02)).round(2)],
    ]}
  },
]

eval_sessions.each do |session|
  players.each_with_index do |player, idx|
    fr   = player.functional_role
    base = role_base[fr] || role_base[fr_terceras]

    session[:tests].(base, idx).each do |test, value|
      PhysicalEvaluation.create!(
        player:       player,
        physical_test: test,
        date:         session[:date],
        value:        value,
        validated:    true,
        validated_by: pf_user
      )
    end
  end
end

puts "   #{PhysicalEvaluation.count} evaluaciones físicas creadas."

puts "== Percepciones y asistencias (mock) =="

past_trainings = created_trainings.select { |t| t.date < Date.today }

past_trainings.each do |training|
  # Jugadores del plantel (todos)
  players_for_training = Player.joins(:player_categories)
                               .where(player_categories: { category: cat_ps, season: temporada })
                               .to_a

  players_for_training.each do |player|
    # Asistencia (90% presentes)
    present = rand < 0.90
    TrainingAttendance.find_or_create_by!(training: training, player: player) do |a|
      a.present             = present
      a.participated_minutes = present ? (training.duration_min.to_i * rand(0.7..1.0)).round : 0
      a.absence_reason      = present ? nil : ["Lesión", "Personal", "Trabajo", "Estudio"].sample
    end

    next unless present

    # Percepción (solo si asistió)
    TrainingPerception.find_or_create_by!(training: training, player: player) do |p|
      p.rpe            = rand(5..10)
      p.perceived_load = rand(6..10)
      p.fatigue_level  = rand(2..5)
      p.injury_impact  = rand(1..4)
      p.comments       = [
        "Sesión exigente, bien dosificada.",
        "Me sentí bien durante todo el trabajo.",
        "Un poco pesado de piernas al final.",
        "Buena intensidad, me gustó el bloque de fuerza.",
        nil, nil  # algunos sin comentario
      ].sample
    end
  end
end

puts "   #{TrainingPerception.count} percepciones y #{TrainingAttendance.count} asistencias creadas."

puts "== Objetivos físicos por rol =="

cat_ps        = Category.find_by!(name: "Plantel Superior")
pt_bronco     = PhysicalTest.find_by!(name: "Bronco Test",     sport: rugby)
pt_yoyo       = PhysicalTest.find_by!(name: "Yo-Yo Test",      sport: rugby)
pt_cmj        = PhysicalTest.find_by!(name: "CMJ",             sport: rugby)
pt_squat      = PhysicalTest.find_by!(name: "Squat 1RM",       sport: rugby)
pt_bench      = PhysicalTest.find_by!(name: "Bench Press 1RM", sport: rugby)
pt_dead       = PhysicalTest.find_by!(name: "Deadlift 1RM",    sport: rugby)
pt_vel40      = PhysicalTest.find_by!(name: "Velocidad 40m",   sport: rugby)
pt_agil       = PhysicalTest.find_by!(name: "Agilidad 5-10-5", sport: rugby)

fr_pilares    = FunctionalRole.find_by!(name: "Pilares")
fr_segundas   = FunctionalRole.find_by!(name: "Segundas Líneas")
fr_terceras   = FunctionalRole.find_by!(name: "Terceras Líneas")
fr_ms         = FunctionalRole.find_by!(name: "Medio Scrum")
fr_apertura   = FunctionalRole.find_by!(name: "Apertura")
fr_centros    = FunctionalRole.find_by!(name: "Centros")
fr_alas       = FunctionalRole.find_by!(name: "Alas")
fr_fullback   = FunctionalRole.find_by!(name: "Fullback")

forward_roles = [fr_pilares, fr_segundas, fr_terceras]
back_roles    = [fr_ms, fr_apertura, fr_centros, fr_alas, fr_fullback]

# Definición de objetivos por grupo y test.
# "min"  → mayor es mejor (Bronco, YoYo, CMJ, fuerza)
# "max"  → menor es mejor (Vel40, Agil)
# formula "weight_ratio" → thresholds son multiplicadores del peso corporal
obj_specs = [
  {
    test: pt_bronco, formula: "absolute", threshold_type: "min",
    forward: { red: 1700, yellow: 2000, green: 2200 },
    back:    { red: 1900, yellow: 2200, green: 2450 }
  },
  {
    test: pt_yoyo, formula: "absolute", threshold_type: "min",
    forward: { red: 12.5, yellow: 13.0, green: 14.0 },
    back:    { red: 13.5, yellow: 14.5, green: 15.5 }
  },
  {
    test: pt_cmj, formula: "absolute", threshold_type: "min",
    forward: { red: 28, yellow: 35, green: 42 },
    back:    { red: 32, yellow: 40, green: 48 }
  },
  # Fuerza: formula weight_ratio → red/yellow/green son multiplicadores del peso
  {
    test: pt_squat, formula: "weight_ratio", threshold_type: "min",
    forward: { red: 1.3, yellow: 1.7, green: 2.0 },
    back:    { red: 1.2, yellow: 1.6, green: 1.9 }
  },
  {
    test: pt_bench, formula: "weight_ratio", threshold_type: "min",
    forward: { red: 0.8, yellow: 1.0, green: 1.3 },
    back:    { red: 0.7, yellow: 0.9, green: 1.2 }
  },
  {
    test: pt_dead, formula: "weight_ratio", threshold_type: "min",
    forward: { red: 1.5, yellow: 1.9, green: 2.3 },
    back:    { red: 1.4, yellow: 1.8, green: 2.1 }
  },
  # Velocidad: "max" → menor es mejor.
  # red_threshold = peor límite (ej: > 5.5 s = rojo); green_threshold = mejor límite
  {
    test: pt_vel40, formula: "absolute", threshold_type: "max",
    forward: { red: 5.5, yellow: 5.1, green: 4.9 },
    back:    { red: 5.1, yellow: 4.8, green: 4.6 }
  },
  {
    test: pt_agil, formula: "absolute", threshold_type: "max",
    forward: { red: 4.7, yellow: 4.4, green: 4.2 },
    back:    { red: 4.4, yellow: 4.1, green: 3.9 }
  },
]

PhysicalObjective.where(category: cat_ps).destroy_all

obj_specs.each do |spec|
  { forward: forward_roles, back: back_roles }.each do |group, roles|
    vals = spec[group]
    roles.each do |fr|
      PhysicalObjective.create!(
        category:         cat_ps,
        functional_role:  fr,
        physical_test:    spec[:test],
        formula:          spec[:formula],
        threshold_type:   spec[:threshold_type],
        red_threshold:    vals[:red],
        yellow_threshold: vals[:yellow],
        green_threshold:  vals[:green]
      )
    end
  end
end

puts "   #{PhysicalObjective.count} objetivos físicos creados."

puts "== Partidos (mock) =="

cat_ps     = Category.find_by!(name: "Plantel Superior")
temporada  = Season.find_by!(name: "Temporada 2026")

torneo = Tournament.find_or_create_by!(name: "URBA Top 12 2026", season: temporada)

test_player = Player.joins(:user).where(users: { email: "jugador@palermobajo.com" }).first || Player.first

Match.where(category: cat_ps, tournament: torneo).destroy_all

matches_data = [
  { date: Date.today - 42, opponent: "Los Matreros", home: true,  team_name: "Primera",      points_for: 41, points_against: 12, kickoff_time: "15:00" },
  { date: Date.today - 28, opponent: "Regatas",      home: false, team_name: "Primera",      points_for: 17, points_against: 22, kickoff_time: "14:30" },
  { date: Date.today - 28, opponent: "Regatas",      home: false, team_name: "Intermedia",   points_for: 22, points_against: 18, kickoff_time: "12:30" },
  { date: Date.today - 14, opponent: "Hindú",        home: true,  team_name: "Primera",      points_for: 32, points_against: 20, kickoff_time: "15:00" },
  { date: Date.today - 14, opponent: "Hindú",        home: true,  team_name: "Intermedia",   points_for: 19, points_against: 25, kickoff_time: "13:00" },
  { date: Date.today - 7,  opponent: "SIC",          home: false, team_name: "Primera",      points_for: 9,  points_against: 14, kickoff_time: "15:00" },
  { date: Date.today + 7,  opponent: "Universitario", home: true,  team_name: "Primera",      points_for: nil, points_against: nil, kickoff_time: "15:00" },
  { date: Date.today + 7,  opponent: "Universitario", home: true,  team_name: "Intermedia",   points_for: nil, points_against: nil, kickoff_time: "13:00" },
  { date: Date.today + 7,  opponent: "Universitario", home: true,  team_name: "Pre-Senior",   points_for: nil, points_against: nil, kickoff_time: "11:00" },
]

created_matches = matches_data.map do |md|
  match = Match.create!(
    category:       cat_ps,
    tournament:     torneo,
    date:           md[:date],
    opponent:       md[:opponent],
    home:           md[:home],
    team_name:      md[:team_name],
    points_for:     md[:points_for],
    points_against: md[:points_against],
    kickoff_time:   md[:kickoff_time]
  )

  # Assign all players from the category to the match (squad)
  players_in_cat = Player.joins(:player_categories)
                         .where(player_categories: { category: cat_ps, active: true, end_date: nil })
  players_in_cat.each_with_index do |player, idx|
    # Only put a subset per team to make it realistic
    next if md[:team_name] == "Primera"    && idx >= 22
    next if md[:team_name] == "Intermedia" && (idx < 4 || idx >= 22)
    next if md[:team_name] == "Pre-Senior" && idx < 8
    MatchPlayer.find_or_create_by!(player: player, match: match) do |mp|
      mp.starter        = idx < 15
      mp.minutes_played = match.points_for.nil? ? nil : (mp.starter ? 80 : rand(20..60))
    end
  end
  match
end

puts "   #{Match.count} partidos | #{MatchPlayer.count} convocatorias creadas."

# Set test player as suplente for the upcoming Primera match
future_primera = created_matches.find { |m| m.date >= Date.today && m.team_name == "Primera" }
if future_primera && test_player
  MatchPlayer.find_by(player: test_player, match: future_primera)&.update!(starter: false)
end

puts "== Estadísticas de partido (Francisco + equipo) =="
if test_player
  # Individual stat types
  st = MatchStatType.all.index_by(&:name)

  # Stat profiles per past match (by opponent)
  player_stats_data = {
    "Los Matreros" => { "Tries" => 1, "Tackles realizados" => 9, "Tackles perdidos" => 1, "Metros ganados" => 42, "Portaciones" => 11, "Rucks ganados" => 5, "Lineouts ganados" => 6, "Lineouts totales" => 7 },
    "Regatas"      => { "Tries" => 0, "Tackles realizados" => 11, "Tackles perdidos" => 2, "Metros ganados" => 27, "Portaciones" => 8, "Rucks ganados" => 3, "Lineouts ganados" => 4, "Lineouts totales" => 6 },
    "Hindú"        => { "Tries" => 2, "Tackles realizados" => 7, "Tackles perdidos" => 1, "Metros ganados" => 51, "Portaciones" => 13, "Rucks ganados" => 6, "Lineouts ganados" => 7, "Lineouts totales" => 8 },
    "SIC"          => { "Tries" => 0, "Tackles realizados" => 12, "Tackles perdidos" => 3, "Metros ganados" => 18, "Portaciones" => 6, "Rucks ganados" => 4, "Lineouts ganados" => 3, "Lineouts totales" => 5 },
  }

  # Team (collective) stats per past match
  team_stats_data = {
    "Los Matreros" => { "Scrums propios ganados" => 8, "Scrums propios totales" => 9, "Scrums rival ganados" => 4, "Scrums rival totales" => 7, "Lineouts propios ganados" => 12, "Lineouts propios totales" => 14, "Lineouts rival ganados" => 5, "Lineouts rival totales" => 8 },
    "Regatas"      => { "Scrums propios ganados" => 6, "Scrums propios totales" => 9, "Scrums rival ganados" => 7, "Scrums rival totales" => 8, "Lineouts propios ganados" => 9, "Lineouts propios totales" => 12, "Lineouts rival ganados" => 8, "Lineouts rival totales" => 10 },
    "Hindú"        => { "Scrums propios ganados" => 9, "Scrums propios totales" => 10, "Scrums rival ganados" => 5, "Scrums rival totales" => 8, "Lineouts propios ganados" => 13, "Lineouts propios totales" => 15, "Lineouts rival ganados" => 6, "Lineouts rival totales" => 9 },
    "SIC"          => { "Scrums propios ganados" => 5, "Scrums propios totales" => 9, "Scrums rival ganados" => 8, "Scrums rival totales" => 9, "Lineouts propios ganados" => 7, "Lineouts propios totales" => 12, "Lineouts rival ganados" => 9, "Lineouts rival totales" => 11 },
  }

  created_matches.each do |match|
    next if match.points_for.nil? # skip upcoming matches
    next unless match.team_name == "Primera"

    # Player stats
    p_stats = player_stats_data[match.opponent]
    if p_stats
      mp = MatchPlayer.find_by(player: test_player, match: match)
      if mp
        MatchPlayerStat.where(match_player: mp).destroy_all
        p_stats.each do |stat_name, val|
          next unless st[stat_name]
          MatchPlayerStat.create!(match_player: mp, match_stat_type: st[stat_name], value: val)
        end
      end
    end

    # Team stats
    t_stats = team_stats_data[match.opponent]
    if t_stats
      MatchStat.where(match: match).destroy_all
      t_stats.each do |stat_name, val|
        next unless st[stat_name]
        MatchStat.create!(match: match, match_stat_type: st[stat_name], value: val)
      end
    end
  end

  puts "   MatchPlayerStats: #{MatchPlayerStat.count} | MatchStats: #{MatchStat.count}"
end

puts "== Nutrición e Historial clínico (mock) =="

# test_player already defined above (jugador@palermobajo.com = Francisco Ferraro)
if test_player
  nutri_user = User.find_by(email: "nutri@palermobajo.com")

  # Planes nutricionales
  NutritionPlan.where(player: test_player).destroy_all
  [
    {
      date:            Date.today - 56,
      recommendations: "Aumentar ingesta calórica en semana de alta carga. Hidratación mínima 3L/día.",
      breakfast:       "Avena con leche entera (400ml), plátano, huevos revueltos x2, café.",
      lunch:           "Arroz integral 200g, pollo grillado 250g, ensalada verde, aceite de oliva.",
      dinner:          "Pasta integral 180g, carne magra 200g, vegetales salteados.",
      snacks:          "Fruta + frutos secos entre comidas. Batido proteico post-entreno.",
      extra_notes:     "Evitar ultraprocesados la semana antes de testeos físicos."
    },
    {
      date:            Date.today - 28,
      recommendations: "Semana de reducción de carga — mantener proteína alta, bajar hidratos simples.",
      breakfast:       "Yogur griego + granola casera + frutos rojos.",
      lunch:           "Quinoa 150g, salmón 200g, brócoli al vapor.",
      dinner:          "Omelette de 3 huevos + vegetales + tostadas integrales.",
      snacks:          "Batido whey + banana post-entreno. Nueces durante el día.",
      extra_notes:     "Pesaje programado para el 05/03 — no saltear desayuno el día anterior."
    },
    {
      date:            Date.today - 7,
      recommendations: "Fase de competencia: maximizar glucógeno muscular. Carbohidratos pre-partido.",
      breakfast:       "Tostadas integrales x3 + mantequilla de maní + jugo de naranja natural.",
      lunch:           "Arroz blanco 250g + pechuga pollo 300g + puré de zapallo.",
      dinner:          "Pasta blanca 200g + salsa de tomate con carne magra picada.",
      snacks:          "Gelatina + fruta antes del partido. Bebida isotónica durante.",
      extra_notes:     "Hidratación especial los 2 días previos al partido."
    }
  ].each do |plan_data|
    NutritionPlan.create!(plan_data.merge(player: test_player, created_by: nutri_user))
  end

  # Lesiones
  Injury.where(player: test_player).destroy_all
  fractura_type    = InjuryType.find_or_create_by!(name: "Fractura")
  esguince_type    = InjuryType.find_or_create_by!(name: "Esguince")
  contractura_type = InjuryType.find_or_create_by!(name: "Contractura")

  [
    {
      injury_type: contractura_type,
      body_zone:   "Isquiotibial derecho",
      start_date:  Date.today - 120,
      end_date:    Date.today - 100,
      notes:       "Contractura post partido. Resolvió con fisioterapia en 3 semanas.",
      validated:   true
    },
    {
      injury_type: esguince_type,
      body_zone:   "Tobillo derecho",
      start_date:  Date.today - 75,
      end_date:    Date.today - 55,
      notes:       "Esguince grado II. Alta médica tras rehabilitación completa.",
      validated:   true
    },
    {
      injury_type: fractura_type,
      body_zone:   "Huesos propios de la nariz",
      start_date:  Date.today - 19,
      end_date:    nil,
      notes:       "Fractura nasal partido vs SIC. Sigue en seguimiento médico.",
      validated:   true
    }
  ].each do |inj|
    Injury.create!(inj.merge(player: test_player))
  end

  puts "   #{NutritionPlan.count} planes nutricionales | #{Injury.count} lesiones creadas."
end

# ─── Sesiones de nutrición ──────────────────────────────────────────────────
puts "== Sesiones de Nutrición =="

nutri_user  = User.joins(:roles).find_by(roles: { name: "Nutricionista" })
all_players = Player.includes(:user).all

if nutri_user && all_players.any?
  NutritionConvocado.destroy_all
  NutritionSlot.destroy_all
  NutritionSession.destroy_all

  # --- Sesión 1: publicada, próxima (lunes próximo) -----------------------
  session_upcoming = NutritionSession.create!(
    date:              Date.today.next_occurring(:monday),
    capacity_per_slot: 1,
    status:            "published",
    created_by:        nutri_user
  )

  # Generar turnos 09:00 – 10:30 cada 10 min
  session_upcoming.generate_slots!("09:00", "10:30", 10)

  # Convocar los primeros 6 jugadores
  convocados_jugadores = all_players.limit(6).to_a
  convocados_jugadores.each do |player|
    NutritionConvocado.create!(
      nutrition_session: session_upcoming,
      player:            player,
      notified_at:       Time.current
    )
  end

  # Asignar turno a los primeros 3 convocados
  slots_upcoming = session_upcoming.nutrition_slots.order(:start_time).to_a
  convocados_jugadores.first(3).each_with_index do |player, i|
    nc = NutritionConvocado.find_by(nutrition_session: session_upcoming, player: player)
    nc.update!(nutrition_slot: slots_upcoming[i])
  end

  # --- Sesión 2: borrador, la semana siguiente ----------------------------
  session_draft = NutritionSession.create!(
    date:              Date.today.next_occurring(:monday) + 7,
    capacity_per_slot: 2,
    status:            "draft",
    created_by:        nutri_user
  )

  # Generar turnos 10:00 – 11:30 cada 10 min
  session_draft.generate_slots!("10:00", "11:30", 10)

  # Convocar los primeros 4 jugadores (sin turno aún)
  all_players.limit(4).each do |player|
    NutritionConvocado.create!(
      nutrition_session: session_draft,
      player:            player,
      notified_at:       Time.current
    )
  end

  # --- Sesión 3: completada, pasada (lunes pasado) ------------------------
  session_past = NutritionSession.create!(
    date:              Date.today.next_occurring(:monday) - 7,
    capacity_per_slot: 1,
    status:            "completed",
    created_by:        nutri_user
  )

  session_past.generate_slots!("09:00", "10:00", 10)
  slots_past = session_past.nutrition_slots.order(:start_time).to_a

  all_players.limit(5).each_with_index do |player, i|
    nc = NutritionConvocado.create!(
      nutrition_session: session_past,
      player:            player,
      notified_at:       Time.current - 1.week
    )
    nc.update!(nutrition_slot: slots_past[i % slots_past.size]) if slots_past.any?
  end

  puts "   #{NutritionSession.count} sesiones | #{NutritionSlot.count} turnos | #{NutritionConvocado.count} convocados creados."
else
  puts "   Skipped: nutricionista o jugadores no encontrados."
end

puts "== Seeds completados =="
