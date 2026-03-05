# frozen_string_literal: true

class PhysicalObjective < ApplicationRecord
  belongs_to :category
  belongs_to :functional_role
  belongs_to :physical_test

  THRESHOLD_TYPES = %w[min max range].freeze

  validates :category_id, :functional_role_id, :physical_test_id, presence: true
  validates :threshold_type, inclusion: { in: THRESHOLD_TYPES }, allow_nil: true

  def status_for(value)
    return :unknown if value.nil?
    v = value.to_f
    if threshold_type == "max"
      # Lower is better (e.g. velocity, agility)
      if green_threshold && v <= green_threshold
        :green
      elsif yellow_threshold && v <= yellow_threshold
        :yellow
      else
        :red
      end
    else
      # Higher is better (default: "min")
      if green_threshold && v >= green_threshold
        :green
      elsif yellow_threshold && v >= yellow_threshold
        :yellow
      else
        :red
      end
    end
  end
end
