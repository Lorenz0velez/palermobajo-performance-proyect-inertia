# frozen_string_literal: true

class TrainingFunctionalRole < ApplicationRecord
  belongs_to :training
  belongs_to :functional_role
end
