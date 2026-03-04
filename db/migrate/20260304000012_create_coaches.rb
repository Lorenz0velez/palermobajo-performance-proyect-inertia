# frozen_string_literal: true

class CreateCoaches < ActiveRecord::Migration[8.1]
  def change
    create_table :coaches do |t|
      t.references :user, null: false, foreign_key: true, index: { unique: true }
      t.string :first_name
      t.string :last_name
      t.boolean :active, default: true

      t.timestamps
    end
  end
end
