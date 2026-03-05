# frozen_string_literal: true

class Training < ApplicationRecord
  belongs_to :season
  belongs_to :category
  belongs_to :created_by, class_name: "Coach", optional: true

  has_one_attached :planning_pdf

  has_many :training_teams, dependent: :destroy
  has_many :teams, through: :training_teams
  has_many :training_attendances, dependent: :destroy
  has_many :players, through: :training_attendances
  has_many :training_perceptions, dependent: :destroy
  has_many :gps_sessions, dependent: :nullify
  has_many :training_functional_roles, dependent: :destroy
  has_many :functional_roles, through: :training_functional_roles

  # Returns true if the training is open to all players (no role restriction)
  def for_all?
    functional_roles.empty?
  end

  scope :validated, -> { where(validated: true) }

  validates :date, :season_id, :category_id, presence: true
end
