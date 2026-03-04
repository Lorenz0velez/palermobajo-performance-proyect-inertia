# frozen_string_literal: true

class Position < ApplicationRecord
  belongs_to :functional_role

  has_many :match_players, dependent: :nullify

  validates :name, presence: true
end
