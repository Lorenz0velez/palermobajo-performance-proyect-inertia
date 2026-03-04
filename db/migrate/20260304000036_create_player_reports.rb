# frozen_string_literal: true

class CreatePlayerReports < ActiveRecord::Migration[8.1]
  def change
    create_table :player_reports do |t|
      t.references :player, null: false, foreign_key: true
      t.date :start_date
      t.date :end_date
      t.string :report_type
      t.string :pdf_path

      t.timestamps
    end
  end
end
