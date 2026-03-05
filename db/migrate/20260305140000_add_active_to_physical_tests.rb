# frozen_string_literal: true

class AddActiveToPhysicalTests < ActiveRecord::Migration[8.0]
  def change
    add_column :physical_tests, :active, :boolean, default: true, null: false
  end
end
