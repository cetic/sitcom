Rails.application.routes.draw do

  # Devise

  devise_for :users

  # Admin

  namespace :admin do
    resources :users
    resources :labs

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
    resources :contacts
    resources :organizations
  end

  root to: 'labs#index'
end
