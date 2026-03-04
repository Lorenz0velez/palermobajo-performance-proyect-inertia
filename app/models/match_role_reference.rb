# frozen_string_literal: true

class MatchRoleReference < ApplicationRecord
  belongs_to :functional_role
  belongs_to :gps_metric_type

  validates :functional_role_id, :gps_metric_type_id, presence: true
  validates :gps_metric_type_id, uniqueness: { scope: :functional_role_id }
end
