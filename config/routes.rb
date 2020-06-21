require 'sidekiq/web'

Rails.application.routes.draw do

  # Devise

  devise_for :users

  resources :registrations, only: %i(new create)

  # Sidekiq

  authenticate :user, lambda { |u| u.admin? } do
    mount Sidekiq::Web => '/sidekiq'

    Sidekiq::Web.set :session_secret, Rails.application.secrets[:secret_key_base]
  end

  # Admin

  namespace :admin do
    resources :users do
      resources :lab_user_links do
        collection do
          put :update_many
        end
      end

      resource :api_key do
        member do
          put :reset
        end
      end
    end

    resources :labs do
      resources :custom_fields

      resources :fields do
        resources :children, controller: 'fields'
      end
    end

    root to: 'users#index', as: :root
  end

  # API

  namespace :api do
    resources :users, only: [:index, :show, :create, :update, :destroy] do
      resources :permissions, :controller => :lab_user_links,
                              :only       => [:index, :show, :update, :destroy]

      post '/permissions/:id' => 'lab_user_links#create'
    end

    resources :labs, only: [:index, :show] do
      resources :contacts, only: [:index, :show, :create, :update, :destroy] do
        resources :organizations, only: [:index, :show]
        resources :projects,      only: [:index, :show]
        resources :events,        only: [:index, :show]
        resources :tags,          only: [:index, :create]

        delete '/tags' => 'tags#destroy'
      end

      resources :organizations, only: [:index, :show]
      resources :projects,      only: [:index, :show]
      resources :events,        only: [:index, :show]

      resources :tags,        only: [:index]
    end
  end

  # App

  resource :profile do
    resource :password
    resource :current_lab
  end

  # Leave before labs
  root to: 'pages#home'

  resources :labs, :path => ''
  resources :labs, :path => '', :only => [] do
    resources :contacts do
      resources :notes
      resources :documents
      resources :log_entries
      resources :custom_fields

      member do
        get :follow_status
        get :follow
        get :unfollow
      end

      collection do
        get    :options
        get    :export
        post   :mailchimp_export
        delete :mass_destroy

        resources :saved_searches, :item_type => 'contact'
      end
    end

    resources :organizations do
      resources :notes
      resources :documents
      resources :log_entries
      resources :custom_fields

      member do
        get :follow_status
        get :follow
        get :unfollow
      end

      collection do
        get    :options
        get    :status_options
        get    :export
        delete :mass_destroy

        resources :saved_searches, :item_type => 'organization'
      end
    end

    resources :projects do
      resources :notes
      resources :documents
      resources :log_entries
      resources :custom_fields

      member do
        get :follow_status
        get :follow
        get :unfollow
      end

      collection do
        get    :options
        get    :export
        delete :mass_destroy

        resources :saved_searches, :item_type => 'project'
      end
    end

    resources :events do
      resources :notes
      resources :documents
      resources :log_entries
      resources :custom_fields

      member do
        get :follow_status
        get :follow
        get :unfollow
      end

      collection do
        get    :options
        get    :export
        delete :mass_destroy

        resources :saved_searches, :item_type => 'event'
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

    resources :log_entries, only: [:index]

    # LINKS BETWEEN ITEMS
    [ :contact_organization_links, :contact_event_links,
      :contact_project_links, :event_organization_links,
      :organization_project_links, :event_project_links
    ].each do |item1_item2_link|
      resources item1_item2_link, :only => [:update] do
        collection do
          get :options
        end
      end
    end

    resources :item_imports, :only => [:new, :create] do
      collection do
        get :sample
      end
    end
  end
end
