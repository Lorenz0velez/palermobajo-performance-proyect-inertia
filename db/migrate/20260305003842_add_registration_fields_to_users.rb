# frozen_string_literal: true

class AddRegistrationFieldsToUsers < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :dni,          :string
    add_column :users, :first_name,   :string
    add_column :users, :last_name,    :string
    add_column :users, :pending_role, :string  # "player", "coach", nil
    add_index  :users, :dni, unique: true, where: "dni IS NOT NULL"
  end
end
