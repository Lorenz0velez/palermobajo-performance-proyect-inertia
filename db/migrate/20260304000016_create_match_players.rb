# frozen_string_literal: true

class CreateMatchPlayers < ActiveRecord::Migration[8.1]
  def change
    create_table :match_players do |t|
      t.references :player, null: false, foreign_key: true
      t.references :match, null: false, foreign_key: true
      t.references :position, foreign_key: true
      t.integer :minutes_played
      t.boolean :starter, default: false

      t.timestamps
    end
  end
end
