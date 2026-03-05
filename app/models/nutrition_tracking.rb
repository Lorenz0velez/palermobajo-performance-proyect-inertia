# frozen_string_literal: true

class NutritionTracking < ApplicationRecord
  belongs_to :player
  belongs_to :created_by, class_name: "User", optional: true
end
