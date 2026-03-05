# frozen_string_literal: true

class Player::ProfileController < Player::ApplicationController
  def show
    player = Current.user&.player || Player.first

    unless player
      return render inertia: "player/profile/show", props: { player: {}, physical: nil, injuries: [] }
    end

    physical = player.physical_histories.order(date: :desc).first
    category = player.player_categories
                     .where(active: true, end_date: nil)
                     .includes(:category)
                     .last&.category

    injuries_data = player.injuries
                          .includes(:injury_type)
                          .order(start_date: :desc)
                          .map do |inj|
      {
        type:       inj.injury_type.name,
        body_zone:  inj.body_zone,
        start_date: inj.start_date.strftime("%Y-%m-%d"),
        end_date:   inj.end_date&.strftime("%Y-%m-%d")
      }
    end

    render inertia: "player/profile/show", props: {
      player: {
        first_name:      player.first_name,
        last_name:       player.last_name,
        dni:             player.dni,
        birth_date:      player.birth_date&.strftime("%Y-%m-%d"),
        functional_role: player.functional_role&.name,
        category:        category&.name
      },
      physical: physical ? {
        date:           physical.date.strftime("%d/%m/%Y"),
        weight_kg:      physical.weight_kg&.to_f,
        height_cm:      physical.height_cm&.to_f,
        muscle_mass_kg: physical.muscle_mass_kg&.to_f,
        fat_mass_kg:    physical.fat_mass_kg&.to_f
      } : nil,
      injuries: injuries_data
    }
  end
end
