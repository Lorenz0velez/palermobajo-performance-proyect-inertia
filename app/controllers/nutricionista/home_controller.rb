# frozen_string_literal: true

class Nutricionista::HomeController < Nutricionista::ApplicationController
  def index
    players = all_players.includes(:physical_histories)

    # Latest pesaje per player
    latest_by_player = PhysicalHistory
      .where(player: players)
      .group(:player_id)
      .select("player_id, MAX(date) AS max_date")
      .to_a
      .each_with_object({}) do |row, h|
        h[row.player_id] = PhysicalHistory.where(player_id: row.player_id, date: row.max_date).first
      end

    stats = players.map do |p|
      ph = latest_by_player[p.id]
      {
        id:              p.id,
        full_name:       p.full_name,
        functional_role: p.functional_role&.name,
        weight_kg:       ph&.weight_kg,
        muscle_mass_kg:  ph&.muscle_mass_kg,
        fat_mass_kg:     ph&.fat_mass_kg,
        last_date:       ph&.date&.strftime("%d/%m/%Y")
      }
    end

    render inertia: "nutricionista/home/index", props: {
      players_summary: stats,
      total:           players.count,
      weighed_today:   PhysicalHistory.where(player: players, date: Date.today).count
    }
  end
end
