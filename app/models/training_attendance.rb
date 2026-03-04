# frozen_string_literal: true

class TrainingAttendance < ApplicationRecord
  belongs_to :training
  belongs_to :player

  scope :present, -> { where(present: true) }
  scope :absent, -> { where(present: false) }

  validates :training_id, :player_id, presence: true
  validates :player_id, uniqueness: { scope: :training_id }
end
