Rails.application.routes.draw do

  # Devise

  devise_for :users, controllers: {
    sessions:  'users/sessions',
    passwords: 'users/passwords'
  }

  # App

  resources :contacts

  resource :profile do
    resource :password
  end

  # Root

  root to: 'contacts#index'

  # Admin

  namespace :admin do
    resources :users

    root to: 'users#index', as: :root
  end

  # API

end
