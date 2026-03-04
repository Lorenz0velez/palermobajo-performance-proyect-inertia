# frozen_string_literal: true

class CreateMatchStatTypes < ActiveRecord::Migration[8.1]
  def change
    create_table :match_stat_types do |t|
      t.string :name, null: false
      t.string :description
      t.string :unit
      t.boolean :collective, default: false

      t.timestamps
    end
  end
end
