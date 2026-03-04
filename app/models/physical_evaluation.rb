# frozen_string_literal: true

class PhysicalEvaluation < ApplicationRecord
  belongs_to :player
  belongs_to :physical_test
  belongs_to :validated_by, class_name: "User", optional: true

  scope :validated, -> { where(validated: true) }
  scope :pending, -> { where(validated: false) }

  validates :player_id, :physical_test_id, :date, presence: true
  validates :value, numericality: true, allow_nil: true
end
