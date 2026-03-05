# frozen_string_literal: true

class NutritionPlan < ApplicationRecord
  belongs_to :player
  belongs_to :created_by, class_name: "User", optional: true

  validates :player_id, :date, presence: true
  validates :date, uniqueness: { scope: :player_id, message: "ya tiene un plan para esa fecha" }

  scope :recent, -> { order(date: :desc) }
end
