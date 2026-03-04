# frozen_string_literal: true

class CreateMatchRoleReferences < ActiveRecord::Migration[8.1]
  def change
    create_table :match_role_references do |t|
      t.references :functional_role, null: false, foreign_key: true
      t.references :gps_metric_type, null: false, foreign_key: true
      t.decimal :reference_value

      t.timestamps
    end
  end
end
