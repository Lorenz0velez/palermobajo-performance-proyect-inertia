# frozen_string_literal: true

class CoachCategory < ApplicationRecord
  belongs_to :coach
  belongs_to :category
  belongs_to :season

  validates :coach_id, :category_id, :season_id, presence: true
end
