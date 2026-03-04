# frozen_string_literal: true

class Player::ProfileController < InertiaController
  def show
    render inertia: "player/profile/show", props: {
      player: {
        first_name: "Francisco",
        last_name: "Ferraro",
        dni: nil,
        birth_date: "2001-10-17",
        functional_role: "Segunda Línea",
        category: "Plantel Superior"
      },
      physical: {
        date: "2026-02-20",
        weight_kg: 103.0,
        height_cm: 190.0,
        bmi: 28.5,
        muscle_mass_kg: 59.0,
        fat_mass_kg: 16.0
      },
      injuries: [
        {
          type: "Fractura",
          body_zone: "Huesos propios de la nariz",
          start_date: "2026-02-14",
          end_date: nil
        }
      ]
    }
  end
end
