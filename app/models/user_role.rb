# frozen_string_literal: true

class UserRole < ApplicationRecord
  belongs_to :user
  belongs_to :role

  scope :active, -> { where(active: true).where("end_date IS NULL OR end_date >= ?", Date.today) }
  scope :current, -> { active }

  validates :user_id, :role_id, presence: true
  validates :start_date, presence: true
end
