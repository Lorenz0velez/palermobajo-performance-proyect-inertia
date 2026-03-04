# frozen_string_literal: true

class MatchPlayer < ApplicationRecord
  belongs_to :player
  belongs_to :match
  belongs_to :position, optional: true

  has_many :match_player_stats, dependent: :destroy

  scope :starters, -> { where(starter: true) }

  validates :player_id, :match_id, presence: true
end
