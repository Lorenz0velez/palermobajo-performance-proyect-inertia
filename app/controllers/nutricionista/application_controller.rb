# frozen_string_literal: true

class Nutricionista::ApplicationController < InertiaController
  before_action :perform_authentication

  private

  # Returns all active players (nutricionista works across all categories)
  def all_players
    Player.active
          .includes(:functional_role, :categories)
          .order(:last_name, :first_name)
  end

  # Returns only players selected for nutrition tracking
  def tracked_players
    Player.active
          .joins(:nutrition_tracking)
          .includes(:functional_role, :categories)
          .order(:last_name, :first_name)
  end
end
