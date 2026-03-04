# frozen_string_literal: true

class PhysicalHistory < ApplicationRecord
  belongs_to :player

  validates :player_id, :date, presence: true
  validates :bmi, :weight_kg, :height_cm, numericality: { greater_than: 0 }, allow_nil: true

  before_save :calculate_bmi

  private

  def calculate_bmi
    if weight_kg.present? && height_cm.present? && height_cm > 0
      self.bmi = (weight_kg / (height_cm / 100.0)**2).round(2)
    end
  end
end
