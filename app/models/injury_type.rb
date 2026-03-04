# frozen_string_literal: true

class InjuryType < ApplicationRecord
  has_many :injuries, dependent: :nullify

  validates :name, presence: true, uniqueness: true
end
