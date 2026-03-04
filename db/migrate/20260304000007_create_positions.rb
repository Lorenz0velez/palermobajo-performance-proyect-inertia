# frozen_string_literal: true

class CreatePositions < ActiveRecord::Migration[8.1]
  def change
    create_table :positions do |t|
      t.string :name, null: false
      t.references :functional_role, null: false, foreign_key: true

      t.timestamps
    end
  end
end
