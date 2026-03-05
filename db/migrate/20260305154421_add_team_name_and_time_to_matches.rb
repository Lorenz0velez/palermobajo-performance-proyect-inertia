# frozen_string_literal: true

class AddTeamNameAndTimeToMatches < ActiveRecord::Migration[8.1]
  def change
    add_column :matches, :team_name, :string
    add_column :matches, :kickoff_time, :string
  end
end
