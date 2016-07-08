Rails.application.routes.draw do

  # Devise

  devise_for :users, controllers: {
    sessions:  'users/sessions',
    passwords: 'users/passwords'
  }

  # App

  resources :contacts

  # Root

  root to: 'contacts#index'

  # Admin

  # API

end
