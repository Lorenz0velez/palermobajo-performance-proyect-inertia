# frozen_string_literal: true

class CreateMatchStats < ActiveRecord::Migration[8.1]
  def change
    create_table :match_stats do |t|
      t.references :match, null: false, foreign_key: true
      t.references :match_stat_type, null: false, foreign_key: true
      t.decimal :value, precision: 10, scale: 2

      t.timestamps
    end
  end
end
