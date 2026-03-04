# frozen_string_literal: true

class GpsMetricType < ApplicationRecord
  has_many :gps_session_metrics, dependent: :destroy
  has_many :match_role_references, dependent: :destroy

  validates :name, presence: true, uniqueness: true
end
