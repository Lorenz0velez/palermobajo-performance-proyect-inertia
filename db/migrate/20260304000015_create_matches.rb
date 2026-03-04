# frozen_string_literal: true

class CreateMatches < ActiveRecord::Migration[8.1]
  def change
    create_table :matches do |t|
      t.references :tournament, null: false, foreign_key: true
      t.references :category, null: false, foreign_key: true
      t.date :date
      t.string :opponent
      t.boolean :home
      t.integer :points_for
      t.integer :points_against
      t.string :video_link

      t.timestamps
    end
  end
end
