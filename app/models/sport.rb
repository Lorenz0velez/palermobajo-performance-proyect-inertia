# frozen_string_literal: true

class Sport < ApplicationRecord
  has_many :functional_roles, dependent: :destroy
  has_many :categories, dependent: :destroy
  has_many :physical_tests, dependent: :destroy

  validates :name, presence: true, uniqueness: true
end
