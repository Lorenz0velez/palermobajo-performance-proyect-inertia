# frozen_string_literal: true

class SessionsController < InertiaController
  skip_before_action :authenticate, only: %i[ new create ]
  before_action :require_no_authentication, only: %i[ new create ]
  before_action :set_session, only: :destroy

  def new
    render inertia: "sessions/new"
  end

  def create
    if user = User.authenticate_by(email: params[:email], password: params[:password])
      if !user.verified? && user.pending_role.present?
        redirect_to sign_in_path, alert: "Cuenta pendiente de aprobacion."
        return
      end

      @session = user.sessions.create!
      cookies.signed.permanent[:session_token] = { value: @session.id, httponly: true }
      redirect_to redirect_path_for(user), notice: "Sesion iniciada."
    else
      redirect_to sign_in_path, alert: "Email o contrasena incorrectos."
    end
  end

  def destroy
    @session.destroy!
    Current.session = nil
    redirect_to settings_sessions_path, notice: "Sesion cerrada.", inertia: { clear_history: true }
  end

  private

  def redirect_path_for(user)
    return admin_home_path        if user.admin?
    return "/coach/home"          if user.role?("Entrenador")
    return "/pf/home"             if user.role?("PF")
    return "/nutricionista/home"  if user.role?("Nutricionista")
    return "/player/home"         if user.role?("Jugador")
    dashboard_path
  end

  def set_session
    @session = Current.user.sessions.find(params[:id])
  end
end
