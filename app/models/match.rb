# frozen_string_literal: true

class Match < ApplicationRecord
  belongs_to :tournament
  belongs_to :category

  has_many :match_players, dependent: :destroy
  has_many :players, through: :match_players
  has_many :match_stats, dependent: :destroy
  has_many :gps_sessions, dependent: :nullify

  scope :home, -> { where(home: true) }
  scope :away, -> { where(home: false) }

  validates :date, :opponent, presence: true

  def result
    return nil if points_for.nil? || points_against.nil?
    if points_for > points_against then "win"
    elsif points_for < points_against then "loss"
    else "draw"
    end
  end
end
