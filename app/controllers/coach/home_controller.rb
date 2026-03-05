# frozen_string_literal: true

class Coach::HomeController < Coach::ApplicationController
  def index
    render inertia: "coach/home/index", props: {
      coach: {
        first_name: "Lucas",
        last_name: "Brouwer",
        category: "Plantel Superior",
        role: "Head Coach"
      },
      season: "2026",
      next_training: {
        id: 18,
        date: "2026-03-05",
        start_time: "19:00",
        training_type: "Físico",
        objective: "Potencia y velocidad"
      },
      next_match: {
        date: "2026-03-14",
        opponent: "Universitario",
        home: true,
        label: "Fecha 1"
      },
      wellness_summary: {
        ok: 5,
        en_observacion: 1,
        en_recuperacion: 1,
        not_loaded: 3,
        total: 10
      },
      team_stats: {
        matches_played: 4,
        wins: 3,
        losses: 1,
        points_for: 104,
        points_against: 90
      },
      pending_tasks: [
        { type: "wellness", label: "Bienestar sin cargar hoy", count: 3, href: "/coach/squad" },
        { type: "injury",   label: "Jugadores lesionados activos",   count: 2, href: "/coach/squad" }
      ]
    }
  end
end
