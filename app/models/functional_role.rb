# frozen_string_literal: true

class FunctionalRole < ApplicationRecord
  belongs_to :sport

  has_many :positions, dependent: :destroy
  has_many :players, dependent: :nullify
  has_many :gps_sessions, dependent: :nullify
  has_many :match_role_references, dependent: :destroy
  has_many :physical_objectives, dependent: :destroy

  validates :name, presence: true
end
