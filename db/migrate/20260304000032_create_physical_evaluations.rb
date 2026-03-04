# frozen_string_literal: true

class CreatePhysicalEvaluations < ActiveRecord::Migration[8.1]
  def change
    create_table :physical_evaluations do |t|
      t.references :player, null: false, foreign_key: true
      t.references :physical_test, null: false, foreign_key: true
      t.date :date, null: false
      t.decimal :value
      t.boolean :validated, default: false
      t.references :validated_by, foreign_key: { to_table: :users }

      t.timestamps
    end
  end
end
