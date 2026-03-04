# frozen_string_literal: true

class InertiaController < ApplicationController
  inertia_share auth: -> {
    { user: Current.user&.as_json(only: [:id, :name, :email]) }
  }
end
