# frozen_string_literal: true

class CreateFunctionalRoles < ActiveRecord::Migration[8.1]
  def change
    create_table :functional_roles do |t|
      t.string :name, null: false
      t.references :sport, null: false, foreign_key: true

      t.timestamps
    end
  end
end
