# frozen_string_literal: true

Rails.application.routes.draw do
  get 'inertia-example', to: 'inertia_example#index'
  get  "sign_in", to: "sessions#new", as: :sign_in
  post "sign_in", to: "sessions#create"
  get  "sign_up", to: "users#new", as: :sign_up
  post "sign_up", to: "users#create"

  resources :sessions, only: [:destroy]
  resource :users, only: [:destroy]

  namespace :identity do
    resource :email_verification, only: [:show, :create]
    resource :password_reset,     only: [:new, :edit, :create, :update]
  end

  get :dashboard, to: "dashboard#index"

  # Forms públicos (sin login)
  get  "bienestar",  to: "wellness#new",    as: :wellness_form
  post "bienestar",  to: "wellness#create"
  get  "percepcion", to: "perception#new",  as: :perception_form
  post "percepcion", to: "perception#create"

  namespace :player do
    get :home, to: "home#index"
    resources :matches, only: [:index, :show]
    resources :trainings, only: [:index, :show] do
      member do
        post :perception
      end
    end
    get :profile, to: "profile#show"
    get :evaluaciones, to: "evaluaciones#index"
    get :nutricion, to: "nutricion#index"
    resources :nutrition_sessions, only: [:index, :show] do
      member do
        post :book_slot
        delete :cancel
      end
    end
  end

  namespace :admin do
    get :home, to: "home#index"
    resources :users, only: [:index, :show] do
      member do
        post :approve
        post :reject
      end
    end
    resources :players, only: [:index, :new, :create, :show, :edit, :update] do
      member do
        post :assign_category
        post :assign_role
      end
    end
  end

  namespace :coach do
    get :home, to: "home#index"
    resources :squad, only: [:index, :show]
    resources :trainings, only: [:index, :show, :new, :create, :edit, :update]
    resources :matches, only: [:index, :new, :create, :show, :edit, :update] do
      member do
        post :update_squad
      end
    end
    resources :stats, only: [:index, :show]
    get "stats/matches/:id", to: "stats#match_detail"
  end

  namespace :pf do
    get :home, to: "home#index"
    resources :squad, only: [:index, :show] do
      member do
        post :evaluate
      end
    end
    resources :trainings, only: [:index, :show, :new, :create, :edit, :update, :destroy]
    resources :eval_types, only: [:index, :new, :create, :edit, :update] do
      member { patch :toggle }
    end
    resources :objectives, only: [:index, :new, :create]
  end

  namespace :nutricionista do
    get :home, to: "home#index"
    resources :squad, only: [:index, :show] do
      member do
        post :weigh
        post :plan
      end
    end
    resources :nutrition_sessions do
      member do
        post :generate_slots
        post :publish
        post :complete
        post :add_convocado
        delete :remove_convocado
      end
      resources :slots, controller: "nutrition_slots", only: [] do
        member do
          post :weigh_player
        end
      end
    end
  end

  namespace :settings do
    resource :profile, only: [:show, :update]
    resource :password, only: [:show, :update]
    resource :email, only: [:show, :update]
    resources :sessions, only: [:index]
    inertia :appearance
  end

  root "home#index"

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
end
