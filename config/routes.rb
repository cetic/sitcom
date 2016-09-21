Rails.application.routes.draw do

  # Devise

  devise_for :users

  # Admin

  namespace :admin do
    resources :users do
      resources :lab_user_links do
        collection do
          put :update_many
        end
      end
    end

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

      collection do
        get :options
        get :export
      end
    end

    resources :organizations do
      resources :notes

      collection do
        get :options
        get :status_options
        get :export
      end
    end

    resources :projects do
      resources :notes

      collection do
        get :options
      end
    end

    resources :events do
      resources :notes

      collection do
        get :options
      end
    end

    resources :fields do
      collection do
        get :options
      end
    end

    resources :tags do
      collection do
        get :options
      end
    end
  end

  root to: 'labs#index'
end
