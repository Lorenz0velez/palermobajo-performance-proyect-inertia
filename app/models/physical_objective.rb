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
    if green_threshold && value >= green_threshold
      :green
    elsif yellow_threshold && value >= yellow_threshold
      :yellow
    else
      :red
    end
  end
end
