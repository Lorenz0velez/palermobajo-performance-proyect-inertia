# frozen_string_literal: true

class CreateNutritionSessions < ActiveRecord::Migration[8.0]
  def change
    create_table :nutrition_sessions do |t|
      t.date    :date,               null: false
      t.integer :capacity_per_slot,  null: false, default: 1
      t.string  :status,             null: false, default: "draft"
      t.references :created_by, foreign_key: { to_table: :users }, null: true
      t.timestamps
    end

    create_table :nutrition_slots do |t|
      t.references :nutrition_session, null: false, foreign_key: true
      t.time :start_time, null: false
      t.time :end_time,   null: false
      t.timestamps
    end

    create_table :nutrition_convocados do |t|
      t.references :nutrition_session, null: false, foreign_key: true
      t.references :player,            null: false, foreign_key: true
      t.references :nutrition_slot,    null: true,  foreign_key: true
      t.datetime   :notified_at
      t.datetime   :cancelled_at
      t.timestamps

      t.index [:nutrition_session_id, :player_id], unique: true
    end
  end
end
