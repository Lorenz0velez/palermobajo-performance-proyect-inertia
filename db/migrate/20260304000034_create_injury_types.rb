# frozen_string_literal: true

class CreateInjuryTypes < ActiveRecord::Migration[8.1]
  def change
    create_table :injury_types do |t|
      t.string :name, null: false

      t.timestamps
    end
  end
end
