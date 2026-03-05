# frozen_string_literal: true

class AddDirectionToPhysicalHistories < ActiveRecord::Migration[8.1]
  def change
    add_column :physical_histories, :muscle_direction, :string
    add_column :physical_histories, :fat_direction, :string
  end
end
