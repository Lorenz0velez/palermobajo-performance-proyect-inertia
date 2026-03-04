# frozen_string_literal: true

class CreateGpsSessionTypes < ActiveRecord::Migration[8.1]
  def change
    create_table :gps_session_types do |t|
      t.string :name, null: false

      t.timestamps
    end
  end
end
