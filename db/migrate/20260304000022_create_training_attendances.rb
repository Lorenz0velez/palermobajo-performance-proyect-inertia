# frozen_string_literal: true

class CreateTrainingAttendances < ActiveRecord::Migration[8.1]
  def change
    create_table :training_attendances do |t|
      t.references :training, null: false, foreign_key: true
      t.references :player, null: false, foreign_key: true
      t.boolean :present, default: true
      t.string :absence_reason
      t.integer :participated_minutes
      t.text :notes

      t.timestamps
    end
  end
end
