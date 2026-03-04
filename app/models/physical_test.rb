# frozen_string_literal: true

class PhysicalTest < ApplicationRecord
  belongs_to :sport

  has_many :physical_evaluations, dependent: :destroy
  has_many :physical_objectives, dependent: :destroy

  validates :name, presence: true
end
