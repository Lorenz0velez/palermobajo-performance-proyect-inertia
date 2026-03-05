# frozen_string_literal: true

class Admin::PlayersController < Admin::ApplicationController
  def index
    players = Player.includes(:functional_role, :categories, :user)
                    .order(:last_name, :first_name)

    render inertia: "admin/players/index", props: {
      players: players.map { |p| serialize_player(p) }
    }
  end

  def show
    player = Player.includes(:functional_role, :categories, :user).find(params[:id])
    render inertia: "admin/players/show", props: { player: serialize_player(player) }
  end

  def new
    render inertia: "admin/players/new", props: {
      genders: Gender.order(:name).map { |g| { id: g.id, name: g.name } }
    }
  end

  def create
    player = Player.new(player_params)

    if player.save
      redirect_to edit_admin_player_path(player), notice: "Jugador #{player.full_name} creado. Ahora podés asignar categoría y rol."
    else
      render inertia: "admin/players/new", props: {
        errors: player.errors.as_json,
        genders: Gender.order(:name).map { |g| { id: g.id, name: g.name } }
      }
    end
  end

  def edit
    player = Player.includes(:functional_role, :user).find(params[:id])
    season = Season.order(created_at: :desc).first
    history = player.player_categories
                    .includes(:category, :season)
                    .order(start_date: :desc)
                    .map do |pc|
                      {
                        id:         pc.id,
                        category:   pc.category.name,
                        season:     pc.season.name,
                        start_date: pc.start_date&.strftime("%d/%m/%Y"),
                        end_date:   pc.end_date&.strftime("%d/%m/%Y"),
                        active:     pc.active
                      }
                    end

    render inertia: "admin/players/edit", props: {
      player:           serialize_player(player),
      category_history: history,
      functional_roles: FunctionalRole.order(:name).map { |fr| { id: fr.id, name: fr.name } },
      categories:       Category.order(:name).map       { |c|  { id: c.id,  name: c.name  } },
      genders:          Gender.order(:name).map          { |g|  { id: g.id,  name: g.name  } },
      current_season:   season ? { id: season.id, name: season.name } : nil
    }
  end

  def update
    player = Player.find(params[:id])

    if player.update(player_params)
      redirect_to edit_admin_player_path(player), notice: "Datos del jugador actualizados."
    else
      render inertia: "admin/players/edit", props: {
        player:           serialize_player(player),
        errors:           player.errors.as_json,
        category_history: [],
        functional_roles: FunctionalRole.order(:name).map { |fr| { id: fr.id, name: fr.name } },
        categories:       Category.order(:name).map       { |c|  { id: c.id,  name: c.name  } },
        genders:          Gender.order(:name).map          { |g|  { id: g.id,  name: g.name  } },
        current_season:   nil
      }
    end
  end

  # POST /admin/players/:id/assign_category
  def assign_category
    player  = Player.find(params[:id])
    category = Category.find(params[:category_id])
    season  = Season.order(created_at: :desc).first

    ActiveRecord::Base.transaction do
      # Close current open assignment in this season
      player.player_categories
            .where(season: season, end_date: nil)
            .update_all(end_date: Date.today, active: false)

      player.player_categories.create!(
        category:   category,
        season:     season,
        start_date: Date.today,
        active:     true
      )
    end

    redirect_to edit_admin_player_path(player), notice: "Categoría asignada: #{category.name}."
  rescue ActiveRecord::RecordInvalid => e
    redirect_to edit_admin_player_path(player), alert: "Error: #{e.message}"
  end

  # POST /admin/players/:id/assign_role
  def assign_role
    player = Player.find(params[:id])
    role   = FunctionalRole.find(params[:functional_role_id])
    player.update!(functional_role: role)
    redirect_to edit_admin_player_path(player), notice: "Rol asignado: #{role.name}."
  rescue ActiveRecord::RecordInvalid => e
    redirect_to edit_admin_player_path(player), alert: "Error: #{e.message}"
  end

  private

  def player_params
    params.require(:player).permit(:first_name, :last_name, :dni, :birth_date, :gender_id)
  end

  def serialize_player(p)
    {
      id:                  p.id,
      first_name:          p.first_name,
      last_name:           p.last_name,
      full_name:           p.full_name,
      dni:                 p.dni,
      birth_date:          p.birth_date&.strftime("%Y-%m-%d"),
      birth_date_display:  p.birth_date&.strftime("%d/%m/%Y"),
      active:              p.active,
      functional_role_id:  p.functional_role_id,
      functional_role:     p.functional_role&.name,
      categories:          p.categories.map(&:name),
      linked_user:         p.user ? { id: p.user.id, email: p.user.email } : nil
    }
  end
end
