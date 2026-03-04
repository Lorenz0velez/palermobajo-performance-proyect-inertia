# frozen_string_literal: true

class GpsSessionType < ApplicationRecord
  has_many :gps_sessions, dependent: :nullify

  validates :name, presence: true, uniqueness: true
end
