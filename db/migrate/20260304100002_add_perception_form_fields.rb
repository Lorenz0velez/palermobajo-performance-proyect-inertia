class AddPerceptionFormFields < ActiveRecord::Migration[8.1]
  def change
    add_column :training_perceptions, :fatigue_level, :integer   # 1-5
    add_column :training_perceptions, :injury_impact, :integer   # 1=No 2=Leve 3=Moderado 4=Fuerte
  end
end
