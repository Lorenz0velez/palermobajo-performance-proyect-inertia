# frozen_string_literal: true

class Player::ApplicationController < InertiaController
  before_action :perform_authentication

  private

  def current_player
    Current.user&.player || Player.first
  end
end
