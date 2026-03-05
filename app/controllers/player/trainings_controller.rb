# frozen_string_literal: true

class Player::TrainingsController < Player::ApplicationController
  before_action :set_player

  def index
    trainings = filtered_trainings.order(date: :desc).limit(30)

    render inertia: "player/trainings/index", props: {
      upcoming: trainings.select { |t| t.date >= Date.today }.map { |t| serialize(t) },
      past:     trainings.select { |t| t.date < Date.today }.map { |t| serialize(t) }
    }
  end

  def show
    training = Training.find(params[:id])
    perception = TrainingPerception.find_by(training: training, player: @player)
    render inertia: "player/trainings/show", props: {
      training: serialize(training),
      perception: perception ? { rpe: perception.rpe, fatigue_level: perception.fatigue_level, comments: perception.comments } : nil
    }
  end

  def perception
    training = Training.find(params[:id])
    p = TrainingPerception.find_or_initialize_by(training: training, player: @player)
    p.assign_attributes(perception_params)
    p.save
    redirect_to player_training_path(training)
  end

  private

  def set_player
    @player = current_player
  end

  def filtered_trainings
    return Training.none unless @player

    category = @player.player_categories.joins(:category).merge(PlayerCategory.where(active: true)).first&.category
    return Training.none unless category

    role_id = @player.functional_role_id

    Training
      .where(category: category)
      .includes(:functional_roles)
      .where(
        "trainings.id NOT IN (SELECT training_id FROM training_functional_roles) OR " \
        "trainings.id IN (SELECT training_id FROM training_functional_roles WHERE functional_role_id = ?)",
        role_id || 0
      )
  end

  def serialize(t)
    roles  = t.functional_roles.to_a
    groups = roles.map(&:position_group).uniq.compact
    {
      id:            t.id,
      date:          t.date&.strftime("%Y-%m-%d"),
      date_display:  t.date&.strftime("%d/%m/%Y"),
      start_time:    t.start_time&.strftime("%H:%M"),
      end_time:      t.end_time&.strftime("%H:%M"),
      training_type: t.training_type,
      objective:     t.objective,
      notes:         t.notes,
      duration_min:  t.duration_min,
      for_all:       roles.empty?,
      target_groups: groups,
      target_roles:  roles.map(&:name),
      pdf_url:       t.planning_pdf.attached? ? url_for(t.planning_pdf) : nil
    }
  end

  def perception_params
    params.require(:perception).permit(:rpe, :fatigue_level, :comments)
  end
end
