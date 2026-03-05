# frozen_string_literal: true

class Coach::ApplicationController < InertiaController
  before_action :perform_authentication

  private

  def current_coach
    Current.user&.coach || Coach.first
  end
end
