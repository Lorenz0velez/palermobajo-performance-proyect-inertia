# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_03_05_154421) do
  create_table "active_storage_attachments", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.bigint "record_id", null: false
    t.string "record_type", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.string "content_type"
    t.datetime "created_at", null: false
    t.string "filename", null: false
    t.string "key", null: false
    t.text "metadata"
    t.string "service_name", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "categories", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.integer "gender_id", null: false
    t.string "name", null: false
    t.integer "sport_id", null: false
    t.datetime "updated_at", null: false
    t.index ["gender_id"], name: "index_categories_on_gender_id"
    t.index ["sport_id"], name: "index_categories_on_sport_id"
  end

  create_table "coach_categories", force: :cascade do |t|
    t.integer "category_id", null: false
    t.integer "coach_id", null: false
    t.datetime "created_at", null: false
    t.date "end_date"
    t.string "role_function"
    t.integer "season_id", null: false
    t.date "start_date"
    t.datetime "updated_at", null: false
    t.index ["category_id"], name: "index_coach_categories_on_category_id"
    t.index ["coach_id"], name: "index_coach_categories_on_coach_id"
    t.index ["season_id"], name: "index_coach_categories_on_season_id"
  end

  create_table "coaches", force: :cascade do |t|
    t.boolean "active", default: true
    t.datetime "created_at", null: false
    t.string "first_name"
    t.string "last_name"
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.index ["user_id"], name: "index_coaches_on_user_id", unique: true
  end

  create_table "functional_roles", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.string "position_group"
    t.integer "sport_id", null: false
    t.datetime "updated_at", null: false
    t.index ["sport_id"], name: "index_functional_roles_on_sport_id"
  end

  create_table "genders", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.datetime "updated_at", null: false
  end

  create_table "gps_metric_types", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.string "unit"
    t.datetime "updated_at", null: false
  end

  create_table "gps_session_metrics", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.integer "gps_metric_type_id", null: false
    t.integer "gps_session_id", null: false
    t.datetime "updated_at", null: false
    t.float "value"
    t.index ["gps_metric_type_id"], name: "index_gps_session_metrics_on_gps_metric_type_id"
    t.index ["gps_session_id"], name: "index_gps_session_metrics_on_gps_session_id"
  end

  create_table "gps_session_types", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.datetime "updated_at", null: false
  end

  create_table "gps_sessions", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.integer "device_id"
    t.integer "duration_min"
    t.string "file_name"
    t.integer "functional_role_id"
    t.integer "gps_session_type_id"
    t.integer "match_id"
    t.integer "player_id", null: false
    t.datetime "recorded_at"
    t.integer "training_id"
    t.datetime "updated_at", null: false
    t.index ["functional_role_id"], name: "index_gps_sessions_on_functional_role_id"
    t.index ["gps_session_type_id"], name: "index_gps_sessions_on_gps_session_type_id"
    t.index ["match_id"], name: "index_gps_sessions_on_match_id"
    t.index ["player_id"], name: "index_gps_sessions_on_player_id"
    t.index ["training_id"], name: "index_gps_sessions_on_training_id"
  end

  create_table "injuries", force: :cascade do |t|
    t.string "body_zone"
    t.datetime "created_at", null: false
    t.date "end_date"
    t.integer "injury_type_id", null: false
    t.text "notes"
    t.integer "player_id", null: false
    t.date "start_date"
    t.datetime "updated_at", null: false
    t.boolean "validated", default: false
    t.index ["injury_type_id"], name: "index_injuries_on_injury_type_id"
    t.index ["player_id"], name: "index_injuries_on_player_id"
  end

  create_table "injury_types", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.datetime "updated_at", null: false
  end

  create_table "match_player_stats", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.integer "match_player_id", null: false
    t.integer "match_stat_type_id", null: false
    t.datetime "updated_at", null: false
    t.decimal "value", precision: 10, scale: 2
    t.index ["match_player_id"], name: "index_match_player_stats_on_match_player_id"
    t.index ["match_stat_type_id"], name: "index_match_player_stats_on_match_stat_type_id"
  end

  create_table "match_players", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.integer "match_id", null: false
    t.integer "minutes_played"
    t.integer "player_id", null: false
    t.integer "position_id"
    t.boolean "starter", default: false
    t.datetime "updated_at", null: false
    t.index ["match_id"], name: "index_match_players_on_match_id"
    t.index ["player_id"], name: "index_match_players_on_player_id"
    t.index ["position_id"], name: "index_match_players_on_position_id"
  end

  create_table "match_role_references", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.integer "functional_role_id", null: false
    t.integer "gps_metric_type_id", null: false
    t.decimal "reference_value"
    t.datetime "updated_at", null: false
    t.index ["functional_role_id"], name: "index_match_role_references_on_functional_role_id"
    t.index ["gps_metric_type_id"], name: "index_match_role_references_on_gps_metric_type_id"
  end

  create_table "match_stat_types", force: :cascade do |t|
    t.boolean "collective", default: false
    t.datetime "created_at", null: false
    t.string "description"
    t.string "name", null: false
    t.string "unit"
    t.datetime "updated_at", null: false
  end

  create_table "match_stats", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.integer "match_id", null: false
    t.integer "match_stat_type_id", null: false
    t.datetime "updated_at", null: false
    t.decimal "value", precision: 10, scale: 2
    t.index ["match_id"], name: "index_match_stats_on_match_id"
    t.index ["match_stat_type_id"], name: "index_match_stats_on_match_stat_type_id"
  end

  create_table "matches", force: :cascade do |t|
    t.integer "category_id", null: false
    t.datetime "created_at", null: false
    t.date "date"
    t.boolean "home"
    t.string "kickoff_time"
    t.string "opponent"
    t.integer "points_against"
    t.integer "points_for"
    t.string "team_name"
    t.integer "tournament_id", null: false
    t.datetime "updated_at", null: false
    t.string "video_link"
    t.index ["category_id"], name: "index_matches_on_category_id"
    t.index ["tournament_id"], name: "index_matches_on_tournament_id"
  end

  create_table "nutrition_convocados", force: :cascade do |t|
    t.datetime "cancelled_at"
    t.datetime "created_at", null: false
    t.datetime "notified_at"
    t.integer "nutrition_session_id", null: false
    t.integer "nutrition_slot_id"
    t.integer "player_id", null: false
    t.datetime "updated_at", null: false
    t.index ["nutrition_session_id", "player_id"], name: "idx_on_nutrition_session_id_player_id_c046a53612", unique: true
    t.index ["nutrition_session_id"], name: "index_nutrition_convocados_on_nutrition_session_id"
    t.index ["nutrition_slot_id"], name: "index_nutrition_convocados_on_nutrition_slot_id"
    t.index ["player_id"], name: "index_nutrition_convocados_on_player_id"
  end

  create_table "nutrition_plans", force: :cascade do |t|
    t.text "breakfast"
    t.datetime "created_at", null: false
    t.integer "created_by_id"
    t.date "date"
    t.text "dinner"
    t.text "extra_notes"
    t.text "lunch"
    t.integer "player_id"
    t.text "recommendations"
    t.text "snacks"
    t.datetime "updated_at", null: false
    t.index ["player_id"], name: "index_nutrition_plans_on_player_id"
  end

  create_table "nutrition_sessions", force: :cascade do |t|
    t.integer "capacity_per_slot", default: 1, null: false
    t.datetime "created_at", null: false
    t.integer "created_by_id"
    t.date "date", null: false
    t.string "status", default: "draft", null: false
    t.datetime "updated_at", null: false
    t.index ["created_by_id"], name: "index_nutrition_sessions_on_created_by_id"
  end

  create_table "nutrition_slots", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.time "end_time", null: false
    t.integer "nutrition_session_id", null: false
    t.time "start_time", null: false
    t.datetime "updated_at", null: false
    t.index ["nutrition_session_id"], name: "index_nutrition_slots_on_nutrition_session_id"
  end

  create_table "physical_evaluations", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.date "date", null: false
    t.integer "physical_test_id", null: false
    t.integer "player_id", null: false
    t.datetime "updated_at", null: false
    t.boolean "validated", default: false
    t.integer "validated_by_id"
    t.decimal "value"
    t.index ["physical_test_id"], name: "index_physical_evaluations_on_physical_test_id"
    t.index ["player_id"], name: "index_physical_evaluations_on_player_id"
    t.index ["validated_by_id"], name: "index_physical_evaluations_on_validated_by_id"
  end

  create_table "physical_histories", force: :cascade do |t|
    t.decimal "bmi"
    t.datetime "created_at", null: false
    t.date "date", null: false
    t.string "fat_direction"
    t.decimal "fat_mass_kg"
    t.decimal "height_cm"
    t.string "muscle_direction"
    t.decimal "muscle_mass_kg"
    t.integer "player_id", null: false
    t.datetime "updated_at", null: false
    t.decimal "weight_kg"
    t.index ["player_id"], name: "index_physical_histories_on_player_id"
  end

  create_table "physical_objectives", force: :cascade do |t|
    t.integer "category_id", null: false
    t.datetime "created_at", null: false
    t.date "end_date"
    t.string "formula"
    t.integer "functional_role_id", null: false
    t.decimal "green_threshold"
    t.integer "physical_test_id", null: false
    t.decimal "red_threshold"
    t.date "start_date"
    t.string "threshold_type"
    t.datetime "updated_at", null: false
    t.decimal "yellow_threshold"
    t.index ["category_id"], name: "index_physical_objectives_on_category_id"
    t.index ["functional_role_id"], name: "index_physical_objectives_on_functional_role_id"
    t.index ["physical_test_id"], name: "index_physical_objectives_on_physical_test_id"
  end

  create_table "physical_tests", force: :cascade do |t|
    t.boolean "active", default: true, null: false
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.integer "sport_id", null: false
    t.string "unit"
    t.datetime "updated_at", null: false
    t.index ["sport_id"], name: "index_physical_tests_on_sport_id"
  end

  create_table "player_categories", force: :cascade do |t|
    t.boolean "active", default: true
    t.integer "category_id", null: false
    t.datetime "created_at", null: false
    t.date "end_date"
    t.integer "player_id", null: false
    t.integer "season_id", null: false
    t.date "start_date"
    t.datetime "updated_at", null: false
    t.index ["category_id"], name: "index_player_categories_on_category_id"
    t.index ["player_id"], name: "index_player_categories_on_player_id"
    t.index ["season_id"], name: "index_player_categories_on_season_id"
  end

  create_table "player_reports", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.date "end_date"
    t.string "pdf_path"
    t.integer "player_id", null: false
    t.string "report_type"
    t.date "start_date"
    t.datetime "updated_at", null: false
    t.index ["player_id"], name: "index_player_reports_on_player_id"
  end

  create_table "player_wellness", force: :cascade do |t|
    t.text "comments"
    t.datetime "completed_at"
    t.datetime "created_at", null: false
    t.date "date", null: false
    t.integer "energy_level"
    t.integer "fatigue"
    t.integer "leg_feel"
    t.integer "mood"
    t.integer "pain"
    t.integer "pain_affects_movement"
    t.integer "player_id", null: false
    t.decimal "sleep_hours"
    t.integer "sleep_quality"
    t.integer "stress"
    t.integer "training_readiness"
    t.datetime "updated_at", null: false
    t.index ["player_id", "date"], name: "index_player_wellness_on_player_id_and_date", unique: true
    t.index ["player_id"], name: "index_player_wellness_on_player_id"
  end

  create_table "players", force: :cascade do |t|
    t.boolean "active", default: true
    t.text "biometric"
    t.date "birth_date"
    t.datetime "created_at", null: false
    t.string "dni", null: false
    t.string "first_name"
    t.integer "functional_role_id"
    t.integer "gender_id"
    t.string "last_name"
    t.datetime "updated_at", null: false
    t.integer "user_id"
    t.index ["dni"], name: "index_players_on_dni", unique: true
    t.index ["functional_role_id"], name: "index_players_on_functional_role_id"
    t.index ["gender_id"], name: "index_players_on_gender_id"
    t.index ["user_id"], name: "index_players_on_user_id"
  end

  create_table "positions", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.integer "functional_role_id", null: false
    t.string "name", null: false
    t.datetime "updated_at", null: false
    t.index ["functional_role_id"], name: "index_positions_on_functional_role_id"
  end

  create_table "roles", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.datetime "updated_at", null: false
  end

  create_table "seasons", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.date "end_date"
    t.string "name", null: false
    t.date "start_date"
    t.datetime "updated_at", null: false
  end

  create_table "sessions", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "ip_address"
    t.datetime "updated_at", null: false
    t.string "user_agent"
    t.integer "user_id", null: false
    t.index ["user_id"], name: "index_sessions_on_user_id"
  end

  create_table "sports", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.datetime "updated_at", null: false
  end

  create_table "teams", force: :cascade do |t|
    t.integer "category_id", null: false
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.datetime "updated_at", null: false
    t.index ["category_id"], name: "index_teams_on_category_id"
  end

  create_table "tournaments", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.integer "season_id", null: false
    t.datetime "updated_at", null: false
    t.index ["season_id"], name: "index_tournaments_on_season_id"
  end

  create_table "training_attendances", force: :cascade do |t|
    t.string "absence_reason"
    t.datetime "created_at", null: false
    t.text "notes"
    t.integer "participated_minutes"
    t.integer "player_id", null: false
    t.boolean "present", default: true
    t.integer "training_id", null: false
    t.datetime "updated_at", null: false
    t.index ["player_id"], name: "index_training_attendances_on_player_id"
    t.index ["training_id"], name: "index_training_attendances_on_training_id"
  end

  create_table "training_functional_roles", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.integer "functional_role_id", null: false
    t.integer "training_id", null: false
    t.datetime "updated_at", null: false
    t.index ["functional_role_id"], name: "index_training_functional_roles_on_functional_role_id"
    t.index ["training_id", "functional_role_id"], name: "idx_training_functional_roles_unique", unique: true
    t.index ["training_id"], name: "index_training_functional_roles_on_training_id"
  end

  create_table "training_perceptions", force: :cascade do |t|
    t.text "comments"
    t.datetime "created_at", null: false
    t.integer "fatigue_level"
    t.integer "injury_impact"
    t.integer "perceived_load"
    t.integer "player_id", null: false
    t.integer "rpe"
    t.integer "training_id", null: false
    t.datetime "updated_at", null: false
    t.index ["player_id"], name: "index_training_perceptions_on_player_id"
    t.index ["training_id"], name: "index_training_perceptions_on_training_id"
  end

  create_table "training_teams", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.integer "team_id", null: false
    t.integer "training_id", null: false
    t.datetime "updated_at", null: false
    t.index ["team_id"], name: "index_training_teams_on_team_id"
    t.index ["training_id"], name: "index_training_teams_on_training_id"
  end

  create_table "trainings", force: :cascade do |t|
    t.integer "category_id", null: false
    t.datetime "created_at", null: false
    t.integer "created_by_id"
    t.date "date"
    t.integer "duration_min"
    t.time "end_time"
    t.text "notes"
    t.string "objective"
    t.integer "season_id", null: false
    t.time "start_time"
    t.string "training_type"
    t.datetime "updated_at", null: false
    t.boolean "validated", default: false
    t.index ["category_id"], name: "index_trainings_on_category_id"
    t.index ["created_by_id"], name: "index_trainings_on_created_by_id"
    t.index ["season_id"], name: "index_trainings_on_season_id"
  end

  create_table "user_roles", force: :cascade do |t|
    t.boolean "active", default: true
    t.integer "category_id"
    t.datetime "created_at", null: false
    t.date "end_date"
    t.integer "role_id", null: false
    t.date "start_date"
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.index ["category_id"], name: "index_user_roles_on_category_id"
    t.index ["role_id"], name: "index_user_roles_on_role_id"
    t.index ["user_id"], name: "index_user_roles_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "dni"
    t.string "email", null: false
    t.string "first_name"
    t.string "last_name"
    t.string "name", null: false
    t.string "password_digest", null: false
    t.string "pending_role"
    t.datetime "updated_at", null: false
    t.boolean "verified", default: false, null: false
    t.index ["dni"], name: "index_users_on_dni", unique: true, where: "dni IS NOT NULL"
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "categories", "genders"
  add_foreign_key "categories", "sports"
  add_foreign_key "coach_categories", "categories"
  add_foreign_key "coach_categories", "coaches"
  add_foreign_key "coach_categories", "seasons"
  add_foreign_key "coaches", "users"
  add_foreign_key "functional_roles", "sports"
  add_foreign_key "gps_session_metrics", "gps_metric_types"
  add_foreign_key "gps_session_metrics", "gps_sessions"
  add_foreign_key "gps_sessions", "functional_roles"
  add_foreign_key "gps_sessions", "gps_session_types"
  add_foreign_key "gps_sessions", "matches"
  add_foreign_key "gps_sessions", "players"
  add_foreign_key "gps_sessions", "trainings"
  add_foreign_key "injuries", "injury_types"
  add_foreign_key "injuries", "players"
  add_foreign_key "match_player_stats", "match_players"
  add_foreign_key "match_player_stats", "match_stat_types"
  add_foreign_key "match_players", "matches"
  add_foreign_key "match_players", "players"
  add_foreign_key "match_players", "positions"
  add_foreign_key "match_role_references", "functional_roles"
  add_foreign_key "match_role_references", "gps_metric_types"
  add_foreign_key "match_stats", "match_stat_types"
  add_foreign_key "match_stats", "matches"
  add_foreign_key "matches", "categories"
  add_foreign_key "matches", "tournaments"
  add_foreign_key "nutrition_convocados", "nutrition_sessions"
  add_foreign_key "nutrition_convocados", "nutrition_slots"
  add_foreign_key "nutrition_convocados", "players"
  add_foreign_key "nutrition_sessions", "users", column: "created_by_id"
  add_foreign_key "nutrition_slots", "nutrition_sessions"
  add_foreign_key "physical_evaluations", "physical_tests"
  add_foreign_key "physical_evaluations", "players"
  add_foreign_key "physical_evaluations", "users", column: "validated_by_id"
  add_foreign_key "physical_histories", "players"
  add_foreign_key "physical_objectives", "categories"
  add_foreign_key "physical_objectives", "functional_roles"
  add_foreign_key "physical_objectives", "physical_tests"
  add_foreign_key "physical_tests", "sports"
  add_foreign_key "player_categories", "categories"
  add_foreign_key "player_categories", "players"
  add_foreign_key "player_categories", "seasons"
  add_foreign_key "player_reports", "players"
  add_foreign_key "player_wellness", "players"
  add_foreign_key "players", "functional_roles"
  add_foreign_key "players", "genders"
  add_foreign_key "players", "users"
  add_foreign_key "positions", "functional_roles"
  add_foreign_key "sessions", "users"
  add_foreign_key "teams", "categories"
  add_foreign_key "tournaments", "seasons"
  add_foreign_key "training_attendances", "players"
  add_foreign_key "training_attendances", "trainings"
  add_foreign_key "training_functional_roles", "functional_roles"
  add_foreign_key "training_functional_roles", "trainings"
  add_foreign_key "training_perceptions", "players"
  add_foreign_key "training_perceptions", "trainings"
  add_foreign_key "training_teams", "teams"
  add_foreign_key "training_teams", "trainings"
  add_foreign_key "trainings", "categories"
  add_foreign_key "trainings", "coaches", column: "created_by_id"
  add_foreign_key "trainings", "seasons"
  add_foreign_key "user_roles", "categories"
  add_foreign_key "user_roles", "roles"
  add_foreign_key "user_roles", "users"
end
