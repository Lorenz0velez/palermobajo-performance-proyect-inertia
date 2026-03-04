# frozen_string_literal: true

class Season < ApplicationRecord
  has_many :player_categories, dependent: :destroy
  has_many :coach_categories, dependent: :destroy
  has_many :tournaments, dependent: :destroy
  has_many :trainings, dependent: :destroy

  validates :name, presence: true
  validates :start_date, :end_date, presence: true
end
