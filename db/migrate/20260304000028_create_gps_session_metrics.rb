# frozen_string_literal: true

class CreateGpsSessionMetrics < ActiveRecord::Migration[8.1]
  def change
    create_table :gps_session_metrics do |t|
      t.references :gps_session, null: false, foreign_key: true
      t.references :gps_metric_type, null: false, foreign_key: true
      t.float :value

      t.timestamps
    end
  end
end
