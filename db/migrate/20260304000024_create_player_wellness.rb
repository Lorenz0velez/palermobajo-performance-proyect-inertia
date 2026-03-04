# frozen_string_literal: true

class CreatePlayerWellness < ActiveRecord::Migration[8.1]
  def change
    create_table :player_wellness do |t|
      t.references :player, null: false, foreign_key: true
      t.date :date, null: false
      t.datetime :completed_at
      t.decimal :sleep_hours
      t.integer :sleep_quality  # 1-5
      t.integer :fatigue        # 1-5
      t.integer :stress         # 1-5
      t.integer :pain           # 1-5
      t.integer :mood           # 1-5
      t.text :comments

      t.timestamps
    end

    add_index :player_wellness, [ :player_id, :date ], unique: true
  end
end
