# frozen_string_literal: true

class Team < ApplicationRecord
  belongs_to :category

  has_many :training_teams, dependent: :destroy
  has_many :trainings, through: :training_teams

  validates :name, presence: true
end
