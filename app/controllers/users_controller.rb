# frozen_string_literal: true

class UsersController < InertiaController
  skip_before_action :authenticate, only: %i[new create]
  before_action :require_no_authentication, only: %i[new create]

  def new
    render inertia: "users/new"
  end

  def create
    @user = User.new(user_params)
    @user.name = "#{@user.first_name} #{@user.last_name}".strip if @user.name.blank?

    if @user.save
      if @user.pending_role.present?
        redirect_to sign_in_path, notice: "Tu solicitud fue registrada. Un administrador revisara tu cuenta."
      else
        session_record = @user.sessions.create!
        cookies.signed.permanent[:session_token] = { value: session_record.id, httponly: true }
        redirect_to dashboard_path, notice: "Cuenta creada correctamente."
      end
    else
      redirect_to sign_up_path, inertia: { errors: @user.errors }
    end
  end

  def destroy
    user = Current.user
    if user.authenticate(params[:password_challenge] || "")
      user.destroy!
      Current.session = nil
      redirect_to root_path, notice: "Tu cuenta fue eliminada.", inertia: { clear_history: true }
    else
      redirect_to settings_profile_path, inertia: { errors: { password_challenge: "Contrasena incorrecta." } }
    end
  end

  private

  def user_params
    params.permit(:email, :name, :first_name, :last_name, :dni, :pending_role, :password, :password_confirmation)
  end
end
