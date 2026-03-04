# frozen_string_literal: true

class GpsSessionMetric < ApplicationRecord
  belongs_to :gps_session
  belongs_to :gps_metric_type

  validates :gps_session_id, :gps_metric_type_id, presence: true
  validates :value, numericality: true, allow_nil: true
end
