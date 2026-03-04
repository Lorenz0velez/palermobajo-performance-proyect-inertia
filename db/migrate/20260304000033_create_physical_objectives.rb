# frozen_string_literal: true

class CreatePhysicalObjectives < ActiveRecord::Migration[8.1]
  def change
    create_table :physical_objectives do |t|
      t.references :category, null: false, foreign_key: true
      t.references :functional_role, null: false, foreign_key: true
      t.references :physical_test, null: false, foreign_key: true
      t.decimal :yellow_threshold
      t.decimal :green_threshold
      t.string :threshold_type  # e.g. "min", "max"
      t.date :start_date
      t.date :end_date

      t.timestamps
    end
  end
end
