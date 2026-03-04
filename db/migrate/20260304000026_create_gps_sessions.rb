# frozen_string_literal: true

class CreateGpsSessions < ActiveRecord::Migration[8.1]
  def change
    create_table :gps_sessions do |t|
      t.references :player, null: false, foreign_key: true
      t.references :functional_role, foreign_key: true
      t.references :gps_session_type, foreign_key: true
      t.references :training, foreign_key: true
      t.references :match, foreign_key: true
      t.datetime :recorded_at
      t.integer :duration_min
      t.string :file_name
      t.integer :device_id

      t.timestamps
    end
  end
end
