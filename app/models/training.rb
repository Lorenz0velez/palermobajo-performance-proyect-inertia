# frozen_string_literal: true

class Training < ApplicationRecord
  belongs_to :season
  belongs_to :category
  belongs_to :created_by, class_name: "Coach", optional: true

  has_many :training_teams, dependent: :destroy
  has_many :teams, through: :training_teams
  has_many :training_attendances, dependent: :destroy
  has_many :players, through: :training_attendances
  has_many :training_perceptions, dependent: :destroy
  has_many :gps_sessions, dependent: :nullify

  scope :validated, -> { where(validated: true) }

  validates :date, :season_id, :category_id, presence: true
end
