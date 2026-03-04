# frozen_string_literal: true

class CreateTournaments < ActiveRecord::Migration[8.1]
  def change
    create_table :tournaments do |t|
      t.string :name, null: false
      t.references :season, null: false, foreign_key: true

      t.timestamps
    end
  end
end
