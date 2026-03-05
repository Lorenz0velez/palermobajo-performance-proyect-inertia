# frozen_string_literal: true

class NutritionMailer < ApplicationMailer
  def convocatoria(convocado)
    @convocado = convocado
    @player    = convocado.player
    @session   = convocado.nutrition_session

    user = @player.user
    return unless user&.email.present?

    mail to: user.email,
         subject: "Convocatoria Nutrición – #{@session.date.strftime('%d/%m/%Y')}"
  end
end
