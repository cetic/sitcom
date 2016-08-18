Rails.application.routes.draw do

  # Devise

  devise_for :users

  # Admin

  namespace :admin do
    resources :users
    resources :labs

    resources :fields do
      resources :children, controller: 'fields'
    end

    root to: 'users#index', as: :root
  end

  # API

  namespace :api do
    # nothing ATM
  end

  # App

  resource :profile do
    resource :password
    resource :current_lab
  end

  resources :labs, :path => ''
  resources :labs, :path => '', :only => [] do
    resources :contacts do
      resources :notes
    end

    resources :organizations do
      resources :notes

      collection do
        get :options
      end
    end

    resources :projects do
      resources :notes
    end

    resources :events do
      resources :notes
    end
  end

  root to: 'labs#index'
end
