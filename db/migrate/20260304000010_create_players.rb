# frozen_string_literal: true

class CreatePlayers < ActiveRecord::Migration[8.1]
  def change
    create_table :players do |t|
      t.string :dni, null: false
      t.string :first_name
      t.string :last_name
      t.date :birth_date
      t.references :gender, foreign_key: true
      t.boolean :active, default: true
      t.references :user, foreign_key: true
      t.text :biometric # stored as JSON
      t.references :functional_role, foreign_key: true

      t.timestamps
    end

    add_index :players, :dni, unique: true
  end
end
