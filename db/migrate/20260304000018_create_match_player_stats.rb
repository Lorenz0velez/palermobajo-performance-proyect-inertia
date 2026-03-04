# frozen_string_literal: true

class CreateMatchPlayerStats < ActiveRecord::Migration[8.1]
  def change
    create_table :match_player_stats do |t|
      t.references :match_player, null: false, foreign_key: true
      t.references :match_stat_type, null: false, foreign_key: true
      t.decimal :value, precision: 10, scale: 2

      t.timestamps
    end
  end
end
