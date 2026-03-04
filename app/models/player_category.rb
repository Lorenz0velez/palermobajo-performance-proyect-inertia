# frozen_string_literal: true

class PlayerCategory < ApplicationRecord
  belongs_to :player
  belongs_to :category
  belongs_to :season

  scope :active, -> { where(active: true) }
  scope :current, -> { active.where("end_date IS NULL OR end_date >= ?", Date.today) }

  validates :player_id, :category_id, :season_id, :start_date, presence: true
end
