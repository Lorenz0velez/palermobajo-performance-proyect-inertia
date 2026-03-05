# frozen_string_literal: true

class CreateTrainingFunctionalRoles < ActiveRecord::Migration[8.1]
  def change
    create_table :training_functional_roles do |t|
      t.references :training,       null: false, foreign_key: true
      t.references :functional_role, null: false, foreign_key: true
      t.timestamps
    end

    add_index :training_functional_roles, %i[training_id functional_role_id],
              unique: true, name: "idx_training_functional_roles_unique"
  end
end
