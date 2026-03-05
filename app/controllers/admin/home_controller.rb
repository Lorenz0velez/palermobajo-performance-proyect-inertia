# frozen_string_literal: true

class Admin::HomeController < Admin::ApplicationController
  def index
    pending_count = User.pending_approval.count
    players_count = Player.count
    unlinked_count = Player.where(user_id: nil).count

    render inertia: "admin/home/index", props: {
      stats: {
        pending_users:   pending_count,
        total_players:   players_count,
        unlinked_players: unlinked_count
      }
    }
  end
end
