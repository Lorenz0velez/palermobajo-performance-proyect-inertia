# frozen_string_literal: true

class Player::TrainingsController < InertiaController
  # Entrenamiento 16 = Lunes 02/03/2026
  # Días: Lunes, Martes, Jueves
  # Lesión nariz: desde 14/02 — ausente T9-T14, volvió T15 (26/02)

  FAKE_UPCOMING = [
    { id: 18, date: "2026-03-05", start_time: "19:00", end_time: "21:00", training_type: "Físico",          objective: "Potencia y velocidad" },
    { id: 19, date: "2026-03-09", start_time: "19:00", end_time: "21:00", training_type: "Técnica + Línea", objective: "Lineout y scrum" },
    { id: 20, date: "2026-03-10", start_time: "19:00", end_time: "21:00", training_type: "Táctica",         objective: "Preparación Fecha 1 vs Universitario" },
    { id: 21, date: "2026-03-12", start_time: "19:00", end_time: "21:00", training_type: "Match practice",  objective: "Juego interno — última previa" }
  ]

  FAKE_PAST = [
    { id: 17, date: "2026-03-03", training_type: "Técnica + Línea",  present: true,  minutes_participated: 90, absence_reason: nil },
    { id: 16, date: "2026-03-02", training_type: "Físico",           present: true,  minutes_participated: 95, absence_reason: nil },
    { id: 15, date: "2026-02-26", training_type: "Físico + Scrum",   present: true,  minutes_participated: 80, absence_reason: nil },
    { id: 14, date: "2026-02-24", training_type: "Táctica",          present: false, minutes_participated: nil, absence_reason: "Lesión (nariz)" },
    { id: 13, date: "2026-02-23", training_type: "Físico",           present: false, minutes_participated: nil, absence_reason: "Lesión (nariz)" },
    { id: 12, date: "2026-02-19", training_type: "Match practice",   present: false, minutes_participated: nil, absence_reason: "Lesión (nariz)" },
    { id: 11, date: "2026-02-17", training_type: "Físico + Técnica", present: false, minutes_participated: nil, absence_reason: "Lesión (nariz)" },
    { id: 10, date: "2026-02-16", training_type: "Táctica",          present: false, minutes_participated: nil, absence_reason: "Lesión (nariz)" },
    { id:  9, date: "2026-02-12", training_type: "Físico + Scrum",   present: true,  minutes_participated: 90, absence_reason: nil },
    { id:  8, date: "2026-02-10", training_type: "Técnica",          present: true,  minutes_participated: 85, absence_reason: nil }
  ]

  FAKE_TRAINING_DETAIL = {
    17 => { date: "2026-03-03", start_time: "19:00", end_time: "21:00", training_type: "Técnica + Línea",  objective: "Lineout pod drive",         notes: nil, present: true,  minutes: 90, rpe: 6, load: 540, comments: "Bien el lineout" },
    16 => { date: "2026-03-02", start_time: "19:00", end_time: "21:00", training_type: "Físico",           objective: "Potencia de tren inferior",  notes: nil, present: true,  minutes: 95, rpe: 8, load: 760, comments: "Muy duro, piernas al límite" },
    15 => { date: "2026-02-26", start_time: "19:00", end_time: "21:00", training_type: "Físico + Scrum",   objective: "Empuje de scrum",            notes: nil, present: true,  minutes: 80, rpe: 7, load: 560, comments: "Primer entrenamiento post lesión" },
    14 => { date: "2026-02-24", start_time: "19:00", end_time: "21:00", training_type: "Táctica",          objective: "Ataque estructurado",        notes: nil, present: false, minutes: nil, rpe: nil, load: nil, comments: nil },
    13 => { date: "2026-02-23", start_time: "19:00", end_time: "21:00", training_type: "Físico",           objective: "Aceleraciones y contacto",   notes: nil, present: false, minutes: nil, rpe: nil, load: nil, comments: nil },
    12 => { date: "2026-02-19", start_time: "19:00", end_time: "21:00", training_type: "Match practice",   objective: "Juego interno 15 vs 15",     notes: nil, present: false, minutes: nil, rpe: nil, load: nil, comments: nil },
    11 => { date: "2026-02-17", start_time: "19:00", end_time: "21:00", training_type: "Físico + Técnica", objective: "Velocidad y espacios",       notes: nil, present: false, minutes: nil, rpe: nil, load: nil, comments: nil },
    10 => { date: "2026-02-16", start_time: "19:00", end_time: "21:00", training_type: "Táctica",          objective: "Defensa en bloque",          notes: nil, present: false, minutes: nil, rpe: nil, load: nil, comments: nil },
     9 => { date: "2026-02-12", start_time: "19:00", end_time: "21:00", training_type: "Físico + Scrum",   objective: "Empuje de scrum",            notes: nil, present: true,  minutes: 90, rpe: 9, load: 810, comments: "Scrum muy intenso" },
     8 => { date: "2026-02-10", start_time: "19:00", end_time: "21:00", training_type: "Técnica",          objective: "Lineout básico",             notes: nil, present: true,  minutes: 85, rpe: 7, load: 595, comments: nil }
  }

  def index
    render inertia: "player/trainings/index", props: {
      upcoming: FAKE_UPCOMING,
      past: FAKE_PAST
    }
  end

  def show
    id     = params[:id].to_i
    detail = FAKE_TRAINING_DETAIL[id] || FAKE_TRAINING_DETAIL[17]
    render inertia: "player/trainings/show", props: { training: detail.merge(id: id) }
  end
end
