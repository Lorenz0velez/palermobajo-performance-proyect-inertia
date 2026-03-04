# frozen_string_literal: true

class Coach < ApplicationRecord
  belongs_to :user

  has_many :coach_categories, dependent: :destroy
  has_many :categories, through: :coach_categories
  has_many :trainings, foreign_key: :created_by_id, dependent: :nullify

  scope :active, -> { where(active: true) }

  validates :user_id, presence: true, uniqueness: true
  validates :first_name, :last_name, presence: true

  def full_name
    "#{first_name} #{last_name}"
  end
end
