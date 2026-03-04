# frozen_string_literal: true

class GpsSession < ApplicationRecord
  belongs_to :player
  belongs_to :functional_role, optional: true
  belongs_to :gps_session_type, optional: true
  belongs_to :training, optional: true
  belongs_to :match, optional: true

  has_many :gps_session_metrics, dependent: :destroy

  validates :player_id, presence: true
  validate :must_belong_to_training_or_match

  private

  def must_belong_to_training_or_match
    if training_id.nil? && match_id.nil?
      errors.add(:base, "Must be associated with a training or a match")
    end
  end
end
