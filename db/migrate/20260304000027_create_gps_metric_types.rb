# frozen_string_literal: true

class CreateGpsMetricTypes < ActiveRecord::Migration[8.1]
  def change
    create_table :gps_metric_types do |t|
      t.string :name, null: false
      t.string :unit

      t.timestamps
    end
  end
end
