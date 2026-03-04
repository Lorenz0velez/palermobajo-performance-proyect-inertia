# frozen_string_literal: true

class CreateUserRoles < ActiveRecord::Migration[8.1]
  def change
    create_table :user_roles do |t|
      t.references :user, null: false, foreign_key: true
      t.references :role, null: false, foreign_key: true
      t.boolean :active, default: true
      t.date :start_date
      t.date :end_date

      t.timestamps
    end
  end
end
