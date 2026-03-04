# frozen_string_literal: true

class CreateInjuries < ActiveRecord::Migration[8.1]
  def change
    create_table :injuries do |t|
      t.references :player, null: false, foreign_key: true
      t.references :injury_type, null: false, foreign_key: true
      t.string :body_zone
      t.date :start_date
      t.date :end_date
      t.text :notes
      t.boolean :validated, default: false

      t.timestamps
    end
  end
end
