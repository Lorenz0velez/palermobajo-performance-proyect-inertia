# frozen_string_literal: true

class MatchStat < ApplicationRecord
  belongs_to :match
  belongs_to :match_stat_type

  validates :match_id, :match_stat_type_id, presence: true
  validates :value, numericality: true, allow_nil: true
end
