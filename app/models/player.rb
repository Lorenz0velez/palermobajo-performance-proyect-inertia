# frozen_string_literal: true

class Player < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :gender, optional: true
  belongs_to :functional_role, optional: true

  has_many :player_categories, dependent: :destroy
  has_many :categories, through: :player_categories
  has_many :match_players, dependent: :destroy
  has_many :matches, through: :match_players
  has_many :training_attendances, dependent: :destroy
  has_many :trainings, through: :training_attendances
  has_many :training_perceptions, dependent: :destroy
  has_many :player_wellness, dependent: :destroy
  has_many :gps_sessions, dependent: :destroy
  has_many :physical_histories, dependent: :destroy
  has_many :physical_evaluations, dependent: :destroy
  has_many :injuries, dependent: :destroy
  has_many :player_reports, dependent: :destroy
  has_one  :nutrition_tracking, dependent: :destroy

  serialize :biometric, coder: JSON

  scope :active, -> { where(active: true) }

  validates :dni, presence: true, uniqueness: true
  validates :first_name, :last_name, presence: true

  def full_name
    "#{first_name} #{last_name}"
  end
end
