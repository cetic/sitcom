# bundle exec cap staging deploy:reset

namespace :deploy do
  task :reset do
    stage = fetch(:stage).to_s

    on roles(:app) do
      execute "cd #{current_path} && #{fetch(:rbenv_prefix)} bundle exec rake app:reset RAILS_ENV=#{stage}"
    end
  end
end
