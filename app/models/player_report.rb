# frozen_string_literal: true

class PlayerReport < ApplicationRecord
  belongs_to :player

  validates :player_id, :report_type, presence: true
end
