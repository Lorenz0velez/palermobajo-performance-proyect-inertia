# frozen_string_literal: true

class Admin::ApplicationController < InertiaController
  before_action :require_admin!

  private

  def require_admin!
    # perform_authentication manually because authenticate is a no-op in dev
    perform_authentication
    unless Current.user&.admin?
      redirect_to sign_in_path, alert: "No tenés acceso a esta sección."
    end
  end
end
