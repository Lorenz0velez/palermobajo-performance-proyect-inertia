# frozen_string_literal: true

class AddCategoryToUserRoles < ActiveRecord::Migration[8.1]
  def change
    add_column :user_roles, :category_id, :integer
    add_index  :user_roles, :category_id
    add_foreign_key :user_roles, :categories, column: :category_id
  end
end
