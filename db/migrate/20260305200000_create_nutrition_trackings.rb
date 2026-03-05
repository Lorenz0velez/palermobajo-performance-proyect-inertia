# frozen_string_literal: true

class CreateNutritionTrackings < ActiveRecord::Migration[8.0]
  def change
    create_table :nutrition_trackings do |t|
      t.references :player,     null: false, foreign_key: true, index: { unique: true }
      t.references :created_by, null: true,  foreign_key: { to_table: :users }
      t.timestamps
    end
  end
end
