# frozen_string_literal: true

class CreatePhysicalTests < ActiveRecord::Migration[8.1]
  def change
    create_table :physical_tests do |t|
      t.string :name, null: false
      t.string :unit
      t.references :sport, null: false, foreign_key: true

      t.timestamps
    end
  end
end
