# frozen_string_literal: true

class CreateCoachCategories < ActiveRecord::Migration[8.1]
  def change
    create_table :coach_categories do |t|
      t.references :coach, null: false, foreign_key: true
      t.references :category, null: false, foreign_key: true
      t.references :season, null: false, foreign_key: true
      t.string :role_function
      t.date :start_date
      t.date :end_date

      t.timestamps
    end
  end
end
