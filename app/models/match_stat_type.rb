# frozen_string_literal: true

class MatchStatType < ApplicationRecord
  has_many :match_player_stats, dependent: :destroy
  has_many :match_stats, dependent: :destroy

  scope :individual, -> { where(collective: false) }
  scope :collective, -> { where(collective: true) }

  validates :name, presence: true, uniqueness: true
end
