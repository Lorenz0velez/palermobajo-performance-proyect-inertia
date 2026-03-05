# frozen_string_literal: true

class NutritionSession < ApplicationRecord
  belongs_to :created_by, class_name: "User", optional: true

  has_many :nutrition_slots,      dependent: :destroy
  has_many :nutrition_convocados, dependent: :destroy
  has_many :players, through: :nutrition_convocados

  validates :date, presence: true
  validates :capacity_per_slot, numericality: { greater_than: 0 }
  validates :status, inclusion: { in: %w[draft published completed] }

  scope :upcoming, -> { where("date >= ?", Date.today).order(:date) }
  scope :past,     -> { where("date < ?",  Date.today).order(date: :desc) }

  def draft?;     status == "draft"     end
  def published?; status == "published" end
  def completed?; status == "completed" end

  # Generate slots from start_time, end_time and interval in minutes
  def generate_slots!(start_time_str, end_time_str, interval_minutes = 10)
    nutrition_slots.destroy_all

    t = Time.parse(start_time_str)
    last = Time.parse(end_time_str)

    slots = []
    while t < last
      slot_end = [t + interval_minutes.minutes, last].min
      slots << { nutrition_session_id: id, start_time: t, end_time: slot_end, created_at: Time.current, updated_at: Time.current }
      t += interval_minutes.minutes
    end

    NutritionSlot.insert_all(slots) if slots.any?
    nutrition_slots.reload
  end
end
