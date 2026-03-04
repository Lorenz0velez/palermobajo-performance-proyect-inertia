# frozen_string_literal: true

class PlayerWellness < ApplicationRecord
  belongs_to :player

  SCALE_RANGE = (1..5)

  validates :player_id, :date, presence: true
  validates :player_id, uniqueness: { scope: :date }
  validates :sleep_quality, :fatigue, :stress, :mood, :energy_level,
            numericality: { only_integer: true, in: SCALE_RANGE }, allow_nil: true
  validates :sleep_hours, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :pain,                 numericality: { only_integer: true, in: 1..4 }, allow_nil: true
  validates :leg_feel,             numericality: { only_integer: true, in: 1..4 }, allow_nil: true
  validates :pain_affects_movement, numericality: { only_integer: true, in: 1..3 }, allow_nil: true
  validates :training_readiness,   numericality: { only_integer: true, in: 1..3 }, allow_nil: true
end
