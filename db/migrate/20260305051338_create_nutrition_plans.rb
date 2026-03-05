# frozen_string_literal: true

class CreateNutritionPlans < ActiveRecord::Migration[8.1]
  def change
    create_table :nutrition_plans do |t|
      t.integer :player_id
      t.date :date
      t.text :recommendations
      t.text :breakfast
      t.text :lunch
      t.text :dinner
      t.text :snacks
      t.text :extra_notes
      t.integer :created_by_id

      t.timestamps
    end
    add_index :nutrition_plans, :player_id
  end
end
