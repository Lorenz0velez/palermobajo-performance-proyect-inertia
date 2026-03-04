# frozen_string_literal: true

class Tournament < ApplicationRecord
  belongs_to :season

  has_many :matches, dependent: :destroy

  validates :name, presence: true
end
