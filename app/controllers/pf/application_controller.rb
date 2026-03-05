# frozen_string_literal: true

class Pf::ApplicationController < InertiaController
  before_action :perform_authentication

  private

  # Returns the category assigned to the current PF user (most recent active).
  # Falls back to the first available category for testing without role assignment.
  def current_category
    @current_category ||= begin
      ur = Current.user.user_roles.active.where.not(category_id: nil).includes(:category).first
      ur&.category || Category.first
    end
  end

  # Returns players in PF's category
  def category_players
    return Player.active.includes(:functional_role).order(:last_name, :first_name) unless current_category
    Player.joins(:player_categories)
          .where(player_categories: { category: current_category, active: true, end_date: nil })
          .includes(:functional_role)
          .order(:last_name, :first_name)
  end
end
