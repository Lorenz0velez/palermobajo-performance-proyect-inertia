# frozen_string_literal: true

class Player::ApplicationController < InertiaController
  before_action :perform_authentication

  inertia_share nutrition_tracked: -> { current_player&.nutrition_tracking.present? }

  private

  def current_player
    Current.user&.player || Player.first
  end
end
