# frozen_string_literal: true

class AddFormulaToPhysicalObjectives < ActiveRecord::Migration[8.1]
  def change
    add_column :physical_objectives, :formula,         :string  # "absolute" | "weight_ratio"
    add_column :physical_objectives, :red_threshold,   :decimal # below this = rojo
  end
end
