# frozen_string_literal: true

class TrainingTeam < ApplicationRecord
  belongs_to :training
  belongs_to :team

  validates :training_id, :team_id, presence: true
end
