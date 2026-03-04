# frozen_string_literal: true

class Injury < ApplicationRecord
  belongs_to :player
  belongs_to :injury_type

  scope :active, -> { where("end_date IS NULL OR end_date >= ?", Date.today) }
  scope :validated, -> { where(validated: true) }

  validates :player_id, :injury_type_id, :start_date, presence: true
end
