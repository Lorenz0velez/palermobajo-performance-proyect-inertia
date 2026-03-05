# frozen_string_literal: true

class NutritionSlot < ApplicationRecord
  belongs_to :nutrition_session

  has_many :nutrition_convocados, dependent: :nullify

  validates :start_time, :end_time, presence: true

  def available?(session)
    nutrition_convocados.where(cancelled_at: nil).count < session.capacity_per_slot
  end

  def start_label
    start_time.strftime("%H:%M")
  end

  def end_label
    end_time.strftime("%H:%M")
  end
end
