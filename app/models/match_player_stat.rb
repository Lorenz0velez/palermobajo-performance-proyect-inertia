# frozen_string_literal: true

class MatchPlayerStat < ApplicationRecord
  belongs_to :match_player
  belongs_to :match_stat_type

  validates :match_player_id, :match_stat_type_id, presence: true
  validates :value, numericality: true, allow_nil: true
end
