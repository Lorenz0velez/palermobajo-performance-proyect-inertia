# frozen_string_literal: true

class CreateSports < ActiveRecord::Migration[8.1]
  def change
    create_table :sports do |t|
      t.string :name, null: false

      t.timestamps
    end
  end
end
