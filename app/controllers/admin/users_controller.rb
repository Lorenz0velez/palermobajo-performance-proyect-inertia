# frozen_string_literal: true

class Admin::UsersController < Admin::ApplicationController
  def index
    pending  = User.pending_approval.order(created_at: :desc)
    approved = User.approved.includes(:roles).order(created_at: :desc).limit(100)

    render inertia: "admin/users/index", props: {
      pending:  pending.map  { |u| serialize_user(u) },
      approved: approved.map { |u| serialize_user(u) },
      categories: Category.order(:name).map { |c| { id: c.id, name: c.name } }
    }
  end

  def show
    user = User.find(params[:id])
    render inertia: "admin/users/show", props: {
      user:       serialize_user(user),
      categories: Category.order(:name).map { |c| { id: c.id, name: c.name } }
    }
  end

  def approve
    user     = User.find(params[:id])
    role_name = user.pending_role == "player" ? "Jugador" : "Entrenador"
    role      = Role.find_by!(name: role_name)
    category  = params[:category_id].present? ? Category.find(params[:category_id]) : nil

    ActiveRecord::Base.transaction do
      if user.pending_role == "player"
        player = Player.find_or_initialize_by(dni: user.dni)
        player.first_name ||= user.first_name || user.name
        player.last_name  ||= user.last_name  || ""
        player.user_id      = user.id
        player.save!

        if category
          season = Season.order(created_at: :desc).first
          player.player_categories.find_or_create_by!(category: category, season: season) do |pc|
            pc.start_date = Date.today
          end
        end
      end

      user.user_roles.find_or_create_by!(role: role, category: category) do |ur|
        ur.active     = true
        ur.start_date = Date.today
      end

      user.update!(verified: true, pending_role: nil)
    end

    redirect_to admin_users_path, notice: "#{user.full_name} fue aprobado como #{role_name.downcase}."
  rescue ActiveRecord::RecordInvalid => e
    redirect_to admin_user_path(user), alert: "Error al aprobar: #{e.message}"
  end

  def reject
    user = User.find(params[:id])
    user.update!(pending_role: nil)
    redirect_to admin_users_path, notice: "Solicitud de #{user.full_name} rechazada."
  end

  private

  def serialize_user(u)
    {
      id:           u.id,
      email:        u.email,
      name:         u.name,
      full_name:    u.full_name,
      first_name:   u.first_name,
      last_name:    u.last_name,
      dni:          u.dni,
      pending_role: u.pending_role,
      verified:     u.verified,
      roles:        u.roles.map(&:name),
      created_at:   u.created_at.strftime("%d/%m/%Y")
    }
  end
end
