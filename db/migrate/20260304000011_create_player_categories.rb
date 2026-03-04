# frozen_string_literal: true

class CreatePlayerCategories < ActiveRecord::Migration[8.1]
  def change
    create_table :player_categories do |t|
      t.references :player, null: false, foreign_key: true
      t.references :category, null: false, foreign_key: true
      t.references :season, null: false, foreign_key: true
      t.date :start_date
      t.date :end_date
      t.boolean :active, default: true

      t.timestamps
    end
  end
end
