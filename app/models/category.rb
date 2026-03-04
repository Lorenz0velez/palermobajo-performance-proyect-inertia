# frozen_string_literal: true

class Category < ApplicationRecord
  belongs_to :sport
  belongs_to :gender

  has_many :teams, dependent: :destroy
  has_many :player_categories, dependent: :destroy
  has_many :players, through: :player_categories
  has_many :coach_categories, dependent: :destroy
  has_many :coaches, through: :coach_categories
  has_many :matches, dependent: :destroy
  has_many :trainings, dependent: :destroy
  has_many :physical_objectives, dependent: :destroy

  validates :name, presence: true
end
