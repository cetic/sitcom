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
  end

  scope ':lab_slug' do
    resources :contacts

    root to: 'contacts#index'
  end

  root to: 'application#root', as: :main_root
end
