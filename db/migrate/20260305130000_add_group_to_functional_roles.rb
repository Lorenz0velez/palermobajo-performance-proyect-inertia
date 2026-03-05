# frozen_string_literal: true

class AddGroupToFunctionalRoles < ActiveRecord::Migration[8.0]
  def change
    add_column :functional_roles, :position_group, :string
  end
end
