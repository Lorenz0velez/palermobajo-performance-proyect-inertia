# frozen_string_literal: true

class CreateTrainingPerceptions < ActiveRecord::Migration[8.1]
  def change
    create_table :training_perceptions do |t|
      t.references :training, null: false, foreign_key: true
      t.references :player, null: false, foreign_key: true
      t.integer :rpe           # 1-10
      t.integer :perceived_load
      t.text :comments

      t.timestamps
    end
  end
end
