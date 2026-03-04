# frozen_string_literal: true

class CreateTrainings < ActiveRecord::Migration[8.1]
  def change
    create_table :trainings do |t|
      t.references :season, null: false, foreign_key: true
      t.references :category, null: false, foreign_key: true
      t.date :date
      t.time :start_time
      t.time :end_time
      t.integer :duration_min
      t.string :training_type
      t.string :objective
      t.text :notes
      t.references :created_by, foreign_key: { to_table: :coaches }
      t.boolean :validated, default: false

      t.timestamps
    end
  end
end
