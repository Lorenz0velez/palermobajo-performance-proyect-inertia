class AddWellnessFormFields < ActiveRecord::Migration[8.1]
  def change
    add_column :player_wellness, :energy_level, :integer     # 1=Excelente 2=Muy Bien 3=Bien 4=Regular 5=Mal
    add_column :player_wellness, :leg_feel, :integer          # 1=Livianas 2=Normales 3=Pesadas 4=Muy Pesadas
    add_column :player_wellness, :pain_affects_movement, :integer  # 1=No 2=Un Poco 3=Mucho
    add_column :player_wellness, :training_readiness, :integer     # 1=Normal 2=Regulando 3=Muy Liviano
  end
end
