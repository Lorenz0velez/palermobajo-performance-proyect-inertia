# frozen_string_literal: true

class Pf::TrainingsController < Pf::ApplicationController
  def index
    trainings = Training
      .where(category: current_category)
      .includes(:functional_roles)
      .order(date: :desc)
      .limit(40)

    sport          = current_category&.sport || Sport.find_by(name: "Rugby")
    total_forwards = sport ? FunctionalRole.where(sport: sport, position_group: "forward").count : 0
    total_backs    = sport ? FunctionalRole.where(sport: sport, position_group: "back").count : 0

    render inertia: "pf/trainings/index", props: {
      trainings: trainings.map { |t| serialize_training(t, total_forwards:, total_backs:) },
      category:  current_category ? { id: current_category.id, name: current_category.name } : nil
    }
  end

  def show
    training    = Training.find(params[:id])
    perceptions = TrainingPerception.where(training: training).includes(:player).order(:created_at)

    sport          = training.category&.sport || Sport.find_by(name: "Rugby")
    total_forwards = sport ? FunctionalRole.where(sport: sport, position_group: "forward").count : 0
    total_backs    = sport ? FunctionalRole.where(sport: sport, position_group: "back").count : 0

    render inertia: "pf/trainings/show", props: {
      training:    serialize_training(training, total_forwards:, total_backs:),
      perceptions: perceptions.map do |p|
        {
          player_name:    p.player.full_name,
          group:          p.player.functional_role&.position_group,
          rpe:            p.rpe,
          perceived_load: p.perceived_load,
          fatigue_level:  p.fatigue_level,
          injury_impact:  p.injury_impact,
          comments:       p.comments
        }
      end
    }
  end

  def new
    sport = current_category&.sport || Sport.find_by(name: "Rugby")
    frs   = sport ? FunctionalRole.where(sport: sport).order(:name) : FunctionalRole.order(:name)

    render inertia: "pf/trainings/new", props: {
      category:         current_category ? { id: current_category.id, name: current_category.name } : nil,
      today:            Date.today.strftime("%Y-%m-%d"),
      functional_roles: serialize_functional_roles(frs)
    }
  end

  def edit
    training = Training.includes(:functional_roles).find(params[:id])
    sport    = current_category&.sport || Sport.find_by(name: "Rugby")
    frs      = sport ? FunctionalRole.where(sport: sport).order(:name) : FunctionalRole.order(:name)

    render inertia: "pf/trainings/edit", props: {
      training:          serialize_training(training),
      selected_role_ids: training.functional_roles.pluck(:id),
      category:          current_category ? { id: current_category.id, name: current_category.name } : nil,
      functional_roles:  serialize_functional_roles(frs)
    }
  end

  def create
    season   = Season.order(created_at: :desc).first
    role_ids = Array(params[:functional_role_ids]).map(&:to_i).reject(&:zero?)

    training = Training.new(
      category:      current_category,
      season:        season,
      date:          params[:date],
      start_time:    params[:start_time].presence,
      end_time:      params[:end_time].presence,
      duration_min:  params[:duration_min].presence,
      training_type: params[:training_type].presence || "fisico",
      objective:     params[:objective].presence,
      notes:         params[:notes].presence
    )

    if training.save
      if role_ids.any?
        roles = FunctionalRole.where(id: role_ids)
        training.functional_roles = roles
      end
      training.planning_pdf.attach(params[:planning_pdf]) if params[:planning_pdf].present?
      redirect_to pf_trainings_path, notice: "Entrenamiento creado."
    else
      redirect_to new_pf_training_path, alert: "Error: #{training.errors.full_messages.join(', ')}"
    end
  end

  def destroy
    training = Training.find(params[:id])
    if training.date.nil? || training.date > Date.today
      training.destroy!
      redirect_to pf_trainings_path, notice: "Entrenamiento eliminado."
    else
      redirect_to pf_trainings_path, alert: "Solo se pueden eliminar entrenamientos futuros."
    end
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
    redirect_to pf_trainings_path, notice: "Entrenamiento actualizado."
  rescue ActiveRecord::RecordInvalid => e
    redirect_to edit_pf_training_path(training), alert: e.message
  end

  private

  def serialize_training(t, total_forwards: 0, total_backs: 0)
    roles        = t.functional_roles.to_a
    target_roles = roles.map { |r| { name: r.name, group: r.position_group } }
    sel_fwd      = roles.count { |r| r.position_group == "forward" }
    sel_bck      = roles.count { |r| r.position_group == "back" }
    {
      id:            t.id,
      date:          t.date&.strftime("%d/%m/%Y"),
      date_raw:      t.date&.strftime("%Y-%m-%d"),
      start_time:    t.start_time&.strftime("%H:%M"),
      end_time:      t.end_time&.strftime("%H:%M"),
      training_type: t.training_type,
      objective:     t.objective,
      notes:         t.notes,
      duration_min:  t.duration_min,
      perceptions:   t.training_perceptions.count,
      for_all:       roles.empty?,
      all_forwards:  total_forwards > 0 && sel_fwd == total_forwards,
      all_backs:     total_backs > 0 && sel_bck == total_backs,
      target_roles:  target_roles,
      pdf_url:       t.planning_pdf.attached? ? url_for(t.planning_pdf) : nil
    }
  end

  def serialize_functional_roles(functional_roles)
    functional_roles.map { |fr| { id: fr.id, name: fr.name, group: fr.position_group } }
  end
end
