# frozen_string_literal: true

class Coach::TrainingsController < Coach::ApplicationController
  before_action :perform_authentication

  UPCOMING = [
    { id: 18, date: "2026-03-05", start_time: "19:00", end_time: "21:00", training_type: "Fisico",          objective: "Potencia y velocidad",           has_plan: true  },
    { id: 19, date: "2026-03-09", start_time: "19:00", end_time: "21:00", training_type: "Tecnica + Linea", objective: "Lineout y scrum",                has_plan: true  },
    { id: 20, date: "2026-03-10", start_time: "19:00", end_time: "21:00", training_type: "Tactica",         objective: "Prep. Fecha 1 vs Universitario", has_plan: true  },
    { id: 21, date: "2026-03-12", start_time: "19:00", end_time: "21:00", training_type: "Match practice",  objective: "Juego interno - ultima previa",   has_plan: false }
  ]

  PAST = [
    { id: 17, date: "2026-03-03", training_type: "Tecnica + Linea", objective: "Lineout pod drive",
      attendance: { present: 8, absent: 2, total: 10 },
      perception_by_role: [
        { group: "Forwards", count: 6, rpe_avg: 6.2, fatigue_avg: 2.1, injury_impact_avg: 1.1 },
        { group: "Backs",    count: 4, rpe_avg: 5.8, fatigue_avg: 1.8, injury_impact_avg: 1.0 }
      ] },
    { id: 16, date: "2026-03-02", training_type: "Fisico", objective: "Potencia de tren inferior",
      attendance: { present: 9, absent: 1, total: 10 },
      perception_by_role: [
        { group: "Forwards", count: 6, rpe_avg: 7.8, fatigue_avg: 3.4, injury_impact_avg: 1.5 },
        { group: "Backs",    count: 4, rpe_avg: 7.5, fatigue_avg: 3.0, injury_impact_avg: 1.2 }
      ] }
  ]

  def index
    render inertia: "coach/trainings/index", props: {
      upcoming: UPCOMING,
      past:     PAST.map { |t| t.slice(:id, :date, :training_type, :objective, :attendance) }
    }
  end

  def show
    id       = params[:id].to_i
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
    sport            = Sport.find_by(name: "Rugby") || Sport.first
    functional_roles = sport ? FunctionalRole.where(sport: sport).order(:name) : FunctionalRole.order(:name)

    render inertia: "coach/trainings/new", props: {
      today:            Date.today.strftime("%Y-%m-%d"),
      functional_roles: functional_roles.map { |fr| { id: fr.id, name: fr.name, group: fr.position_group } }
    }
  end

  def create
    season   = Season.order(created_at: :desc).first
    category = Category.find_by(name: "Plantel Superior") || Category.first
    role_ids = Array(params[:functional_role_ids]).map(&:to_i).reject(&:zero?)

    training = Training.new(
      category:      category,
      season:        season,
      date:          params[:date],
      start_time:    params[:start_time].presence,
      end_time:      params[:end_time].presence,
      duration_min:  params[:duration_min].presence,
      training_type: params[:training_type].presence || "tactico",
      objective:     params[:objective].presence,
      notes:         params[:notes].presence
    )

    if training.save
      training.functional_roles = FunctionalRole.where(id: role_ids)
      training.planning_pdf.attach(params[:planning_pdf]) if params[:planning_pdf].present?
      redirect_to "/coach/trainings", notice: "Entrenamiento creado."
    else
      redirect_to "/coach/trainings/new", alert: "Error: #{training.errors.full_messages.join(', ')}"
    end
  end

  def edit
    training = Training.includes(:functional_roles).find(params[:id])
    sport    = Sport.find_by(name: "Rugby") || Sport.first
    frs      = sport ? FunctionalRole.where(sport: sport).order(:name) : FunctionalRole.order(:name)

    render inertia: "coach/trainings/edit", props: {
      training: {
        id:            training.id,
        date_raw:      training.date&.strftime("%Y-%m-%d"),
        start_time:    training.start_time&.strftime("%H:%M"),
        end_time:      training.end_time&.strftime("%H:%M"),
        duration_min:  training.duration_min,
        training_type: training.training_type,
        objective:     training.objective,
        notes:         training.notes,
        pdf_url:       training.planning_pdf.attached? ? url_for(training.planning_pdf) : nil
      },
      selected_role_ids: training.functional_roles.pluck(:id),
      functional_roles:  frs.map { |fr| { id: fr.id, name: fr.name, group: fr.position_group } }
    }
  end

  def update
    training = Training.find(params[:id])
    role_ids = Array(params[:functional_role_ids]).map(&:to_i).reject(&:zero?)

    training.update!(
      date:          params[:date],
      start_time:    params[:start_time].presence,
      end_time:      params[:end_time].presence,
      duration_min:  params[:duration_min].presence,
      training_type: params[:training_type].presence,
      objective:     params[:objective].presence,
      notes:         params[:notes].presence
    )
    training.functional_roles = FunctionalRole.where(id: role_ids)
    training.planning_pdf.attach(params[:planning_pdf]) if params[:planning_pdf].present?
    redirect_to "/coach/trainings", notice: "Entrenamiento actualizado."
  rescue ActiveRecord::RecordInvalid => e
    redirect_to "/coach/trainings/#{training.id}/edit", alert: e.message
  end
end
