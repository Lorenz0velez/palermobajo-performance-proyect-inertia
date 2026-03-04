# frozen_string_literal: true

class CreateSeasons < ActiveRecord::Migration[8.1]
  def change
    create_table :seasons do |t|
      t.string :name, null: false
      t.date :start_date
      t.date :end_date

      t.timestamps
    end
  end
end
