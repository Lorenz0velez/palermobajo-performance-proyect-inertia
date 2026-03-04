# frozen_string_literal: true

class CreatePhysicalHistories < ActiveRecord::Migration[8.1]
  def change
    create_table :physical_histories do |t|
      t.references :player, null: false, foreign_key: true
      t.date :date, null: false
      t.decimal :weight_kg
      t.decimal :height_cm
      t.decimal :bmi
      t.decimal :muscle_mass_kg
      t.decimal :fat_mass_kg

      t.timestamps
    end
  end
end
