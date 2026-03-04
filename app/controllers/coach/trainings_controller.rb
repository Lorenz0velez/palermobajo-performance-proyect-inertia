# frozen_string_literal: true

class Coach::TrainingsController < InertiaController
  UPCOMING = [
    { id: 18, date: "2026-03-05", start_time: "19:00", end_time: "21:00", training_type: "Físico",          objective: "Potencia y velocidad",           has_plan: false },
    { id: 19, date: "2026-03-09", start_time: "19:00", end_time: "21:00", training_type: "Técnica + Línea", objective: "Lineout y scrum",                has_plan: true  },
    { id: 20, date: "2026-03-10", start_time: "19:00", end_time: "21:00", training_type: "Táctica",         objective: "Prep. Fecha 1 vs Universitario", has_plan: true  },
    { id: 21, date: "2026-03-12", start_time: "19:00", end_time: "21:00", training_type: "Match practice",  objective: "Juego interno — última previa",   has_plan: false }
  ]

  PAST = [
    {
      id: 17, date: "2026-03-03", training_type: "Técnica + Línea", objective: "Lineout pod drive",
      attendance: { present: 8, absent: 2, total: 10 },
      perception_by_role: [
        { group: "Forwards", count: 6, rpe_avg: 6.2, fatigue_avg: 2.1, injury_impact_avg: 1.1 },
        { group: "Backs",    count: 4, rpe_avg: 5.8, fatigue_avg: 1.8, injury_impact_avg: 1.0 }
      ]
    },
    {
      id: 16, date: "2026-03-02", training_type: "Físico", objective: "Potencia de tren inferior",
      attendance: { present: 9, absent: 1, total: 10 },
      perception_by_role: [
        { group: "Forwards", count: 6, rpe_avg: 7.8, fatigue_avg: 3.4, injury_impact_avg: 1.5 },
        { group: "Backs",    count: 4, rpe_avg: 7.5, fatigue_avg: 3.0, injury_impact_avg: 1.2 }
      ]
    },
    {
      id: 15, date: "2026-02-26", training_type: "Físico + Scrum", objective: "Empuje de scrum",
      attendance: { present: 9, absent: 1, total: 10 },
      perception_by_role: [
        { group: "Forwards", count: 6, rpe_avg: 6.8, fatigue_avg: 2.8, injury_impact_avg: 1.8 },
        { group: "Backs",    count: 3, rpe_avg: 6.2, fatigue_avg: 2.2, injury_impact_avg: 1.0 }
      ]
    },
    {
      id: 14, date: "2026-02-24", training_type: "Táctica", objective: "Ataque estructurado",
      attendance: { present: 8, absent: 2, total: 10 },
      perception_by_role: [
        { group: "Forwards", count: 5, rpe_avg: 5.2, fatigue_avg: 1.8, injury_impact_avg: 1.2 },
        { group: "Backs",    count: 4, rpe_avg: 4.8, fatigue_avg: 1.5, injury_impact_avg: 1.0 }
      ]
    },
    {
      id: 13, date: "2026-02-23", training_type: "Físico", objective: "Aceleraciones y contacto",
      attendance: { present: 9, absent: 1, total: 10 },
      perception_by_role: [
        { group: "Forwards", count: 6, rpe_avg: 7.5, fatigue_avg: 3.2, injury_impact_avg: 1.4 },
        { group: "Backs",    count: 4, rpe_avg: 7.1, fatigue_avg: 2.8, injury_impact_avg: 1.1 }
      ]
    },
    {
      id: 12, date: "2026-02-19", training_type: "Match practice", objective: "Juego interno 15 vs 15",
      attendance: { present: 10, absent: 0, total: 10 },
      perception_by_role: [
        { group: "Forwards", count: 6, rpe_avg: 8.2, fatigue_avg: 3.8, injury_impact_avg: 2.0 },
        { group: "Backs",    count: 4, rpe_avg: 7.8, fatigue_avg: 3.2, injury_impact_avg: 1.5 }
      ]
    }
  ]

  def index
    render inertia: "coach/trainings/index", props: {
      upcoming: UPCOMING,
      past: PAST.map { |t| t.slice(:id, :date, :training_type, :objective, :attendance) }
    }
  end

  def show
    id = params[:id].to_i
    training = PAST.find { |t| t[:id] == id }
    if training
      render inertia: "coach/trainings/show", props: { training: training.merge(id: id) }
    else
      upcoming = UPCOMING.find { |t| t[:id] == id } || UPCOMING.first
      render inertia: "coach/trainings/show", props: {
        training: upcoming.merge(id: id, attendance: nil, perception_by_role: nil)
      }
    end
  end

  def new
    render inertia: "coach/trainings/new", props: {}
  end

  def create
    redirect_to "/coach/trainings"
  end
end
