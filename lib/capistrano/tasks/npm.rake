namespace :deploy do
  namespace :npm do
    task :install do
      stage = fetch(:stage).to_s

      on roles(:app) do
        execute "cd #{release_path} && #{fetch(:rbenv_prefix)} bundle exec rake npm:install RAILS_ENV=#{stage}"
      end
    end
  end
end
