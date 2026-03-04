# frozen_string_literal: true

class Gender < ApplicationRecord
  has_many :players, dependent: :nullify
  has_many :categories, dependent: :nullify

  validates :name, presence: true, uniqueness: true
end
