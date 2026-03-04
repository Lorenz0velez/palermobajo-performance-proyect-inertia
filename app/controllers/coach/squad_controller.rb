# frozen_string_literal: true

class Coach::SquadController < InertiaController
  PLAYERS = [
    {
      id: 1, first_name: "Francisco", last_name: "Ferraro", functional_role: "Segunda Línea",
      weight_kg: 103.0, height_cm: 190.0,
      wellness_today: { status: "not_loaded" },
      injuries: [{ type: "Fractura", body_zone: "Huesos propios de la nariz", start_date: "2026-02-14", active: true }],
      physical: { weight_kg: 103.0, height_cm: 190.0, muscle_mass_kg: 59.0, fat_mass_kg: 16.0, bmi: 28.5 },
      stats_2026: { matches: 4, tries: 1, tackles: 23, lineouts_won: 13, lineouts_total: 17, minutes: 205 }
    },
    {
      id: 2, first_name: "Martín", last_name: "González", functional_role: "Hooker",
      weight_kg: 98.0, height_cm: 182.0,
      wellness_today: { status: "ok", sleep: 4, energy: 4, legs: 3 },
      injuries: [],
      physical: { weight_kg: 98.0, height_cm: 182.0, muscle_mass_kg: 57.0, fat_mass_kg: 13.0, bmi: 29.6 },
      stats_2026: { matches: 4, tries: 2, tackles: 18, lineouts_won: 0, lineouts_total: 0, minutes: 220 }
    },
    {
      id: 3, first_name: "Carlos", last_name: "Pérez", functional_role: "Pilar Derecho",
      weight_kg: 112.0, height_cm: 183.0,
      wellness_today: { status: "en_observacion", sleep: 2, energy: 2, legs: 2, pain: true },
      injuries: [{ type: "Sobrecarga", body_zone: "Espalda lumbar", start_date: "2026-03-01", active: true }],
      physical: { weight_kg: 112.0, height_cm: 183.0, muscle_mass_kg: 64.0, fat_mass_kg: 18.0, bmi: 33.4 },
      stats_2026: { matches: 3, tries: 0, tackles: 14, lineouts_won: 0, lineouts_total: 0, minutes: 160 }
    },
    {
      id: 4, first_name: "Lucas", last_name: "Rodríguez", functional_role: "Segunda Línea",
      weight_kg: 106.0, height_cm: 192.0,
      wellness_today: { status: "ok", sleep: 4, energy: 5, legs: 4 },
      injuries: [],
      physical: { weight_kg: 106.0, height_cm: 192.0, muscle_mass_kg: 61.0, fat_mass_kg: 15.0, bmi: 28.8 },
      stats_2026: { matches: 4, tries: 3, tackles: 20, lineouts_won: 15, lineouts_total: 18, minutes: 310 }
    },
    {
      id: 5, first_name: "Agustín", last_name: "López", functional_role: "Flanker",
      weight_kg: 97.0, height_cm: 185.0,
      wellness_today: { status: "not_loaded" },
      injuries: [],
      physical: { weight_kg: 97.0, height_cm: 185.0, muscle_mass_kg: 56.0, fat_mass_kg: 14.0, bmi: 28.3 },
      stats_2026: { matches: 4, tries: 1, tackles: 31, lineouts_won: 0, lineouts_total: 0, minutes: 290 }
    },
    {
      id: 6, first_name: "Santiago", last_name: "Martínez", functional_role: "Número 8",
      weight_kg: 101.0, height_cm: 186.0,
      wellness_today: { status: "en_recuperacion", sleep: 3, energy: 2, legs: 2 },
      injuries: [{ type: "Desgarro", body_zone: "Isquiotibial derecho", start_date: "2026-02-22", active: true }],
      physical: { weight_kg: 101.0, height_cm: 186.0, muscle_mass_kg: 58.0, fat_mass_kg: 15.0, bmi: 29.2 },
      stats_2026: { matches: 2, tries: 1, tackles: 16, lineouts_won: 0, lineouts_total: 0, minutes: 120 }
    },
    {
      id: 7, first_name: "Ignacio", last_name: "García", functional_role: "Medio Scrum",
      weight_kg: 78.0, height_cm: 172.0,
      wellness_today: { status: "ok", sleep: 5, energy: 4, legs: 4 },
      injuries: [],
      physical: { weight_kg: 78.0, height_cm: 172.0, muscle_mass_kg: 44.0, fat_mass_kg: 11.0, bmi: 26.4 },
      stats_2026: { matches: 4, tries: 2, tackles: 12, lineouts_won: 0, lineouts_total: 0, minutes: 300 }
    },
    {
      id: 8, first_name: "Tomás", last_name: "Fernández", functional_role: "Apertura",
      weight_kg: 82.0, height_cm: 175.0,
      wellness_today: { status: "ok", sleep: 4, energy: 4, legs: 3 },
      injuries: [],
      physical: { weight_kg: 82.0, height_cm: 175.0, muscle_mass_kg: 46.0, fat_mass_kg: 12.0, bmi: 26.8 },
      stats_2026: { matches: 4, tries: 1, tackles: 9, lineouts_won: 0, lineouts_total: 0, minutes: 280 }
    },
    {
      id: 9, first_name: "Pablo", last_name: "Díaz", functional_role: "Wing",
      weight_kg: 85.0, height_cm: 178.0,
      wellness_today: { status: "not_loaded" },
      injuries: [],
      physical: { weight_kg: 85.0, height_cm: 178.0, muscle_mass_kg: 48.0, fat_mass_kg: 13.0, bmi: 26.8 },
      stats_2026: { matches: 3, tries: 4, tackles: 7, lineouts_won: 0, lineouts_total: 0, minutes: 220 }
    },
    {
      id: 10, first_name: "Nicolás", last_name: "Sánchez", functional_role: "Fullback",
      weight_kg: 86.0, height_cm: 177.0,
      wellness_today: { status: "ok", sleep: 4, energy: 5, legs: 5 },
      injuries: [],
      physical: { weight_kg: 86.0, height_cm: 177.0, muscle_mass_kg: 49.0, fat_mass_kg: 12.0, bmi: 27.5 },
      stats_2026: { matches: 4, tries: 2, tackles: 11, lineouts_won: 0, lineouts_total: 0, minutes: 300 }
    }
  ]

  def index
    render inertia: "coach/squad/index", props: {
      players: PLAYERS.map { |p|
        p.slice(:id, :first_name, :last_name, :functional_role, :weight_kg, :height_cm, :wellness_today, :injuries)
      }
    }
  end

  def show
    player = PLAYERS.find { |p| p[:id] == params[:id].to_i } || PLAYERS.first
    render inertia: "coach/squad/show", props: { player: player }
  end
end
