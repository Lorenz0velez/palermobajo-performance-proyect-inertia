# frozen_string_literal: true

class CreateTrainingTeams < ActiveRecord::Migration[8.1]
  def change
    create_table :training_teams do |t|
      t.references :training, null: false, foreign_key: true
      t.references :team, null: false, foreign_key: true

      t.timestamps
    end
  end
end
