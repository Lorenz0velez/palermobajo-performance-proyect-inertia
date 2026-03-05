# frozen_string_literal: true

class NutritionConvocado < ApplicationRecord
  belongs_to :nutrition_session
  belongs_to :player
  belongs_to :nutrition_slot, optional: true

  validates :nutrition_session_id, uniqueness: { scope: :player_id }

  scope :active,    -> { where(cancelled_at: nil) }
  scope :pending,   -> { active.where(nutrition_slot_id: nil) }
  scope :booked,    -> { active.where.not(nutrition_slot_id: nil) }
  scope :cancelled, -> { where.not(cancelled_at: nil) }

  def active?;    cancelled_at.nil? end
  def cancelled?; cancelled_at.present? end
  def booked?;    active? && nutrition_slot_id.present? end
  def pending?;   active? && nutrition_slot_id.nil? end
end
