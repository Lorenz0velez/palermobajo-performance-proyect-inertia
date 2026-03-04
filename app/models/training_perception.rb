# frozen_string_literal: true

class TrainingPerception < ApplicationRecord
  belongs_to :training
  belongs_to :player

  validates :training_id, :player_id, presence: true
  validates :rpe, numericality: { only_integer: true, in: 1..10 }, allow_nil: true
  validates :fatigue_level, numericality: { only_integer: true, in: 1..5 }, allow_nil: true
  validates :injury_impact, numericality: { only_integer: true, in: 1..4 }, allow_nil: true
  validates :player_id, uniqueness: { scope: :training_id }
end
